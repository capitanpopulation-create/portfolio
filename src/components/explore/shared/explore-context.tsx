"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type NodeId = "hero" | "opportunity" | "solutions" | "impact" | "learnings";

interface ExploreState {
  visitedNodes: Set<NodeId>;
  activeNode: NodeId | null;
  allVisited: boolean;
  markVisited: (id: NodeId) => void;
  setActiveNode: (id: NodeId | null) => void;
}

const ExploreContext = createContext<ExploreState | null>(null);

export function ExploreProvider({ children }: { children: React.ReactNode }) {
  const [visitedNodes, setVisitedNodes] = useState<Set<NodeId>>(new Set());
  const [activeNode, setActiveNodeRaw] = useState<NodeId | null>(null);

  const markVisited = useCallback((id: NodeId) => {
    setVisitedNodes((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const setActiveNode = useCallback(
    (id: NodeId | null) => {
      if (id) markVisited(id);
      setActiveNodeRaw(id);
    },
    [markVisited],
  );

  const allVisited = visitedNodes.size === 5;

  const value = useMemo(
    () => ({ visitedNodes, activeNode, allVisited, markVisited, setActiveNode }),
    [visitedNodes, activeNode, allVisited, markVisited, setActiveNode],
  );

  return <ExploreContext.Provider value={value}>{children}</ExploreContext.Provider>;
}

export function useExplore() {
  const ctx = useContext(ExploreContext);
  if (!ctx) throw new Error("useExplore must be used within ExploreProvider");
  return ctx;
}
