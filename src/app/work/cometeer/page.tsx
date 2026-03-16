"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Brand tokens                                                       */
/* ------------------------------------------------------------------ */
const brand = {
  warmBg: "#F5F0EB",
  darkText: "#2e2c29",
  teal: "#043245",
  cream: "#F3F5E8",
  gold: "#F5D577",
  muted: "#8a8580",
};

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
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Phone frame                                                        */
/* ------------------------------------------------------------------ */
function PhoneFrame({
  src,
  alt,
  width = 280,
}: {
  src: string;
  alt: string;
  width?: number;
}) {
  return (
    <div
      style={{
        background: "#000",
        borderRadius: 36,
        padding: 10,
        boxShadow:
          "0 24px 64px -16px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
        width,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          borderRadius: 28,
          overflow: "hidden",
          background: "#fff",
          position: "relative",
          aspectRatio: "390/844",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          style={{ objectFit: "cover", objectPosition: "top" }}
          sizes={`${width}px`}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Browser frame                                                      */
/* ------------------------------------------------------------------ */
function BrowserFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      style={{
        background: "#1e1e1e",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow:
          "0 24px 64px -16px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
      }}
    >
      {/* title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "10px 14px",
          background: "#2a2a2a",
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#ff5f56",
          }}
        />
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#ffbd2e",
          }}
        />
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#27c93f",
          }}
        />
      </div>
      {/* image */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/10" }}>
        <Image
          src={src}
          alt={alt}
          fill
          style={{ objectFit: "cover", objectPosition: "top" }}
          sizes="(max-width: 768px) 100vw, 700px"
        />
      </div>
    </div>
  );
}

/* ================================================================== */
/*  PAGE                                                               */
/* ================================================================== */
export default function CometeerPage() {
  return (
    <main style={{ background: brand.warmBg, minHeight: "100vh" }}>
      {/* ============================================================
          1. HERO
          ============================================================ */}
      <section
        style={{
          paddingTop: "calc(var(--nav-height) + var(--space-24))",
          paddingBottom: "var(--space-30)",
          background: brand.warmBg,
        }}
      >
        <div className="page-container" style={{ maxWidth: 900, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* breadcrumb */}
            <div
              style={{
                fontFamily: "var(--font-mono-jb)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginBottom: "var(--space-10)",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
              }}
            >
              <Link
                href="/work"
                style={{ color: brand.muted, textDecoration: "none" }}
              >
                Work
              </Link>
              <span style={{ color: brand.muted, opacity: 0.4 }}>/</span>
              <span style={{ color: brand.darkText }}>Cometeer</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 2rem + 3vw, 5rem)",
              color: brand.teal,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginBottom: "var(--space-6)",
              maxWidth: 700,
            }}
          >
            One-Time Purchase vs. Subscription
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(1rem, 0.9rem + 0.5vw, 1.25rem)",
              color: brand.muted,
              maxWidth: 560,
              lineHeight: 1.6,
              marginBottom: "var(--space-10)",
            }}
          >
            Redesigning Cometeer&rsquo;s checkout to let users buy coffee without
            subscribing.
          </motion.p>

          {/* meta row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-8)",
            }}
          >
            {[
              ["Role", "Product Designer"],
              ["Date", "Feb 2023"],
              ["Focus", "E-commerce"],
            ].map(([label, value]) => (
              <div key={label}>
                <p
                  style={{
                    fontFamily: "var(--font-mono-jb)",
                    fontSize: "10px",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: brand.muted,
                    marginBottom: "var(--space-1)",
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: "var(--text-sm)",
                    color: brand.darkText,
                  }}
                >
                  {value}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          2. THE PROBLEM
          ============================================================ */}
      <section
        style={{
          padding: "var(--space-40) 0",
          background: brand.warmBg,
        }}
      >
        <div
          className="page-container"
          style={{ maxWidth: 700, margin: "0 auto" }}
        >
          <Reveal>
            <blockquote
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem, 1.25rem + 1.2vw, 2.5rem)",
                color: brand.darkText,
                lineHeight: 1.35,
                fontStyle: "italic",
                borderLeft: `3px solid ${brand.gold}`,
                paddingLeft: "var(--space-6)",
                textAlign: "left",
              }}
            >
              &ldquo;One of our biggest pain points is the inability to purchase
              coffee without a subscription.&rdquo;
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          3. OLD VS NEW
          ============================================================ */}
      <section
        style={{
          padding: "var(--space-30) 0",
          background: brand.warmBg,
        }}
      >
        <div className="page-container">
          <Reveal>
            <p
              style={{
                fontFamily: "var(--font-mono-jb)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: brand.muted,
                marginBottom: "var(--space-8)",
              }}
            >
              Before & After
            </p>
          </Reveal>

          {/* Old vs New annotated comparison */}
          <Reveal delay={0.1}>
            <div
              style={{
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 24px 80px -12px rgba(0,0,0,0.12)",
                position: "relative",
                width: "100%",
                aspectRatio: "16/9",
              }}
            >
              <Image
                src="/work/cometeer/old-vs-new.png"
                alt="Before and after comparison of Cometeer checkout"
                fill
                style={{ objectFit: "cover", objectPosition: "top" }}
                sizes="100vw"
              />
            </div>
          </Reveal>

          {/* Desktop old version */}
          <Reveal delay={0.15}>
            <div style={{ marginTop: "var(--space-16)" }}>
              <BrowserFrame
                src="/work/cometeer/old-version-desktop.png"
                alt="Old Cometeer desktop checkout page"
              />
            </div>
          </Reveal>

          {/* Mobile old version */}
          <Reveal delay={0.2}>
            <div
              style={{
                marginTop: "var(--space-12)",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <PhoneFrame
                src="/work/cometeer/old-version-mobile.png"
                alt="Old Cometeer mobile checkout"
                width={260}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          4. THE SOLUTION (dark contrast block)
          ============================================================ */}
      <section
        style={{
          padding: "var(--space-40) 0",
          background: brand.teal,
        }}
      >
        <div className="page-container">
          <Reveal>
            <div
              style={{
                textAlign: "center",
                marginBottom: "var(--space-20)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 1.5rem + 2vw, 3.5rem)",
                  color: brand.cream,
                  letterSpacing: "-0.01em",
                  marginBottom: "var(--space-4)",
                }}
              >
                Simple solution.
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-outfit)",
                  fontSize: "var(--text-base)",
                  color: brand.cream,
                  opacity: 0.7,
                  maxWidth: 480,
                  margin: "0 auto",
                  lineHeight: 1.7,
                }}
              >
                A single, reusable component that lets users compare subscription
                vs. one-time pricing at a glance.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="cometeer-phones">
              {/* Phone 1 */}
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ textAlign: "center" }}
              >
                <PhoneFrame
                  src="/work/cometeer/wireframe-1.png"
                  alt="Product Hero wireframe"
                  width={260}
                />
                <p
                  style={{
                    fontFamily: "var(--font-mono-jb)",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: brand.cream,
                    opacity: 0.4,
                    textAlign: "center",
                    marginTop: "var(--space-4)",
                  }}
                >
                  Product Hero
                </p>
              </motion.div>

              {/* Phone 2 (staggered down) */}
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="cometeer-phone-middle"
                style={{ textAlign: "center" }}
              >
                <PhoneFrame
                  src="/work/cometeer/wireframe-3.png"
                  alt="Plan Selection wireframe"
                  width={260}
                />
                <p
                  style={{
                    fontFamily: "var(--font-mono-jb)",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: brand.cream,
                    opacity: 0.4,
                    textAlign: "center",
                    marginTop: "var(--space-4)",
                  }}
                >
                  Plan Selection
                </p>
              </motion.div>

              {/* Phone 3 */}
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ textAlign: "center" }}
              >
                <PhoneFrame
                  src="/work/cometeer/wireframe-5.png"
                  alt="Compare Roasts wireframe"
                  width={260}
                />
                <p
                  style={{
                    fontFamily: "var(--font-mono-jb)",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: brand.cream,
                    opacity: 0.4,
                    textAlign: "center",
                    marginTop: "var(--space-4)",
                  }}
                >
                  Compare Roasts
                </p>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          5. BACK TO WORK
          ============================================================ */}
      <section
        style={{
          padding: "var(--space-40) 0",
          background: brand.warmBg,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Link
            href="/work"
            style={{
              fontFamily: "var(--font-mono-jb)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: brand.muted,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = brand.darkText)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = brand.muted)
            }
          >
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path
                d="M11 4H2M5 7L1.5 4L5 1"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to all work
          </Link>
        </div>
      </section>

      {/* Responsive styles */}
      <style>{`
        .cometeer-phones {
          display: flex;
          justify-content: center;
          gap: var(--space-8);
          flex-wrap: wrap;
          align-items: flex-start;
        }
        .cometeer-phone-middle {
          margin-top: var(--space-10);
        }
        @media (max-width: 768px) {
          .cometeer-phones {
            flex-direction: column;
            align-items: center;
            gap: var(--space-12);
          }
          .cometeer-phone-middle {
            margin-top: 0 !important;
          }
        }
      `}</style>
    </main>
  );
}
