"use client";

import { useState } from "react";
import { ArrowRight, Trophy, X } from "lucide-react";

export function VipSaleBar({ code = "NEW90" }: { code?: string }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div
      className="relative z-30 border-b border-white/10 bg-[#030A1C] px-3 py-2.5 text-white"
      data-od-id="vip-sale-bar"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-1.5 text-center sm:flex-row sm:flex-wrap sm:gap-x-3">
        <Trophy size={15} className="text-[#E7C66B]" aria-hidden="true" />
        <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-white sm:text-[13px]">
          <span className="text-[#E7C66B]">Limited time sale:</span> 90% off all evaluations!
        </p>
        <span className="inline-flex items-center rounded border border-[#894CEF]/50 bg-[#894CEF]/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-[#C4B5FD] sm:text-[11px]">
          Use code: {code}
        </span>
        <a
          href="#start-challenge"
          onClick={(e) => {
            const el = document.getElementById("start-challenge");
            if (el) {
              e.preventDefault();
              el.scrollIntoView({ behavior: "smooth", block: "start" });
              window.history.replaceState(null, "", `${window.location.pathname}#start-challenge`);
            }
          }}
          className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#E7C66B] hover:underline sm:text-[11px]"
        >
          Claim 90% off <ArrowRight size={12} />
        </a>
      </div>
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Dismiss VIP sale"
        className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center text-white/50 transition-colors hover:text-white"
      >
        <X size={14} />
      </button>
    </div>
  );
}
