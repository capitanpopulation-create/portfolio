"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { INTRO_PULSE_DURATION } from "@/lib/constants";

const LOGO_TEXT = "Gabo Behrens";
const ENTRANCE_DELAY = INTRO_PULSE_DURATION + 0.1;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: ENTRANCE_DELAY,
    },
  },
};

const letterVariants = {
  hidden: { y: 14, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 380,
      damping: 12,
      mass: 0.7,
    },
  },
};

function AnimatedLogo() {
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const rafRef = useRef<number>(0);
  const [isHovered, setIsHovered] = useState(false);
  const startTimeRef = useRef<number>(0);

  const animate = useCallback(
    (time: number) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = (time - startTimeRef.current) / 1000;

      lettersRef.current.forEach((el, i) => {
        if (!el || el.textContent === "\u00A0") return;
        const phase = i * 0.55;
        const y = Math.sin(elapsed * 1.8 + phase) * 0.8;
        el.style.transform = `translateY(${y}px)`;
      });

      rafRef.current = requestAnimationFrame(animate);
    },
    []
  );

  useEffect(() => {
    if (isHovered) {
      startTimeRef.current = 0;
      rafRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(rafRef.current);
      lettersRef.current.forEach((el) => {
        if (el) el.style.transform = "translateY(0px)";
      });
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [isHovered, animate]);

  return (
    <motion.span
      className="inline-flex"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ overflow: "visible" }}
    >
      {LOGO_TEXT.split("").map((char, i) => (
        <motion.span
          key={i}
          ref={(el) => { lettersRef.current[i] = el; }}
          variants={letterVariants}
          style={{
            display: "inline-block",
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            willChange: "transform",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 md:hidden"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div
        className="flex items-center justify-between"
        style={{
          height: "var(--nav-height)",
          padding: "0 var(--page-margin)",
        }}
      >
        <Link
          href="/"
          onClick={onClose}
          className="font-[family-name:var(--font-outfit)] text-brown-100"
          style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}
        >
          Gabo Behrens
        </Link>
        <button
          onClick={onClose}
          className="text-brown-100 hover:text-accent-orange transition-colors"
          style={{ transitionDuration: "var(--duration-normal)" }}
          aria-label="Close menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <nav
        className="flex flex-col font-[family-name:var(--font-outfit)]"
        style={{
          padding: "var(--space-8) var(--page-margin)",
          gap: "var(--space-1)",
          fontSize: "var(--text-base)",
        }}
      >
        {[
          { label: "About", href: "/about" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={onClose}
            className="text-brown-300 hover:text-accent-orange transition-colors"
            style={{
              padding: "var(--space-4) 0",
              fontWeight: 500,
              transitionDuration: "var(--duration-normal)",
              borderBottom: "1px solid var(--border-muted)",
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 font-[family-name:var(--font-outfit)] transition-colors"
        style={{
          height: "var(--nav-height)",
          fontSize: "13px",
          transitionDuration: "var(--duration-slow)",
          backgroundColor: isHome ? "transparent" : "var(--nav-surface)",
          backdropFilter: isHome ? "none" : "blur(12px)",
          WebkitBackdropFilter: isHome ? "none" : "blur(12px)",
        }}
      >
        <div
          className="flex items-center justify-between h-full"
          style={{ padding: "0 var(--page-margin)" }}
        >
          <Link
            href="/"
            className="text-brown-100 hover:text-accent-orange transition-colors"
            style={{
              fontSize: "14px",
              fontWeight: 600,
              transitionDuration: "var(--duration-normal)",
            }}
          >
            <AnimatedLogo />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center" style={{ gap: "var(--space-10)" }}>
            <Link
              href="/about"
              className="text-brown-300 hover:text-accent-orange transition-colors"
              style={{ fontWeight: 500, transitionDuration: "var(--duration-normal)" }}
            >
              About
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-brown-100 hover:text-accent-orange transition-colors"
            onClick={() => setMobileOpen(true)}
            style={{ transitionDuration: "var(--duration-normal)" }}
            aria-label="Open menu"
          >
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
              <path d="M0 1H20M0 7H20M0 13H20" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </button>
        </div>
      </nav>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
