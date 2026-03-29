import type { NodeId } from "./explore-context";

export interface NodePosition {
  id: NodeId;
  label: string;
  left: string;
  top: string;
  mobileOrder: number;
}

export const NODE_POSITIONS: NodePosition[] = [
  { id: "hero", label: "The Origin", left: "15%", top: "30%", mobileOrder: 0 },
  { id: "opportunity", label: "The Gap", left: "72%", top: "18%", mobileOrder: 1 },
  { id: "solutions", label: "What We Shipped", left: "45%", top: "55%", mobileOrder: 2 },
  { id: "impact", label: "$401M", left: "78%", top: "65%", mobileOrder: 3 },
  { id: "learnings", label: "What I Learned", left: "22%", top: "75%", mobileOrder: 4 },
];

/** Completion arc positions — nodes rearrange when all visited */
export const COMPLETION_POSITIONS: Record<NodeId, { left: string; top: string }> = {
  hero: { left: "18%", top: "28%" },
  opportunity: { left: "34%", top: "20%" },
  solutions: { left: "50%", top: "16%" },
  impact: { left: "66%", top: "20%" },
  learnings: { left: "82%", top: "28%" },
};
