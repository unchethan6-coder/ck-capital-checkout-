import React from "react";

export function CKEmblem({
  className = "h-6 w-auto",
  fill = "currentColor",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg
      viewBox="0 0 524 476"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ck-violet-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B395E4" />
          <stop offset="50%" stopColor="#894CEF" />
          <stop offset="100%" stopColor="#703AD7" />
        </linearGradient>
      </defs>
      {/* Top curved bar */}
      <path
        d="M62 109C110 42 195 0 292 0L481 0L266 215L169 215C136 215 106 201 84 179L62 109Z"
        fill={fill === "gradient" ? "url(#ck-violet-grad)" : fill}
      />
      {/* Middle horizontal bar */}
      <path
        d="M12 215C12 190 16 166 24 143L200 143L272 215L200 287L24 287C16 264 12 240 12 215Z"
        fill={fill === "gradient" ? "url(#ck-violet-grad)" : fill}
      />
      {/* Bottom curved bar */}
      <path
        d="M62 367L84 297C106 275 136 261 169 261L266 261L481 476L292 476C195 476 110 434 62 367Z"
        fill={fill === "gradient" ? "url(#ck-violet-grad)" : fill}
      />
      {/* Right chevron / K arm */}
      <path
        d="M200 238L426 12L524 109L350 238L524 367L426 464L200 238Z"
        fill={fill === "gradient" ? "url(#ck-violet-grad)" : fill}
      />
    </svg>
  );
}

export function CKLogo({
  variant = "light",
  className = "h-7 w-auto",
  showWordmark = true,
}: {
  variant?: "light" | "dark" | "gold";
  className?: string;
  showWordmark?: boolean;
}) {
  // variant="dark" means for dark backgrounds (white text)
  // variant="light" means for light backgrounds (black text)
  // variant="gold" means all gold
  const textColor =
    variant === "dark"
      ? "text-white"
      : variant === "gold"
      ? "text-[#A98BFF]"
      : "text-[#0A0A0C]";

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <CKEmblem className="h-full w-auto aspect-[524/476]" fill="gradient" />
      {showWordmark && (
        <span
          className={`font-[family-name:var(--font-jakarta)] font-black tracking-[0.08em] text-[15px] sm:text-[16px] leading-none ${textColor}`}
        >
          CK CAPITAL
        </span>
      )}
    </div>
  );
}
