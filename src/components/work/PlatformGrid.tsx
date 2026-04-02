"use client";

import { useState } from "react";
import { ImageLightbox } from "@/components/work/ImageLightbox";

export interface Platform {
  name: string;
  description: string;
  imageSrc?: string;
}

interface PlatformGridProps {
  platforms: Platform[];
}

export function PlatformGrid({ platforms }: PlatformGridProps) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  return (
    <>
      <div
        className="platform-grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(platforms.length, 4)}, 1fr)`,
          gap: 16,
        }}
      >
        {platforms.map((p) => (
          <div
            key={p.name}
            onClick={() => p.imageSrc && setLightboxSrc(p.imageSrc)}
            style={{
              borderRadius: 8,
              border: "1px solid var(--border-subtle)",
              background: "var(--surface-elevated)",
              padding: "clamp(20px, 2vw, 32px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              cursor: p.imageSrc ? "pointer" : "default",
              transition: "transform 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.borderColor = "var(--border-interactive)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.borderColor = "var(--border-subtle)";
            }}
          >
            {p.imageSrc ? (
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                <img
                  src={p.imageSrc}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 6,
                  background: "var(--border-interactive)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  color: "var(--foreground)",
                  letterSpacing: "-0.02em",
                  flexShrink: 0,
                }}
              >
                {p.name[0]}
              </div>
            )}
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--foreground)",
                textAlign: "center",
              }}
            >
              {p.name}
            </span>
            <span
              style={{
                fontFamily: "var(--font-outfit)",
                fontSize: 12,
                color: "var(--brown-300)",
                textAlign: "center",
                lineHeight: 1.4,
              }}
            >
              {p.description}
            </span>
          </div>
        ))}
      </div>

      <ImageLightbox
        src={lightboxSrc ?? ""}
        alt="Platform detail"
        isOpen={!!lightboxSrc}
        onClose={() => setLightboxSrc(null)}
      />

      <style>{`
        @media (max-width: 768px) {
          .platform-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </>
  );
}
