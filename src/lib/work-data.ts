export interface WorkProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  href: string;
  thumbnail?: string; // path to thumbnail image
}

export const PROJECTS: WorkProject[] = [
  {
    id: "erp-integration",
    title: "ERP Integration Tool",
    description:
      "Designing a seamless interface for connecting enterprise resource planning systems — simplifying complex data flows into clear, actionable workflows.",
    tags: ["Product Design", "Enterprise", "B2B"],
    href: "/work/erp-integration",
    thumbnail: "/images/work/erp-integration-thumb.png",
  },
  {
    id: "agent-builder",
    title: "Agent Builder Platform",
    description:
      "A visual platform for building and deploying AI agents — making autonomous workflows accessible through intuitive drag-and-drop composition.",
    tags: ["Product Design", "AI / ML", "SaaS"],
    href: "/work/agent-builder",
    thumbnail: "/images/work/agent-builder-thumb.png",
  },
  {
    id: "cometeer",
    title: "Cometeer",
    description:
      "Redesigning the checkout experience to simplify the choice between one-time purchases and subscriptions — increasing OTP conversion without cannibalizing subscriptions.",
    tags: ["Case Study", "E-Commerce", "UX Design"],
    href: "/work/cometeer",
    thumbnail: "/images/work/cometeer-thumb.png",
  },
];

export function getProjectById(id: string): WorkProject | undefined {
  return PROJECTS.find((p) => p.id === id);
}
