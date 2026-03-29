"use client";

import Link from "next/link";
/* eslint-disable @next/next/no-img-element */
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ImageLightbox } from "@/components/work/ImageLightbox";

/* ------------------------------------------------------------------ */
/*  Brand tokens (Mantle-inspired warm palette)                        */
/* ------------------------------------------------------------------ */
const brand = {
  bg: "var(--background)",
  dark: "var(--foreground)",
  text: "var(--foreground)",
  muted: "var(--brown-300)",
  gold: "var(--accent-orange)",
  cream: "var(--background)",
  cardBg: "var(--jp-brown)",
};

const ease = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/*  Scroll-reveal wrapper                                              */
/* ------------------------------------------------------------------ */
function Reveal({
  children,
  delay = 0,
  className,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ================================================================== */
/*  PAGE                                                               */
/* ================================================================== */
const PASSWORD = "flow2026";

export default function FlowPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  if (!unlocked) {
    return (
      <main
        style={{
          background: brand.bg,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          style={{
            textAlign: "center",
            maxWidth: 400,
            padding: "0 24px",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 4,
              background: brand.dark,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke={brand.gold} strokeWidth="1.5" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={brand.gold} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 1.2rem + 1vw, 2rem)",
              color: brand.text,
              marginBottom: 8,
            }}
          >
            Protected case study
          </h1>
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 15,
              color: brand.muted,
              marginBottom: 32,
              lineHeight: 1.5,
            }}
          >
            Enter the password to view this project.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input === PASSWORD) {
                setUnlocked(true);
                setError(false);
              } else {
                setError(true);
              }
            }}
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            <input
              type="password"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(false);
              }}
              placeholder="Password"
              autoFocus
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 15,
                padding: "12px 16px",
                borderRadius: 4,
                border: `1px solid ${error ? "#e54d2e" : "var(--border-interactive)"}`,
                background: "var(--surface-elevated)",
                outline: "none",
                color: brand.text,
                transition: "border-color 0.2s",
              }}
            />
            {error && (
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: 13,
                  color: "#e54d2e",
                  textAlign: "left",
                }}
              >
                Incorrect password. Try again.
              </p>
            )}
            <button
              type="submit"
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 15,
                fontWeight: 600,
                padding: "12px 24px",
                borderRadius: 4,
                border: "none",
                background: brand.dark,
                color: "var(--background)",
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              View project
            </button>
          </form>
          <Link
            href="/work"
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 13,
              color: brand.muted,
              textDecoration: "none",
              display: "inline-block",
              marginTop: 24,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = brand.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = brand.muted)}
          >
            Back to work
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main style={{ background: brand.bg, minHeight: "100vh" }}>
      {/* ============================================================
          1. HERO — centered, big type, no image
          ============================================================ */}
      <section
        style={{
          paddingTop: "calc(var(--nav-height) + 120px)",
          paddingBottom: 80,
          background: brand.bg,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(24px, 5vw, 100px)" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 40 }}>
              <Link href="/work" style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 500, color: brand.muted, textDecoration: "none" }}>
                Work
              </Link>
              <span style={{ color: brand.muted, opacity: 0.4 }}>/</span>
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 500, color: brand.text }}>Flow</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem, 2.5rem + 3.5vw, 5.5rem)",
              color: brand.text,
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              marginBottom: 32,
              maxWidth: 800,
            }}
          >
            Making ERP implementation less painful
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(1.1rem, 1rem + 0.5vw, 1.35rem)",
              color: brand.muted,
              maxWidth: 520,
              lineHeight: 1.6,
              marginBottom: 48,
            }}
          >
            Documentation that took 6&ndash;8 hours now takes 2&ndash;3.
            Standardization went from near-zero to 80%+.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
            style={{ display: "flex", gap: 48, flexWrap: "wrap" }}
          >
            {[
              ["Role", "Lead Product Designer"],
              ["Company", "CoreSystem"],
              ["Timeline", "6 months, ongoing"],
              ["Status", "Prototype live"],
            ].map(([label, value]) => (
              <div key={label}>
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 500, color: brand.muted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
                  {label}
                </p>
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, color: brand.text, fontWeight: 500 }}>
                  {value}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          2. PROBLEM + INSIGHT — clean left-aligned blocks
          ============================================================ */}
      <section style={{ padding: "80px 0", background: brand.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(24px, 5vw, 100px)" }}>
          <Reveal>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 600, color: brand.muted, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 24 }}>
              Research
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 1.5rem + 2vw, 3.2rem)", color: brand.text, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 16, maxWidth: 600 }}>
              What practitioners actually told us.
            </h2>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 18, color: brand.muted, lineHeight: 1.6, maxWidth: 560, marginBottom: 64 }}>
              We talked directly to the people doing the work.
              Recurring interviews, no stakeholder filters.
            </p>
          </Reveal>

          <div className="flow-insights-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, borderTop: `1px solid ${brand.muted}30` }}>
            {[
              {
                title: "Fragmented tools",
                insight: "Speed over completeness",
                body: "Word docs, CSVs, spreadsheets. No shared system. People just want to capture what they mean and move on.",
              },
              {
                title: "No hierarchy awareness",
                insight: "The split is real",
                body: "Seniors think in process landscapes. Juniors think in assigned tasks. Different mental models entirely.",
              },
              {
                title: "Manual gap analysis",
                insight: "Trust requires transparency",
                body: "Done by hand, requirement by requirement. Any AI solution needs to show its reasoning.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={0.1 * (i + 1)} style={{ paddingTop: 32 }}>
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 600, color: brand.gold, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
                  {item.insight}
                </p>
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 20, color: brand.text, fontWeight: 600, lineHeight: 1.3, marginBottom: 12 }}>
                  {item.title}
                </p>
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 16, color: brand.muted, lineHeight: 1.6 }}>
                  {item.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          3. SOLUTION — Navigation (split: text left, image right)
          ============================================================ */}
      <section style={{ padding: "80px 0", background: brand.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(24px, 5vw, 100px)" }}>
          <Reveal>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 600, color: brand.muted, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 24 }}>
              Solution
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 1.5rem + 2vw, 3.2rem)", color: brand.text, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 16, maxWidth: 600 }}>
              Same data, two ways to look at it.
            </h2>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 18, color: brand.muted, lineHeight: 1.6, maxWidth: 560, marginBottom: 48 }}>
              Senior consultants scan process counts at L1. Junior consultants
              track assignments at L3. Same data, no switching cost.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div onClick={() => setLightboxSrc("/work/flow/hierarchy.png")} style={{ borderRadius: 4, overflow: "hidden", boxShadow: "var(--shadow-image)", border: "1px solid var(--border-subtle)", cursor: "zoom-in" }}>
              <img
                src="/work/flow/hierarchy.png"
                alt="Business Processes hierarchy showing L1, L2, and L3 levels"
                style={{ width: "100%", display: "block", objectFit: "cover", objectPosition: "top" }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          4. AI ANALYSIS — dark container card (Mantle-style)
          ============================================================ */}
      <section style={{ padding: "0 clamp(24px, 5vw, 100px)", paddingBottom: 80 }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            background: brand.dark,
            borderRadius: 4,
            padding: "clamp(48px, 5vw, 80px) clamp(32px, 5vw, 80px)",
            overflow: "hidden",
          }}
        >
          <Reveal>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 600, color: brand.gold, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 24 }}>
              AI Analysis
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 1.5rem + 2vw, 3.2rem)", color: "var(--background)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 16, maxWidth: 600 }}>
              AI that shows its work.
            </h2>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 18, color: "var(--brown-500)", lineHeight: 1.6, maxWidth: 520, marginBottom: 48 }}>
              641 requirements categorized in one click. Every flagged
              item shows why it was flagged.
            </p>
          </Reveal>

          {/* Full-width overview screenshot */}
          <Reveal delay={0.1}>
            <div onClick={() => setLightboxSrc("/work/flow/requirements-table.png")} style={{ borderRadius: 4, overflow: "hidden", border: "1px solid var(--border-subtle)", marginBottom: 8, cursor: "zoom-in" }}>
              <img src="/work/flow/requirements-table.png" alt="Requirements table with confidence scores" style={{ width: "100%", display: "block", objectFit: "cover", objectPosition: "top" }} />
            </div>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: "var(--brown-400)", marginBottom: 20 }}>
              Overview: 641 requirements with AI confidence scoring
            </p>
          </Reveal>

          {/* Two smaller screenshots side by side */}
          <div className="flow-ai-shots" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 48 }}>
            {[
              { src: "/work/flow/ai-modal.png", alt: "AI Analysis modal", caption: "Summary: one-click categorization" },
              { src: "/work/flow/requirement-detail.png", alt: "Requirement detail", caption: "Detail: full reasoning chain" },
            ].map((img, i) => (
              <Reveal key={img.caption} delay={0.15 + 0.1 * i}>
                <div onClick={() => setLightboxSrc(img.src)} style={{ borderRadius: 4, overflow: "hidden", border: "1px solid var(--border-subtle)", cursor: "zoom-in" }}>
                  <img src={img.src} alt={img.alt} style={{ width: "100%", display: "block", objectFit: "cover", objectPosition: "top" }} />
                </div>
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: "var(--brown-400)", marginTop: 12 }}>
                  {img.caption}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.2rem, 1rem + 0.8vw, 1.6rem)",
                color: "var(--brown-600)",
                fontStyle: "italic",
                lineHeight: 1.45,
                maxWidth: 600,
                borderLeft: `3px solid ${brand.gold}`,
                paddingLeft: 24,
              }}
            >
              Showing what the AI isn&rsquo;t sure about is how you
              earn trust in what it is.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          5. OUTCOMES — Mantle-style 3-col with divider
          ============================================================ */}
      <section style={{ padding: "80px 0", background: brand.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(24px, 5vw, 100px)" }}>
          <div className="flow-outcomes" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, borderTop: `1px solid ${brand.muted}30` }}>
            {[
              { metric: "60\u201370%", label: "Faster documentation", note: "BPDs that took 6\u20138 hours now take 2\u20133." },
              { metric: "72%", label: "AI auto-analysis success", note: "High-confidence auto-approved. Low-confidence routed to review." },
              { metric: "80%+", label: "Standardization", note: "Unified framework across all engagements." },
            ].map((item, i) => (
              <Reveal key={item.label} delay={0.1 * (i + 1)} style={{ paddingTop: 32 }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 2.5rem + 2vw, 5rem)", color: brand.text, lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 8 }}>
                  {item.metric}
                </p>
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 16, color: brand.text, fontWeight: 600, marginBottom: 8 }}>
                  {item.label}
                </p>
                <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, color: brand.muted, lineHeight: 1.5 }}>
                  {item.note}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          6. LEARNINGS — simple text section
          ============================================================ */}
      <section style={{ padding: "40px 0 80px", background: brand.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(24px, 5vw, 100px)" }}>
          <Reveal>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 600, color: brand.muted, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 24 }}>
              Learnings
            </p>
          </Reveal>

          <div className="flow-learnings" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
            <Reveal delay={0.1}>
              <h3 style={{ fontFamily: "var(--font-outfit)", fontSize: 20, color: brand.text, fontWeight: 600, marginBottom: 12 }}>
                Push for direct user access.
              </h3>
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 16, color: brand.muted, lineHeight: 1.6 }}>
                Talking to practitioners directly changed the product more
                than any stakeholder meeting. I heard what people actually
                struggled with, not what they thought I wanted to hear.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <h3 style={{ fontFamily: "var(--font-outfit)", fontSize: 20, color: brand.text, fontWeight: 600, marginBottom: 12 }}>
                Trust is designed, not assumed.
              </h3>
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 16, color: brand.muted, lineHeight: 1.6 }}>
                Confidence scores, reasoning chains, and &ldquo;this needs your
                review&rdquo; signals turned skeptical practitioners into engaged
                users. A black box would have meant zero adoption.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          7. BACK
          ============================================================ */}
      <section style={{ padding: "40px 0 120px", background: brand.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(24px, 5vw, 100px)", textAlign: "center" }}>
          <Link
            href="/work"
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 600,
              color: brand.muted,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = brand.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = brand.muted)}
          >
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M11 4H2M5 7L1.5 4L5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to all work
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .flow-insights-grid,
          .flow-outcomes,
          .flow-ai-shots { grid-template-columns: 1fr !important; }
          .flow-learnings { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <ImageLightbox
        src={lightboxSrc ?? ""}
        alt="Enlarged view"
        isOpen={!!lightboxSrc}
        onClose={() => setLightboxSrc(null)}
      />
    </main>
  );
}
