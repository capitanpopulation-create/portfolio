"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageLightboxProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageLightbox({ src, alt, isOpen, onClose }: ImageLightboxProps) {
  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            cursor: "zoom-out",
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(0,0,0,0.4)",
              color: "#fff",
              cursor: "pointer",
              zIndex: 2,
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M2 2L12 12M12 2L2 12" />
            </svg>
          </button>

          {/* Image */}
          <motion.img
            key={src}
            src={src}
            alt={alt}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "92vw",
              maxHeight: "88vh",
              objectFit: "contain",
              borderRadius: 4,
              cursor: "default",
              boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
