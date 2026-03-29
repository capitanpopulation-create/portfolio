"use client";

import { useEffect, useState } from "react";

interface CountUpNumberProps {
  value: string; // e.g. "$401M", "4K+", "2x"
  duration?: number;
}

/** Parse a display value like "$401M" into { prefix, number, suffix } */
function parse(value: string) {
  const match = value.match(/^([^0-9]*)([0-9.]+)(.*)$/);
  if (!match) return { prefix: "", number: 0, suffix: value };
  return {
    prefix: match[1],
    number: parseFloat(match[2]),
    suffix: match[3],
  };
}

export function CountUpNumber({ value, duration = 1200 }: CountUpNumberProps) {
  const { prefix, number, suffix } = parse(value);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf: number;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(eased * number);
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [number, duration]);

  const display = number >= 1 ? Math.round(current) : current.toFixed(1);

  return (
    <span>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
