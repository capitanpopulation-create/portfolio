"use client";

import Link from "next/link";
/* eslint-disable @next/next/no-img-element */
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ImageLightbox } from "@/components/work/ImageLightbox";
import { PlatformGrid } from "@/components/work/PlatformGrid";
import { BeforeAfterSlider } from "@/components/work/BeforeAfterSlider";
import { SolutionsTriptychInline } from "@/components/work/SolutionsTriptychInline";
import { TenantSwitcherDemo } from "@/components/work/TenantSwitcherDemo";

/* ------------------------------------------------------------------ */
/*  Brand tokens                                                       */
/* ------------------------------------------------------------------ */
const brand = {
  bg: "var(--background)",
  dark: "var(--foreground)",
  text: "var(--foreground)",
  muted: "var(--brown-300)",
  gold: "var(--accent-orange)",
  cream: "var(--background)",
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

/* ------------------------------------------------------------------ */
/*  Split section (60/40 text + image)                                 */
/* ------------------------------------------------------------------ */
function SplitSection({
  label,
  title,
  body,
  imageSrc,
  imageAlt,
  flip,
  onImageClick,
}: {
  label: string;
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
  flip?: boolean;
  onImageClick?: () => void;
}) {
  return (
    <div
      className="ab-split"
      style={{
        display: "flex",
        gap: "clamp(32px, 5vw, 64px)",
        alignItems: "center",
        flexDirection: flip ? "row-reverse" : "row",
      }}
    >
      {/* Text — 60% */}
      <Reveal style={{ flex: "1 1 55%", minWidth: 0 }}>
        <p
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 12,
            fontWeight: 600,
            color: brand.gold,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          {label}
        </p>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.5rem, 1.2rem + 1.2vw, 2.2rem)",
            color: brand.text,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-outfit)",
            fontSize: 16,
            color: brand.muted,
            lineHeight: 1.7,
            maxWidth: 480,
          }}
        >
          {body}
        </p>
      </Reveal>

      {/* Image — 40% */}
      <Reveal delay={0.15} style={{ flex: "1 1 40%", minWidth: 0 }}>
        <div
          onClick={onImageClick}
          style={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "var(--shadow-image)",
            border: "1px solid var(--border-subtle)",
            cursor: onImageClick ? "zoom-in" : "default",
          }}
        >
          <img
            src={imageSrc}
            alt={imageAlt}
            style={{
              width: "100%",
              display: "block",
              objectFit: "cover",
              objectPosition: "top",
            }}
          />
        </div>
      </Reveal>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Solutions section header with staggered animation                  */
/* ------------------------------------------------------------------ */
function SolutionsHeader() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.15, duration: 0.5, ease }}
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: 12,
          fontWeight: 600,
          color: brand.gold,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        Solutions
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, duration: 0.6, ease }}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.8rem, 1.5rem + 1.5vw, 3rem)",
          color: brand.text,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          marginBottom: 24,
        }}
      >
        What we shipped.
      </motion.h2>
      <div style={{ marginBottom: 48 }} />
    </div>
  );
}

/* ================================================================== */
/*  PASSWORD                                                           */
/* ================================================================== */
const PASSWORD = "flow2026";

