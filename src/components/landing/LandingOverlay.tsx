"use client";

import { motion } from "framer-motion";
import { INTRO_PULSE_DURATION } from "@/lib/constants";

const ENTRANCE_DELAY = INTRO_PULSE_DURATION + 0.3;

export function LandingOverlay() {
  return (
    <div
      className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center"
      style={{ paddingBottom: 140 }}
    >
      <div className="text-center" style={{ padding: "0 var(--page-margin)" }}>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: ENTRANCE_DELAY, ease: "easeOut" }}
          className="font-[family-name:var(--font-display)] text-limestone leading-[1.1] tracking-tight"
          style={{ fontSize: "var(--text-display)" }}
        >
          Thinking hard,
          <br />
          so others don&apos;t have to.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: ENTRANCE_DELAY + 0.4,
            ease: "easeOut",
          }}
          className="font-[family-name:var(--font-mono)] text-brown-300 leading-relaxed"
          style={{
            fontSize: "var(--text-sm)",
            letterSpacing: "0.04em",
            marginTop: "var(--space-4)",
          }}
        >
          Recognizing patterns.
          <br />
          Solving problems.
        </motion.p>
      </div>
    </div>
  );
}
