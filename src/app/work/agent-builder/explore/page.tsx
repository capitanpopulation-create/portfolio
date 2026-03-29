"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { ExploreCanvas } from "@/components/explore/ExploreCanvas";

const ease = [0.16, 1, 0.3, 1] as const;
const PASSWORD = "flow2026";

export default function AgentBuilderExplorePage() {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  if (!unlocked) {
    return (
      <main
        style={{
          background: "var(--background)",
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
              background: "var(--foreground)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="var(--accent-orange)" strokeWidth="1.5" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="var(--accent-orange)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 1.2rem + 1vw, 2rem)",
              color: "var(--foreground)",
              marginBottom: 8,
            }}
          >
            Interactive case study
          </h1>
          <p
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 15,
              color: "var(--brown-300)",
              marginBottom: 32,
              lineHeight: 1.5,
            }}
          >
            Enter the password to explore this project.
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
                color: "var(--foreground)",
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
                background: "var(--foreground)",
                color: "var(--background)",
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Explore project
            </button>
          </form>
          <Link
            href="/work"
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: 13,
              color: "var(--brown-300)",
              textDecoration: "none",
              display: "inline-block",
              marginTop: 24,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--foreground)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--brown-300)")}
          >
            Back to work
          </Link>
        </motion.div>
      </main>
    );
  }

  return <ExploreCanvas />;
}
