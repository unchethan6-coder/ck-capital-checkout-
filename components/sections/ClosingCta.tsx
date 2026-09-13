"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Crown, Sparkles, Target, TrendingUp, X, Zap } from "lucide-react";
import { MagneticWrapper } from "@/components/fx/MagneticWrapper";
import { Container } from "@/components/shared/Container";
import { Link } from "@/i18n/navigation";

function fireConfetti() {
  if (typeof document === "undefined") return;
  const colors = ["#894CEF", "#703AD7", "#030A1C", "#F8FAFC", "#FFFFFF"];
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.inset = "0";
  container.style.pointerEvents = "none";
  container.style.zIndex = "9999";
  container.style.overflow = "hidden";
  document.body.appendChild(container);
  for (let i = 0; i < 28; i++) {
    const el = document.createElement("span");
    el.style.position = "absolute";
    el.style.left = Math.random() * 100 + "%";
    el.style.top = "-10px";
    el.style.width = 6 + Math.random() * 8 + "px";
    el.style.height = 8 + Math.random() * 10 + "px";
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    el.style.transform = `rotate(${Math.random() * 360}deg)`;
    el.style.transition = `transform ${900 + Math.random() * 600}ms cubic-bezier(0.25,0.46,0.45,0.94), top ${900 + Math.random() * 600}ms cubic-bezier(0.25,0.46,0.45,0.94), opacity 900ms ease`;
    container.appendChild(el);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.top = 100 + Math.random() * 20 + "%";
        el.style.transform = `rotate(${720 + Math.random() * 360}deg) translateX(${(Math.random() - 0.5) * 120}px)`;
        el.style.opacity = "0";
      });
    });
  }
  setTimeout(() => container.remove(), 1700);
}

const STAGES = [
  { key: "stage1" as const, icon: Target, accent: "bg-white border-gray-200" },
  { key: "stage2" as const, icon: Sparkles, accent: "bg-white border-gray-200" },
  { key: "stage3" as const, icon: Crown, accent: "bg-[#0A0A0C] border-[#0A0A0C] text-white" },
] as const;

