"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { INTRO_PULSE_DURATION } from "@/lib/constants";

const ENTRANCE_DELAY = INTRO_PULSE_DURATION + 0.3;

const SLIDES = [
  {
    heading: "Thinking hard,\nso others don\u2019t have to.",
    tagline: "Recognizing patterns. Solving problems.",
  },
  {
    heading: "No agents were harmed\nin the making of this website.",
    tagline: "Created using Claude Code in the span of two weeks.",
  },
  {
    heading: "Certainty of death.\nSmall chance of success.\nWhat are we waiting for?",
    tagline: "\u2014 Gimli",
  },
  {
    heading: "Hi, I\u2019m Gabo Behrens.",
    tagline: "Product designer, here to help.",
  },
];

const SLIDE_INTERVAL = 10000;

export function LandingOverlay() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [entranceDone, setEntranceDone] = useState(false);

  // Wait for entrance animation to finish before starting rotation
  useEffect(() => {
    const timeout = setTimeout(
      () => setEntranceDone(true),
      (ENTRANCE_DELAY + 0.4 + 1.0) * 1000
    );
    return () => clearTimeout(timeout);
  }, []);

  // Cycle slides once entrance is done
  useEffect(() => {
    if (!entranceDone) return;
    const interval = setInterval(
      () => setSlideIndex((i) => (i + 1) % SLIDES.length),
      SLIDE_INTERVAL
    );
    return () => clearInterval(interval);
  }, [entranceDone]);

  const slide = SLIDES[slideIndex];
  const headingLines = slide.heading.split("\n");

  return (
    <div
      className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center"
      style={{ paddingBottom: 140 }}
    >
      <div className="text-center" style={{ padding: "0 var(--page-margin)" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={slideIndex}
            initial={slideIndex === 0 ? { opacity: 0, y: 16 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{
              duration: slideIndex === 0 ? 0.8 : 0.6,
              delay: slideIndex === 0 ? ENTRANCE_DELAY : 0,
              ease: "easeOut",
            }}
          >
            <h1
              className="font-[family-name:var(--font-display)] text-limestone leading-[1.1] tracking-tight"
              style={{ fontSize: "var(--text-display)" }}
            >
              {headingLines.map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </h1>

            <p
              className="font-[family-name:var(--font-mono)] text-brown-300 leading-relaxed"
              style={{
                fontSize: "var(--text-sm)",
                letterSpacing: "0.04em",
                marginTop: "var(--space-4)",
              }}
            >
              {slide.tagline}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