/* ================================================================== */
/*  PAGE                                                               */
/* ================================================================== */
export default function AgentBuilderPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  /* ---- Password gate ---- */
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
          style={{ textAlign: "center", maxWidth: 400, padding: "0 24px" }}
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
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 1.2rem + 1vw, 2rem)", color: brand.text, marginBottom: 8 }}>
            Protected case study
          </h1>
          <p style={{ fontFamily: "var(--font-outfit)", fontSize: 15, color: brand.muted, marginBottom: 32, lineHeight: 1.5 }}>
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
              onChange={(e) => { setInput(e.target.value); setError(false); }}
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
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, color: "#e54d2e", textAlign: "left" }}>
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
            style={{ fontFamily: "var(--font-outfit)", fontSize: 13, color: brand.muted, textDecoration: "none", display: "inline-block", marginTop: 24, transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = brand.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = brand.muted)}
          >
            Back to work
          </Link>
        </motion.div>
      </main>
    );
  }

  /* ---- Main content ---- */
  return (
    <main style={{ background: brand.bg, minHeight: "100vh" }}>
      {/* ============================================================
          1. HERO
          ============================================================ */}
      <section
        style={{
          paddingTop: "calc(var(--nav-height) + 72px)",
          paddingBottom: 60,
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
              <span style={{ fontFamily: "var(--font-outfit)", fontSize: 14, fontWeight: 500, color: brand.text }}>Agent Builder</span>
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
            The platform we built, that got us acquired by EY
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
            No approved tools to build AI agents. We designed one
            that became the standard at EY.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
            style={{ display: "flex", gap: 48, flexWrap: "wrap" }}
          >
            {[
              ["Role", "Lead Product Designer"],
              ["Company", "EY"],
              ["Timeline", "2 years"],
              ["Focus", "AI / Enterprise"],
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

      {/* Hero image — breakout width */}
      <section style={{ paddingBottom: 100 }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 clamp(16px, 3vw, 48px)" }}>
          <Reveal>
            <div onClick={() => setLightboxSrc("/work/agent-builder/hero.png")} style={{ borderRadius: 8, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.25)", cursor: "zoom-in" }}>
              <img
                src="/work/agent-builder/hero.png"
                alt="EY Agent Builder welcome screen"
                style={{ width: "100%", display: "block" }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          2. THE GAP
          ============================================================ */}
      <section style={{ padding: "60px 0 80px", background: brand.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(24px, 5vw, 100px)" }}>
          <div className="ab-split" style={{ display: "flex", gap: "clamp(32px, 5vw, 64px)", alignItems: "center" }}>
            {/* Text — 60% */}
            <Reveal style={{ flex: "1 1 55%", minWidth: 0 }}>
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 600, color: brand.gold, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 24 }}>
                The Opportunity
              </p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 1.5rem + 2vw, 3.2rem)", color: brand.text, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24, maxWidth: 500 }}>
                No approved tools.
              </h2>
              <div style={{ fontFamily: "var(--font-outfit)", fontSize: 16, color: brand.muted, lineHeight: 1.7, maxWidth: 480, display: "flex", flexDirection: "column", gap: 16 }}>
                <p>
                  External tools existed. Microsoft, startups, open-source.
                  But nothing was approved for enterprise use. Teams wanted
                  to build agents and had no way to do it.
                </p>
                <p>
                  We built the internal platform. Good UX made it stick.
                  It became the standard.
                </p>
              </div>
            </Reveal>

            {/* Image — 40% */}
            <Reveal delay={0.15} style={{ flex: "1 1 40%", minWidth: 0 }}>
              <div onClick={() => setLightboxSrc("/work/agent-builder/wizard.png")} style={{ borderRadius: 4, overflow: "hidden", boxShadow: "var(--shadow-image)", border: "1px solid var(--border-subtle)", cursor: "zoom-in" }}>
                <img
                  src="/work/agent-builder/wizard.png"
                  alt="Agent creation wizard"
                  style={{ width: "100%", display: "block" }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          3. SOLUTIONS
          ============================================================ */}
      <section style={{ padding: "100px 0 80px", background: brand.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(24px, 5vw, 100px)" }}>
          <SolutionsHeader />

          <SolutionsTriptychInline
            onImageClick={(src) => setLightboxSrc(src)}
          />
        </div>
      </section>

      {/* ============================================================
          3A. TRY IT — interactive demo
          ============================================================ */}
      <section style={{ padding: "80px 0", background: brand.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(24px, 5vw, 100px)" }}>
          <Reveal>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 600, color: brand.gold, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 24 }}>
              Interactive
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 1.5rem + 2vw, 3.2rem)", color: brand.text, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 16, maxWidth: 600 }}>
              Try the navigation.
            </h2>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 18, color: brand.muted, lineHeight: 1.6, maxWidth: 560, marginBottom: 48 }}>
              Click any level in the breadcrumb to switch tenants, workspaces, or agents.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <TenantSwitcherDemo />
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          3B. PLATFORMS — grid
          ============================================================ */}
      <section style={{ padding: "80px 0", background: brand.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(24px, 5vw, 100px)" }}>
          <Reveal>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 600, color: brand.gold, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 24 }}>
              Reach
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 1.5rem + 2vw, 3.2rem)", color: brand.text, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 48, maxWidth: 600 }}>
              Platforms powered by agents.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="ab-platforms" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {[
                { name: "TPRM", src: "/work/agent-builder/tprm.png" },
                { name: "ValueQ", src: "/work/agent-builder/value-q.png" },
                { name: "Risk", src: "/work/agent-builder/risk.png" },
                { name: "Contract Intelligence", src: "/work/agent-builder/contract-audit.png" },
              ].map((p) => (
                <div key={p.name}>
                  <div
                    onClick={() => setLightboxSrc(p.src)}
                    style={{ borderRadius: 4, overflow: "hidden", cursor: "zoom-in" }}
                  >
                    <img
                      src={p.src}
                      alt={p.name}
                      style={{ width: "100%", display: "block", aspectRatio: "16/10", objectFit: "cover", objectPosition: "top" }}
                    />
                  </div>
                  <p style={{ fontFamily: "var(--font-outfit)", fontSize: 13, fontWeight: 500, color: brand.muted, marginTop: 8 }}>
                    {p.name}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          3C. EVOLUTION — before/after
          ============================================================ */}
      <section style={{ padding: "80px 0", background: brand.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(24px, 5vw, 100px)" }}>
          <Reveal>
            <p style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 600, color: brand.gold, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 24 }}>
              Evolution
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 1.5rem + 2vw, 3.2rem)", color: brand.text, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 48, maxWidth: 600 }}>
              How the design evolved.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <BeforeAfterSlider
              beforeSrc="/work/agent-builder/before.png"
              afterSrc="/work/agent-builder/after.png"
              beforeAlt="Early wizard design"
              afterAlt="Final wizard design"
              beforeLabel="V1"
              afterLabel="Final"
            />
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          4. IMPACT — metrics
          ============================================================ */}
      <section style={{ padding: "100px 0 80px", background: brand.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(24px, 5vw, 100px)" }}>
          <div className="ab-metrics" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "48px 56px", borderTop: `1px solid ${brand.muted}30` }}>
            {[
              { metric: "$401M", label: "Revenue and pipeline", note: "$167M revenue. $234M pipeline. Attributed to the platform." },
              { metric: "4K+", label: "People using it", note: "Across 7 solutions including TPRM, ValueQ, and Contract Intelligence." },
              { metric: "3K+", label: "Agents in production", note: "Multiple versions managed and iterated. Teams building, testing, shipping." },
              { metric: "5M+", label: "Demos and reviews run", note: "1.8B tokens processed. The platform handled the scale." },
              { metric: "40+", label: "Collaborative workspaces", note: "Multi-tenant support across TPRM. Highest adoption, still growing." },
              { metric: "2x", label: "Patterns reused", note: "Navigation and context switching adopted by Contra and TPRM." },
            ].map((item, i) => (
              <Reveal key={item.label} delay={0.1 * (i + 1)} style={{ paddingTop: 40 }}>
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
          5. LEARNINGS — split with image
          ============================================================ */}
      <section style={{ padding: "40px 0 80px", background: brand.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(24px, 5vw, 100px)" }}>
          <div className="ab-split" style={{ display: "flex", gap: "clamp(32px, 5vw, 64px)", alignItems: "center" }}>
            {/* Text — 60% */}
            <Reveal style={{ flex: "1 1 55%", minWidth: 0 }}>
              <p style={{ fontFamily: "var(--font-outfit)", fontSize: 12, fontWeight: 600, color: brand.gold, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 24 }}>
                The Learnings
              </p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 1.5rem + 2vw, 3.2rem)", color: brand.text, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24, maxWidth: 500 }}>
                What I&rsquo;d do differently.
              </h2>
              <div style={{ fontFamily: "var(--font-outfit)", fontSize: 16, color: brand.muted, lineHeight: 1.7, maxWidth: 480, display: "flex", flexDirection: "column", gap: 16 }}>
                <p>
                  We built a flexible tool that could do everything but
                  didn&rsquo;t specialize in anything. The market moved. Droid
                  took over code generation. Microsoft&rsquo;s agent framework
                  got approved. Teams today would use those instead.
                </p>
                <p>
                  That&rsquo;s fine. We solved a real problem at a specific
                  moment: no approved tools, teams stuck. We made it easy to
                  build agents when nothing else existed.
                </p>
                <p style={{ fontWeight: 600, color: brand.text }}>
                  What drove adoption wasn&rsquo;t features. It was the UX.
                  A clean interface that made ideas feel real. That&rsquo;s
                  what unlocked $401M.
                </p>
              </div>
            </Reveal>

            {/* Image — 40% */}
            <Reveal delay={0.15} style={{ flex: "1 1 40%", minWidth: 0 }}>
              <div onClick={() => setLightboxSrc("/work/agent-builder/evaluation.png")} style={{ borderRadius: 4, overflow: "hidden", boxShadow: "var(--shadow-image)", border: "1px solid var(--border-subtle)", cursor: "zoom-in" }}>
                <img
                  src="/work/agent-builder/evaluation.png"
                  alt="Evaluation results dashboard"
                  style={{ width: "100%", display: "block" }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          6. BACK
          ============================================================ */}
      <section style={{ padding: "40px 0 100px", background: brand.bg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(24px, 5vw, 100px)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link
            href="/work"
            className="hover:text-foreground transition-colors"
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 600,
              color: brand.muted,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transitionDuration: "var(--duration-normal)",
            }}
          >
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M11 4H2M5 7L1.5 4L5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to all work
          </Link>
          <Link
            href="/work/flow"
            className="hover:text-accent-orange transition-colors"
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 14,
              fontWeight: 600,
              color: brand.muted,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transitionDuration: "var(--duration-normal)",
            }}
          >
            Next project
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 4H10M7 1L10.5 4L7 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .ab-split { flex-direction: column !important; }
          .ab-platforms { grid-template-columns: repeat(2, 1fr) !important; }
          .ab-metrics { grid-template-columns: 1fr !important; }
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
