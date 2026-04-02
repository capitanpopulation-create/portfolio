"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const TABS = [
  { id: "bio", label: "Bio" },
  { id: "how-i-think", label: "How I Think" },
  { id: "fun-facts", label: "Fun Facts" },
  { id: "get-in-touch", label: "Get in Touch" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const FOCUS_AREAS = [
  "Product Design",
  "AI Tooling",
  "Motion & Illustrations",
];

const ease = [0.16, 1, 0.3, 1] as const;

function BioContent() {
  return (
    <>
      <div
        className="text-brown-200 leading-relaxed"
        style={{
          fontSize: "var(--text-base)",
          maxWidth: "640px",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-5)",
        }}
      >
        <p>
          I&rsquo;m from Venezuela, I finished my BA at Shenkar in Israel and
          now I&rsquo;m based in New York.
        </p>
        <p className="text-brown-300">
          Moving across cultures taught me to get comfortable with ambiguity.
          That turned out to be useful in design.
        </p>
        <p className="text-brown-300">
          I believe every problem has a solution. I&rsquo;m motivated to find
          it with humor, simplicity, and meaning.
        </p>
      </div>
      <div
        className="flex flex-wrap"
        style={{ gap: "var(--space-3)", marginTop: "var(--space-8)" }}
      >
        {FOCUS_AREAS.map((area) => (
          <span
            key={area}
            className="font-[family-name:var(--font-outfit)] text-brown-300"
            style={{
              fontSize: "13px",
              fontWeight: 500,
              padding: "6px 14px",
              border: "1px solid var(--border-interactive)",
              borderRadius: 4,
            }}
          >
            {area}
          </span>
        ))}
      </div>
    </>
  );
}

function HowIThinkContent() {
  return (
    <div
      className="text-brown-200 leading-relaxed"
      style={{
        fontSize: "var(--text-base)",
        maxWidth: "640px",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-5)",
      }}
    >
      <p>
        Before I touch a screen, I try to understand the problem. Not the
        system. The problem, and the way the team actually works around it.
      </p>
      <p className="text-brown-300">
        People don&rsquo;t always know what they want until they see it. So I
        explore multiple directions, account for the edge cases in each, and
        let the team decide with clarity.
      </p>
      <p className="text-brown-300">
        I think in layers. Peel one back, reframe, look again.
      </p>
    </div>
  );
}

function FunFactsContent() {
  return (
    <div
      className="text-brown-300 leading-relaxed"
      style={{
        fontSize: "var(--text-base)",
        maxWidth: "640px",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-5)",
      }}
    >
      <p className="text-brown-200">
        This site was built with Claude Code and 2% help of Figma.
        <br />
        No agents were harmed in the making of this portfolio.
      </p>
      <p>I boulder because the routes are called problems.</p>
      <p>
        The hero animation on this site was inspired by Carlos Cruz-Diez, a
        Venezuelan kinetic artist. His wall at Maiquetia airport is the last
        thing many Venezuelans see before they leave. It stayed with me.
      </p>
      <p>Music makes me think.</p>
      <p>Lucky to be with a supporting and loving wife and daughter.</p>
    </div>
  );
}

function GetInTouchContent() {
  return (
    <div
      className="leading-relaxed"
      style={{
        maxWidth: "640px",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-5)",
      }}
    >
      <p className="text-brown-200">
        Interested in working together?
      </p>
      <div className="flex flex-col" style={{ gap: "var(--space-3)" }}>
        <a
          href="mailto:hello@gabobehrens.com"
          className="font-[family-name:var(--font-outfit)] text-brown-200 hover:text-accent-orange transition-colors"
          style={{
            fontSize: "var(--text-base)",
            fontWeight: 500,
            textDecoration: "none",
            transitionDuration: "var(--duration-normal)",
          }}
        >
          hello@gabobehrens.com
        </a>
        <a
          href="https://linkedin.com/in/gabriel-behrens-a8884955"
          target="_blank"
          rel="noopener noreferrer"
          className="font-[family-name:var(--font-outfit)] text-brown-300 hover:text-accent-orange transition-colors"
          style={{
            fontSize: "var(--text-base)",
            fontWeight: 500,
            textDecoration: "none",
            transitionDuration: "var(--duration-normal)",
          }}
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
}

const TAB_CONTENT: Record<TabId, () => React.ReactNode> = {
  bio: BioContent,
  "how-i-think": HowIThinkContent,
  "fun-facts": FunFactsContent,
  "get-in-touch": GetInTouchContent,
};

function PhotoBlock({ className, aspectRatio, sizes, maxHeight }: { className?: string; aspectRatio: string; sizes: string; maxHeight?: string }) {
  return (
    <div
      className={`group relative overflow-hidden ${className || ""}`}
      style={{
        borderRadius: "8px",
        aspectRatio,
        ...(maxHeight ? { maxHeight, width: "100%" } : {}),
      }}
    >
      <Image
        src="/images/gabo-now.jpg"
        alt="Gabriel Behrens"
        fill
        className="object-cover object-top transition-opacity duration-300 group-hover:opacity-0"
        sizes={sizes}
        priority
      />
      <Image
        src="/images/gabo-young.jpg"
        alt="Gabriel Behrens as a kid"
        fill
        className="object-cover object-top opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        sizes={sizes}
        priority
      />
    </div>
  );
}

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<TabId>("bio");
  const ContentComponent = TAB_CONTENT[activeTab];

  return (
    <main
      className="bg-background"
      style={{
        paddingTop: "var(--nav-height)",
        paddingBottom: "var(--page-margin)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="page-container" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {/* Mobile photo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease }}
          className="md:hidden"
          style={{ marginBottom: "var(--space-8)" }}
        >
          <PhotoBlock aspectRatio="4 / 3" sizes="100vw" />
        </motion.div>

        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: "var(--space-12)", alignItems: "center" }}
        >
          {/* Left column */}
          <div>
            {/* Tab pills */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
              className="flex"
              style={{
                gap: "var(--space-6)",
                marginBottom: "var(--space-10)",
                borderBottom: "1px solid var(--border-muted)",
                width: "fit-content",
              }}
            >
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative font-[family-name:var(--font-mono)] uppercase transition-colors"
                  style={{
                    fontSize: "var(--text-xs)",
                    letterSpacing: "0.1em",
                    padding: "0 0 12px 0",
                    color:
                      activeTab === tab.id
                        ? "var(--foreground)"
                        : "var(--brown-400)",
                    position: "relative",
                    transitionDuration: "var(--duration-normal)",
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                  }}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="about-tab-underline"
                      style={{
                        position: "absolute",
                        bottom: -1,
                        left: 0,
                        right: 0,
                        height: 2,
                        backgroundColor: "var(--accent-orange)",
                        borderRadius: 1,
                      }}
                      transition={{
                        type: "spring",
                        duration: 0.3,
                        bounce: 0.15,
                      }}
                    />
                  )}
                </button>
              ))}
            </motion.div>

            {/* Tab content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              style={{ minHeight: "320px" }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease }}
                >
                  <ContentComponent />
                </motion.div>
              </AnimatePresence>
            </motion.div>

          </div>

          {/* Right column: Photo (desktop only) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease }}
            className="hidden md:block"
            style={{ maxHeight: "calc(100vh - var(--nav-height) - var(--page-margin) * 2)" }}
          >
            <PhotoBlock
              aspectRatio="3 / 4"
              sizes="(max-width: 768px) 100vw, 50vw"
              className="h-full"
              maxHeight="calc(100vh - var(--nav-height) - var(--page-margin) * 2)"
            />
          </motion.div>
        </div>
      </div>
    </main>
  );
}
