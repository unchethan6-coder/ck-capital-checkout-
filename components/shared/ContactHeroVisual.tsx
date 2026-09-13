"use client";

import { motion } from "framer-motion";
import {
  Globe2,
  Headphones,
  Lock,
  Mail,
  MessageCircle,
  Radio,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactHeroVisualProps {
  className?: string;
  compact?: boolean;
}

export function ContactHeroVisual({
  className,
  compact = false,
}: ContactHeroVisualProps) {
  return (
    <div
      className={cn("relative w-full select-none mb-8 sm:mb-6", className)}
      data-od-id="hero-contact-desk"
    >
      {/* Main Dashboard Window Container */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
        {/* Top Browser / App Window Chrome */}
        <div className="flex h-11 items-center justify-between border-b border-gray-200 bg-gray-50 px-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            <div className="ml-3 hidden sm:flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-mono text-[#6B7280]">
              <Lock size={10} className="text-[#A98BFF]" />
              <span>app.ckcapital.co.uk/support/live-desk</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/30 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-600" />
              Live Desk Online
            </span>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-5 sm:p-6 lg:p-7">
          {/* Header Support Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6B7280]">
                  Global Support Node #CK-UK
                </p>
                <span className="rounded bg-violet-50 px-1.5 py-0.5 text-[9px] font-bold text-[#A98BFF] border border-violet-200">
                  24/7 DEDICATED
                </span>
              </div>
              <p className="mt-1 font-[family-name:var(--font-jakarta)] text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A0A0C]">
                &lt; 3 Min{" "}
                <span className="text-xs font-semibold text-emerald-600">
                  Avg First Response
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3.5 py-2">
              <Headphones size={15} className="text-[#A98BFF] shrink-0" />
              <div className="text-left">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#A98BFF]">
                  Active Queue
                </p>
                <p className="text-sm font-extrabold text-[#0A0A0C]">
                  0 Waiting Traders
                </p>
              </div>
            </div>
          </div>

          {/* Support Channels Grid */}
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0A0A0C]">
                Priority Communication Channels
              </p>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                <Radio size={12} className="animate-pulse text-emerald-700" /> 100% Operational
              </span>
            </div>

            {/* Channels List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Discord VIP */}
              <a
                href="https://discord.com/invite/hGSVx9CmS2"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-xl border border-violet-300 bg-violet-50/50 p-3.5 text-[#0A0A0C] text-left transition-colors hover:border-violet-400 hover:bg-violet-100/60 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-[#A98BFF]">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-[#0A0A0C]">Discord Server</p>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    </div>
                    <p className="text-[10px] text-[#6B7280]">Direct trader community &amp; staff</p>
                  </div>
                </div>
                <span className="rounded bg-[#703AD7] px-2 py-0.5 text-[9px] font-bold text-white group-hover:bg-[#7943E0] transition-colors">
                  JOIN
                </span>
              </a>

              {/* Email Desk */}
              <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-left">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-[#0A0A0C]">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0A0A0C]">Direct Desk Email</p>
                    <p className="text-[10px] text-[#6B7280]">support@ckcapital.co.uk</p>
                  </div>
                </div>
                <span className="rounded border border-gray-200 bg-gray-100 px-2 py-0.5 text-[9px] font-bold text-[#4B5563]">
                  AUTO-ROUTED
                </span>
              </div>
            </div>

            {/* Simulated Live Support Dispatch Ping */}
            <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm">
              <div className="flex items-center justify-between text-[11px] text-[#6B7280] border-b border-gray-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
                  <span className="font-semibold text-[#0A0A0C]">Support Lead Available</span>
                </div>
                <span className="text-[10px] font-mono text-[#A98BFF] font-bold">London Desk (GMT)</span>
              </div>
              <div className="mt-2.5 flex items-start gap-3">
                <img
                  src="/images/about/dan.jpg"
                  alt="Support Specialist"
                  className="h-8 w-8 rounded-full border border-gray-300 object-cover shrink-0"
                />
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#0A0A0C]">
                    Daniel &amp; Team · <span className="text-[#6B7280] font-normal">Desk Staff</span>
                  </p>
                  <p className="text-[11px] text-[#4B5563] leading-relaxed">
                    &ldquo;Have a question about rules, instant funding setup, or profit withdrawals? Our UK support desk is live 24/7.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Server Relay Latency Row */}
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs">
              <div className="flex items-center gap-2 text-[#6B7280]">
                <Globe2 size={14} className="text-[#A98BFF]" />
                <span className="text-[11px]">Primary Routing: London (12ms) · NY (24ms)</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                Ultra-Low Latency
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Recent Status Activity Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-5 py-3 text-[11px] text-[#6B7280]">
          <div className="flex items-center gap-2">
            <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
            <span className="font-semibold text-[#0A0A0C]">
              Resolution Rate:
            </span>
            <span className="text-[#0A0A0C] font-bold">99.4% first-contact</span>
          </div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#A98BFF]">
            ZERO BOT REPLIES
          </span>
        </div>
      </div>

      {/* Floating Decorative Response Badge */}
      {!compact && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative z-20 mt-4 w-fit max-w-full -ml-1 sm:-ml-4"
        >
          <div className="flex items-center gap-3.5 rounded-2xl border border-gray-200 bg-white px-4 py-3 sm:px-5 sm:py-3.5 shadow-xl">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-violet-50 text-[#A98BFF] border border-violet-200">
              <Zap size={20} className="fill-[#7943E0] text-[#A98BFF]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B7280]">
                Support SLA
              </p>
              <p className="font-[family-name:var(--font-jakarta)] text-sm sm:text-base font-extrabold text-[#0A0A0C]">
                Instant Discord Support
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
