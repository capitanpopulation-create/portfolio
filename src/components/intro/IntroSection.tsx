"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function IntroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.4"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [48, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen flex-col items-center justify-center"
      style={{
        backgroundColor: "var(--background)",
        padding: `var(--space-20) var(--page-margin)`,
      }}
    >
      <motion.div style={{ opacity, y }} className="text-center">
        <h1
          className="font-[family-name:var(--font-display)] tracking-tight text-brown-100"
          style={{ fontSize: "var(--text-display)" }}
        >
          Gabriel Behrens
        </h1>
        <p
          className="font-sans font-light text-brown-400"
          style={{
            marginTop: "var(--space-4)",
            fontSize: "var(--text-lg)",
            letterSpacing: "0.04em",
          }}
        >
          Product Designer
        </p>
      </motion.div>
    </section>
  );
}
