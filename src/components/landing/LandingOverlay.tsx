"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { INTRO_PULSE_DURATION } from "@/lib/constants";

const ENTRANCE_DELAY = INTRO_PULSE_DURATION + 0.3;

const WORK_CATEGORIES = [
  { label: "Design", href: "/work/design" },
  { label: "Motion", href: "/work/motion" },
  { label: "Illustration", href: "/work/illustration" },
  { label: "Experiments", href: "/work/experiments" },
];

const MotionLink = motion.create(Link);

export function LandingOverlay() {
  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex items-end">
      <div
        className="w-full"
        style={{ padding: `0 var(--page-margin) var(--space-12)`, paddingBottom: "clamp(2.5rem, 6vh, 4rem)" }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end" style={{ gap: "var(--space-8)" }}>
          <div>
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

            {/* Work category links */}
            <div
              className="pointer-events-auto flex flex-wrap"
              style={{ marginTop: "var(--space-8)", gap: "var(--space-6)" }}
            >
              {WORK_CATEGORIES.map((cat, i) => (
                <MotionLink
                  key={cat.label}
                  href={cat.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: ENTRANCE_DELAY + 0.6 + i * 0.1,
                    ease: "easeOut",
                  }}
                  className="font-[family-name:var(--font-mono)] uppercase text-brown-400 hover:text-accent-orange transition-colors"
                  style={{
                    fontSize: "var(--text-xs)",
                    letterSpacing: "0.12em",
                    transitionDuration: "var(--duration-normal)",
                  }}
                >
                  {cat.label}
                </MotionLink>
              ))}
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: ENTRANCE_DELAY + 0.4,
              ease: "easeOut",
            }}
            className="font-[family-name:var(--font-mono)] text-brown-300 md:text-right leading-relaxed"
            style={{ fontSize: "var(--text-sm)", letterSpacing: "0.04em" }}
          >
            Recognizing patterns.
            <br />
            Solving problems.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
