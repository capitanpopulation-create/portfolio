"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PrototypeLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  prototypeUrl: string;
  title: string;
  passwordProtected?: boolean;
}

const PASSCODE_KEY = "prototype-access";

export function PrototypeLightbox({
  isOpen,
  onClose,
  prototypeUrl,
  title,
  passwordProtected = false,
}: PrototypeLightboxProps) {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check session storage for prior auth
  useEffect(() => {
    if (!passwordProtected) {
      setAuthenticated(true);
      return;
    }
    const stored = sessionStorage.getItem(PASSCODE_KEY);
    if (stored === "granted") setAuthenticated(true);
  }, [passwordProtected]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setLoading(true);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key to close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple client-side check — the env var is checked at build time
    // For real security, use Next.js API route + middleware
    if (password === process.env.NEXT_PUBLIC_PROTOTYPE_PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem(PASSCODE_KEY, "granted");
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal container — always dark regardless of site theme */}
          <motion.div
            className="relative z-10 flex flex-col"
            style={{
              width: "min(92vw, 1400px)",
              height: "min(88vh, 900px)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "#141414",
            }}
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header bar */}
            <div
              className="flex items-center justify-between shrink-0"
              style={{
                padding: "var(--space-3) var(--space-4)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                background: "#1a1a1a",
              }}
            >
              <div className="flex items-center" style={{ gap: "var(--space-3)" }}>
                <span
                  className="font-[family-name:var(--font-mono)] uppercase"
                  style={{
                    fontSize: "var(--text-xs)",
                    letterSpacing: "0.12em",
                    color: "#888",
                  }}
                >
                  Prototype
                </span>
                <span style={{ color: "#555" }}>/</span>
                <span style={{ fontSize: "var(--text-sm)", color: "#aaa" }}>
                  {title}
                </span>
              </div>

              <button
                onClick={onClose}
                className="flex items-center justify-center transition-colors cursor-pointer"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "var(--radius-sm)",
                  transitionDuration: "var(--duration-normal)",
                  color: "#888",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
                aria-label="Close prototype viewer"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="relative flex-1 min-h-0">
              {!authenticated ? (
                /* Password gate */
                <div className="flex items-center justify-center h-full">
                  <form
                    onSubmit={handlePasswordSubmit}
                    className="flex flex-col items-center"
                    style={{ gap: "var(--space-4)", width: "min(320px, 80vw)" }}
                  >
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        background: "#1a1a1a",
                        marginBottom: "var(--space-2)",
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="#888"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="9" width="14" height="9" rx="2" />
                        <path d="M6 9V6a4 4 0 118 0v3" />
                      </svg>
                    </div>

                    <p
                      className="text-center"
                      style={{ fontSize: "var(--text-sm)", color: "#aaa" }}
                    >
                      This prototype is password protected.
                    </p>

                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(false);
                      }}
                      placeholder="Enter password"
                      autoFocus
                      className="w-full outline-none"
                      style={{
                        padding: "var(--space-3) var(--space-4)",
                        fontSize: "var(--text-sm)",
                        borderRadius: "var(--radius-md)",
                        border: `1px solid ${error ? "var(--accent-orange)" : "rgba(255,255,255,0.12)"}`,
                        background: "#0a0a0a",
                        color: "#eee",
                        transition: `border-color var(--duration-normal)`,
                      }}
                    />

                    {error && (
                      <p
                        style={{ fontSize: "var(--text-xs)", color: "var(--accent-orange)" }}
                      >
                        Incorrect password. Try again.
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full font-medium hover:opacity-90 transition-opacity cursor-pointer"
                      style={{
                        padding: "var(--space-3) var(--space-4)",
                        fontSize: "var(--text-sm)",
                        borderRadius: "var(--radius-md)",
                        background: "var(--accent-orange)",
                        color: "#fff",
                        border: "none",
                        transitionDuration: "var(--duration-normal)",
                      }}
                    >
                      View Prototype
                    </button>
                  </form>
                </div>
              ) : (
                /* Iframe embed */
                <>
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center" style={{ gap: "var(--space-3)" }}>
                        <div
                          className="animate-spin"
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            border: "2px solid rgba(255,255,255,0.1)",
                            borderTopColor: "var(--accent-orange)",
                          }}
                        />
                        <span style={{ fontSize: "var(--text-xs)", color: "#888" }}>
                          Loading prototype...
                        </span>
                      </div>
                    </div>
                  )}
                  <iframe
                    src={prototypeUrl}
                    title={`${title} prototype`}
                    className="w-full h-full border-0"
                    style={{ opacity: loading ? 0 : 1, transition: "opacity 0.3s" }}
                    onLoad={() => setLoading(false)}
                    allow="fullscreen"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  />
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
