"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface CursorPosition {
  /** Normalized X: -1 (left) to 1 (right), 0 = center */
  x: number;
  /** Normalized Y: -1 (top) to 1 (bottom), 0 = center */
  y: number;
  /** Whether the cursor is currently within the viewport */
  isActive: boolean;
}

export function useCursorPosition(): CursorPosition {
  const [position, setPosition] = useState<CursorPosition>({
    x: 0,
    y: 0,
    isActive: false,
  });

  const rafRef = useRef<number>(0);
  const latestEvent = useRef<{ x: number; y: number } | null>(null);

  const updatePosition = useCallback(() => {
    if (latestEvent.current) {
      const { x, y } = latestEvent.current;
      setPosition({
        x: (x / window.innerWidth) * 2 - 1,
        y: (y / window.innerHeight) * 2 - 1,
        isActive: true,
      });
      latestEvent.current = null;
    }
    rafRef.current = requestAnimationFrame(updatePosition);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      latestEvent.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      latestEvent.current = null;
      setPosition((prev) => ({ ...prev, isActive: false }));
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    rafRef.current = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [updatePosition]);

  return position;
}