export function ClosingCta() {
  const t = useTranslations("closingCta");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(paused);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      setActive((i) => (i + 1) % 3);
    }, 3200);
    return () => window.clearInterval(id);
  }, []);

  const handlePrimary = () => {
    fireConfetti();
    setTimeout(() => window.open("https://app.ckcapital.co.uk/signup", "_blank", "noopener,noreferrer"), 320);
  };

  // 3D tilt for card
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const rotateX = useSpring(useTransform(cardY, [-100, 100], [4, -4]), { stiffness: 300, damping: 20 });
  const rotateY = useSpring(useTransform(cardX, [-100, 100], [-4, 4]), { stiffness: 300, damping: 20 });
  const handleCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    cardX.set(e.clientX - rect.left - rect.width / 2);
    cardY.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleCardLeave = () => { cardX.set(0); cardY.set(0); };

  const stage = STAGES[active];
  const Icon = stage.icon;

  return (
    <section className="relative overflow-hidden bg-white py-16 text-[#0A0A0C] md:py-24" data-od-id="closing-cta">
      {/* Full white + radial blue like Section 3 (ProofShowcase) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 50% 38%, rgba(54,124,219,0.06) 0%, rgba(1,162,239,0.03) 45%, transparent 75%)",
        }}
      />

      <Container>
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-[#894CEF]/30 bg-[#F0F7FF] px-3 py-1 text-[11px] font-bold tracking-wide text-[#030A1C]"
          >
            <Zap size={12} className="fill-[#894CEF] text-[#A98BFF]" /> {t("eyebrow")}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.06 }}
            className="mt-4 font-[family-name:var(--font-jakarta)] text-3xl font-black leading-[1.05] tracking-tight text-[#0A0A0C] sm:text-4xl md:text-[42px]"
          >
            {t("titleNew")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.14 }}
            className="mx-auto mt-3 max-w-xl text-[14px] leading-6 text-[#6B7280] sm:text-[15px]"
          >
            {t("subtitleNew")}
          </motion.p>
        </div>

        <div
          className="relative mx-auto mt-10 max-w-[560px] md:mt-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Stepper — line aligned to circle center (18px), not container center */}
          <div className="relative flex items-start justify-between gap-2 pt-[1px]">
            <div className="absolute left-[18px] right-[18px] top-[18px] h-px bg-gray-200 md:left-[40px] md:right-[40px]" aria-hidden="true" />
            <motion.div
              className="absolute left-[18px] top-[18px] h-0.5 bg-[#894CEF] md:left-[40px]"
              style={{ maxWidth: "calc(100% - 36px)" }}
              animate={{ width: active === 0 ? "0%" : active === 1 ? "50%" : "100%" }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              aria-hidden="true"
            />
            {STAGES.map((s, i) => {
              const isActive = i === active;
              const isPast = i < active;
              return (
                <motion.button
                  key={s.key}
                  type="button"
                  onClick={() => setActive(i)}
                  data-od-id={`closing-step-${i + 1}`}
                  aria-current={isActive}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.08 + i * 0.07 }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative z-10 flex flex-col items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#894CEF] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  <span className="relative grid h-9 w-9 place-items-center">
                    <span
                      className={
                        isActive
                          ? "relative grid h-9 w-9 place-items-center rounded-full bg-[#0A0A0C] text-white shadow-[0_8px_20px_rgba(10,10,12,0.22)] ring-2 ring-[#894CEF] ring-offset-2 ring-offset-white"
                          : isPast
                            ? "relative grid h-9 w-9 place-items-center rounded-full bg-[#894CEF] text-[#030A1C] shadow-sm"
                            : "relative grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm"
                      }
                    >
                      <span className="text-[11px] font-black">{i + 1}</span>
                    </span>
                  </span>
                  <motion.span
                    animate={{ color: isActive ? "#0A0A0C" : "#9CA3AF" }}
                    className={isActive ? "text-[11px] font-bold tracking-wide" : "text-[11px] font-semibold tracking-wide"}
                  >
                    {t(`${s.key}Label`)}
                  </motion.span>
                </motion.button>
              );
            })}
          </div>

          {/* Single dynamic card with 3D tilt — instant switch */}
          <motion.div
            onMouseMove={handleCardMove}
            onMouseLeave={handleCardLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative mt-8 min-h-[188px] [perspective:900px]"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 8, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.99 }}
                transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={
                  active === 2
                    ? "relative overflow-hidden rounded-[20px] border border-[#0A0A0C] bg-[#0A0A0C] p-6 shadow-[0_24px_60px_-20px_rgba(10,10,12,0.45)] md:p-8"
                    : "relative overflow-hidden rounded-[20px] border border-gray-200 bg-white p-6 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.14)] md:p-8"
                }
              >
                {/* Top accent — instant, no delay */}
                <div className={active === 2 ? "absolute left-0 right-0 top-0 h-1 bg-[#894CEF]" : "absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#703AD7] to-[#894CEF]"} />
                {/* Sheen — subtle, no delay */}
                <motion.div
                  className="pointer-events-none absolute inset-0 opacity-0"
                  style={{
                    background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
                  }}
                  animate={{ x: ["-100%", "200%"], opacity: [0, 0.7, 0] }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  key={`sheen-${active}`}
                />
                {active === 2 && <Crown size={120} className="pointer-events-none absolute -right-6 -top-6 fill-white/[0.04] text-white/[0.04]" aria-hidden="true" />}
                <div className="flex items-start gap-4">
                  <motion.span
                    key={`icon-${active}`}
                    initial={{ scale: 0.8, rotate: -8 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className={active === 2 ? "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-[#A98BFF] ring-1 ring-white/15" : "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F0F7FF] text-[#030A1C] ring-1 ring-[#894CEF]/30"}
                  >
                    <Icon size={18} className={active === 2 ? "fill-[#894CEF] text-[#A98BFF]" : ""} />
                  </motion.span>
                  <div className="min-w-0">
                    <h3 className={active === 2 ? "font-[family-name:var(--font-jakarta)] text-lg font-extrabold leading-tight text-white" : "font-[family-name:var(--font-jakarta)] text-lg font-extrabold leading-tight text-[#0A0A0C]"}>
                      {t(`${STAGES[active].key}Title`)}
                    </h3>
                    <p className={active === 2 ? "mt-1.5 text-sm leading-6 text-white/65" : "mt-1.5 text-sm leading-6 text-gray-500"}>
                      {t(`${STAGES[active].key}Desc`)}
                    </p>
                  </div>
                </div>
                {/* Progress dots under card */}
                <div className="mt-5 flex justify-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className={i === active ? "h-1.5 w-6 rounded-full bg-[#894CEF]" : "h-1.5 w-1.5 rounded-full bg-gray-200"}
                      animate={{ scale: i === active ? 1 : 0.9, opacity: i === active ? 1 : 0.6 }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Single CTA — sapphire to cyan primary + subtle text link */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="mt-7 flex flex-col items-center justify-center gap-3"
          >
            <MagneticWrapper strength={7}>
              <motion.button
                type="button"
                onClick={handlePrimary}
                data-od-id="closing-cta-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl btn-brand-standard px-8 text-[14px] font-bold text-white shadow-[0_0_24px_rgba(1,162,239,0.35)]"
              >
                {t("primary")}{" "}
                <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
                  <ArrowRight size={16} />
                </motion.span>
              </motion.button>
            </MagneticWrapper>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              data-od-id="closing-cta-secondary"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#0A0A0C]/70 underline decoration-[#0A0A0C]/20 underline-offset-4 transition-colors hover:text-[#0A0A0C] hover:decoration-[#0A0A0C]"
            >
              {t("secondary")} <ArrowRight size={14} />
            </button>
          </motion.div>
        </div>
      </Container>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-[#0A0A0C]/40 backdrop-blur-[2px]" onClick={() => setDrawerOpen(false)} data-od-id="roadmap-backdrop" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 320 }} className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[440px] flex-col overflow-hidden bg-white shadow-[-24px_0_60px_-20px_rgba(15,23,42,0.28)]" role="dialog" aria-modal="true" aria-label={t("drawerTitle")} data-od-id="roadmap-drawer">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                <div>
                  <h3 className="font-[family-name:var(--font-jakarta)] text-lg font-extrabold tracking-tight text-[#0A0A0C]">{t("drawerTitle")}</h3>
                  <p className="mt-1 max-w-[32ch] text-sm leading-6 text-gray-500">{t("drawerDesc")}</p>
                </div>
                <button type="button" onClick={() => setDrawerOpen(false)} aria-label={t("drawerClose")} data-od-id="roadmap-close" className="ml-4 grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-[#0A0A0C] transition-colors hover:border-[#894CEF] hover:bg-[#F0F7FF]"><X size={16} /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <ol className="relative space-y-6 border-l border-gray-200 pl-6">
                  {[
                    { n: 1, title: t("drawerStage1Title"), desc: t("drawerStage1Desc") },
                    { n: 2, title: t("drawerStage2Title"), desc: t("drawerStage2Desc") },
                    { n: 3, title: t("drawerStage3Title"), desc: t("drawerStage3Desc") },
                  ].map((s) => (
                    <li key={s.n} className="relative">
                      <span className="absolute -left-[29px] top-0 grid h-6 w-6 place-items-center rounded-full bg-[#0A0A0C] text-[11px] font-black text-white">{s.n}</span>
                      <h3 className="text-sm font-extrabold text-[#0A0A0C]">{s.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-gray-500">{s.desc}</p>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="border-t border-gray-100 p-6">
                <Link href="/trading-objectives" onClick={() => setDrawerOpen(false)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl btn-brand-standard px-6 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 active:translate-y-0" data-od-id="roadmap-cta">{t("drawerCta")} <ArrowRight size={16} /></Link>
                <p className="mt-3 text-center text-[11px] leading-4 text-gray-400">{t("subtitleNew")}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
