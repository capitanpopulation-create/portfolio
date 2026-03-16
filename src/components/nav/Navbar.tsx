"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
          className="font-[family-name:var(--font-mono)] uppercase text-brown-100"
          style={{ fontSize: "var(--text-sm)", letterSpacing: "0.2em" }}
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
        className="flex flex-col font-[family-name:var(--font-mono)] uppercase"
        style={{
          padding: "var(--space-8) var(--page-margin)",
          gap: "var(--space-1)",
          fontSize: "var(--text-sm)",
          letterSpacing: "0.16em",
        }}
      >
        {[
          { label: "Work", href: "/work" },
          { label: "About", href: "/about" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={onClose}
            className="text-brown-300 hover:text-accent-orange transition-colors"
            style={{
              padding: "var(--space-4) 0",
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
        className="fixed top-0 left-0 right-0 z-50 font-[family-name:var(--font-mono)] uppercase transition-colors"
        style={{
          height: "var(--nav-height)",
          fontSize: "var(--text-xs)",
          letterSpacing: "0.16em",
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
              fontSize: "var(--text-sm)",
              letterSpacing: "0.2em",
              transitionDuration: "var(--duration-normal)",
            }}
          >
            Gabo Behrens
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center" style={{ gap: "var(--space-10)" }}>
            <Link
              href="/work"
              className="text-brown-100 hover:text-accent-orange transition-colors"
              style={{ transitionDuration: "var(--duration-normal)" }}
            >
              Work
            </Link>
            <Link
              href="/about"
              className="text-brown-100 hover:text-accent-orange transition-colors"
              style={{ transitionDuration: "var(--duration-normal)" }}
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
