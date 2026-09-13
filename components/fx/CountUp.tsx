"use client";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Count-up stat — parses a formatted value ("12H", "100%", "$100K", "4.8")
 * and animates the numeric part 0→target once when scrolled into view.
 * SSR renders the final value (correct without JS); reduced motion shows it
 * immediately.
 */
const NUM_RE = /^([^0-9]*)([0-9][0-9,.]*)(.*)$/;

export function CountUp({
  value,
  duration = 1200,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  const reduceMotion = useReducedMotion();

  const m = value.match(NUM_RE);
  const prefix = m?.[1] ?? "";
  const numStr = m?.[2] ?? "";
  const suffix = m?.[3] ?? "";
  const target = parseFloat(numStr.replace(/,/g, ""));
  const decimals = numStr.includes(".") ? numStr.split(".")[1]!.length : 0;
  const isNumeric = Boolean(m && !isNaN(target) && !value.includes("/"));

  // SSR (and the first client paint) renders the final value so the number is
  // correct without JS; once mounted we drop to 0 and count up on scroll-in.
  const [display, setDisplay] = useState(isNumeric ? target : 0);
  const [armed, setArmed] = useState(false);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!isNumeric || reduceMotion) return;
    setDisplay(0);
    setArmed(true);
  }, [isNumeric, reduceMotion]);

  useEffect(() => {
    if (!isNumeric || !inView || !armed || animatedRef.current) return;
    if (reduceMotion) {
      setDisplay(target);
      return;
    }
    animatedRef.current = true;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, armed, target, duration, reduceMotion, isNumeric]);

  if (!isNumeric) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
