"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, ArrowRight, Bell, Gift, Tag, CheckCircle2, Loader2 } from "lucide-react";

const COOKIE_NAME = "ck_newsletter_popup_dismissed";
const DISMISS_DAYS = 30;
const SUBSCRIBE_DAYS = 365;

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Check cookie and show popup after delay
  useEffect(() => {
    // Check if forced open via URL query (?popup=newsletter)
    const urlParams = new URLSearchParams(window.location.search);
    const forceOpen = urlParams.get("popup") === "newsletter";

    const hasDismissed = document.cookie
      .split(";")
      .some((item) => item.trim().startsWith(`${COOKIE_NAME}=`));

    if (forceOpen) {
      setIsOpen(true);
      return;
    }

    if (!hasDismissed) {
      // Unobtrusive 3.5s delay after page load
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for programmatic open trigger (e.g. from footer button or tests)
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-newsletter-popup", handleOpen);
    return () => window.removeEventListener("open-newsletter-popup", handleOpen);
  }, []);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleDismiss();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    const focusTimer = setTimeout(() => {
      inputRef.current?.focus();
    }, 200);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(focusTimer);
    };
  }, [isOpen]);

  const setCookie = (days: number) => {
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${COOKIE_NAME}=1; path=/; max-age=${maxAge}; samesite=lax`;
  };

  const handleDismiss = () => {
    setIsOpen(false);
    setCookie(DISMISS_DAYS);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();

    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setStatus("success");
        setCookie(SUBSCRIBE_DAYS);
        // Automatically close after displaying celebration
        setTimeout(() => {
          setIsOpen(false);
        }, 2800);
      } else {
        setStatus("error");
        setErrorMessage(data?.error || "Could not complete subscription. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again later.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Subscribe to our Newsletter"
          data-od-id="newsletter-popup-modal"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            data-od-id="newsletter-popup-card"
            className="relative w-full max-w-[390px] sm:max-w-[660px] md:max-w-[760px] lg:max-w-[880px] overflow-hidden rounded-3xl bg-[#F5F3FF] border border-white/50 shadow-[0_30px_90px_-20px_rgba(88,28,135,0.45)] text-slate-900"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Close newsletter popup"
              data-od-id="newsletter-popup-close"
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/25 text-white/90 backdrop-blur-md transition-all hover:bg-black/45 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-white"
            >
              <X size={18} aria-hidden />
            </button>

            {/* Desktop / Tablet Layout: Background Image with Content Overlay */}
            <div className="relative min-h-[460px] md:min-h-[480px] lg:min-h-[500px] hidden sm:flex items-center">
              {/* Image Layer */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/images/newsletter/popup-bg.jpg"
                  alt="CK Propfirm Newsletter Mascot"
                  fill
                  priority
                  className="object-cover object-right"
                  sizes="(max-width: 1024px) 760px, 880px"
                />
                {/* Clean soft gradient fade protecting all text, input, and badges */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#F5F3FF] via-[#F5F3FF] via-[58%] to-transparent" />
              </div>

              {/* Text & Form Overlay Content (Left ~58%) */}
              <div className="relative z-10 w-full max-w-[440px] md:max-w-[480px] lg:max-w-[500px] p-7 md:p-10 flex flex-col justify-center">
                {/* Eyebrow */}
                <p className="text-[11px] md:text-xs font-bold tracking-[0.25em] text-[#6B7280] uppercase mb-1.5">
                  STAY AHEAD
                </p>

                {/* Main Headline */}
                <h2 className="font-[family-name:var(--font-jakarta)] text-3xl md:text-4xl lg:text-[44px] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#0F172A]">
                  Subscribe to our{" "}
                  <span className="block text-[#6D28D9] bg-gradient-to-r from-[#6D28D9] to-[#8B5CF6] bg-clip-text text-transparent">
                    Newsletter
                  </span>
                </h2>

                {/* Description Subtitle */}
                <p className="mt-2.5 text-[13px] md:text-[14px] leading-relaxed text-[#4B5563] font-medium max-w-[390px]">
                  Get the latest updates, exclusive offers, trading news and be the first to know about upcoming events.
                </p>

                {/* Input & Form Row */}
                {status === "success" ? (
                  <div className="mt-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 flex items-center gap-3 text-emerald-800">
                    <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold text-sm">You are subscribed!</p>
                      <p className="text-xs text-emerald-700">Check your inbox for exclusive updates and perks.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="mt-5">
                    <div className="relative flex items-center rounded-full border border-[#C4B5FD] bg-white/95 p-1.5 pl-4 shadow-md transition-all focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-[#7C3AED]/20">
                      <Mail size={18} className="text-[#7C3AED] shrink-0 mr-2.5" />
                      <input
                        ref={inputRef}
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (status === "error") setStatus("idle");
                        }}
                        placeholder="Enter your email address"
                        disabled={status === "loading"}
                        className="w-full bg-transparent text-sm text-[#0F172A] placeholder:text-[#9CA3AF] outline-none font-medium pr-2"
                        aria-label="Email address for newsletter"
                      />
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        data-od-id="newsletter-popup-submit"
                        className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#581C87] via-[#6D28D9] to-[#7C3AED] px-5 py-2.5 text-xs md:text-sm font-bold text-white shadow-md shadow-[#7C3AED]/30 transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 shrink-0"
                      >
                        {status === "loading" ? (
                          <>
                            <Loader2 size={15} className="animate-spin" />
                            <span>Joining...</span>
                          </>
                        ) : (
                          <>
                            <span>Subscribe</span>
                            <ArrowRight size={15} />
                          </>
                        )}
                      </button>
                    </div>

                    {status === "error" && (
                      <p className="mt-2 text-xs font-semibold text-rose-600 pl-3">
                        {errorMessage}
                      </p>
                    )}
                  </form>
                )}

                {/* 3 Feature Badges */}
                <div className="mt-5 pt-1 grid grid-cols-3 gap-2 sm:gap-2.5 max-w-[410px]">
                  {/* Badge 1: Exclusive Updates */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-[#EDE9FE] text-[#7C3AED] shadow-sm shrink-0">
                      <Bell size={14} />
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-bold leading-tight text-[#1E1B4B]">
                      <span>Exclusive</span>
                      <span className="block text-[#4B5563] font-semibold">Updates</span>
                    </div>
                  </div>

                  {/* Badge 2: Monthly Giveaways */}
                  <div className="flex items-center gap-1.5 sm:gap-2 border-l border-purple-200/80 pl-2 sm:pl-2.5">
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-[#EDE9FE] text-[#7C3AED] shadow-sm shrink-0">
                      <Gift size={14} />
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-bold leading-tight text-[#1E1B4B]">
                      <span>Monthly</span>
                      <span className="block text-[#4B5563] font-semibold">Giveaways</span>
                    </div>
                  </div>

                  {/* Badge 3: Special Offers */}
                  <div className="flex items-center gap-1.5 sm:gap-2 border-l border-purple-200/80 pl-2 sm:pl-2.5">
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-[#EDE9FE] text-[#7C3AED] shadow-sm shrink-0">
                      <Tag size={14} />
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-bold leading-tight text-[#1E1B4B]">
                      <span>Special</span>
                      <span className="block text-[#4B5563] font-semibold">Offers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Layout (<640px): Dedicated Responsive Stack */}
            <div className="sm:hidden flex flex-col">
              {/* Mascot Banner Header */}
              <div className="relative h-44 w-full overflow-hidden bg-gradient-to-b from-[#7C3AED]/20 to-[#F5F3FF]">
                <Image
                  src="/images/newsletter/popup-bg.jpg"
                  alt="CK Propfirm Newsletter Mascot"
                  fill
                  priority
                  className="object-cover object-[80%_center]"
                  sizes="390px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#F5F3FF] via-transparent to-black/25" />
              </div>

              {/* Text & Form Container */}
              <div className="p-5 pt-1 -mt-4 relative z-10 flex flex-col">
                <p className="text-[10px] font-bold tracking-[0.22em] text-[#6B7280] uppercase">
                  STAY AHEAD
                </p>

                <h2 className="mt-1 font-[family-name:var(--font-jakarta)] text-2xl font-extrabold leading-tight text-[#0F172A]">
                  Subscribe to our{" "}
                  <span className="text-[#6D28D9] block">Newsletter</span>
                </h2>

                <p className="mt-2 text-xs text-[#4B5563] font-medium leading-relaxed">
                  Get the latest updates, exclusive offers, trading news and be the first to know about upcoming events.
                </p>

                {/* Mobile Form */}
                {status === "success" ? (
                  <div className="mt-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3.5 flex items-center gap-2.5 text-emerald-800">
                    <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold text-xs">You are subscribed!</p>
                      <p className="text-[11px] text-emerald-700">Check your inbox for updates and perks.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-2">
                    <div className="flex items-center rounded-2xl border border-[#C4B5FD] bg-white px-3.5 py-2.5 shadow-sm focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-[#7C3AED]/20">
                      <Mail size={16} className="text-[#7C3AED] shrink-0 mr-2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (status === "error") setStatus("idle");
                        }}
                        placeholder="Enter your email address"
                        disabled={status === "loading"}
                        className="w-full bg-transparent text-xs text-[#0F172A] placeholder:text-[#9CA3AF] outline-none font-medium"
                        aria-label="Email address for newsletter"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#581C87] via-[#6D28D9] to-[#7C3AED] py-2.5 text-xs font-bold text-white shadow-md shadow-[#7C3AED]/30 active:scale-[0.98] transition-all"
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Joining...</span>
                        </>
                      ) : (
                        <>
                          <span>Subscribe</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>

                    {status === "error" && (
                      <p className="text-[11px] font-semibold text-rose-600 pt-0.5">
                        {errorMessage}
                      </p>
                    )}
                  </form>
                )}

                {/* 3 Badges on Mobile */}
                <div className="mt-4 pt-3 border-t border-purple-200/60 grid grid-cols-3 gap-2 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EDE9FE] text-[#7C3AED]">
                      <Bell size={13} />
                    </div>
                    <span className="text-[10px] font-bold text-[#1E1B4B] leading-tight">
                      Exclusive<br />Updates
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1 border-x border-purple-200/60 px-1">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EDE9FE] text-[#7C3AED]">
                      <Gift size={13} />
                    </div>
                    <span className="text-[10px] font-bold text-[#1E1B4B] leading-tight">
                      Monthly<br />Giveaways
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EDE9FE] text-[#7C3AED]">
                      <Tag size={13} />
                    </div>
                    <span className="text-[10px] font-bold text-[#1E1B4B] leading-tight">
                      Special<br />Offers
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
