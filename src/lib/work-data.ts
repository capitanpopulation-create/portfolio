export interface WorkProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  href: string;
  thumbnail?: string;
  comingSoon?: boolean;
}

export const PROJECTS: WorkProject[] = [
  {
    id: "agent-builder",
    title: "Agent Builder",
    description:
      "No approved way to build AI agents at EY. I designed the internal platform that became the standard.",
    tags: ["Case Study", "AI / ML", "Product Design"],
    href: "/work/agent-builder",
    thumbnail: "/images/work/agent-builder-thumb.png",
  },
  {
    id: "flow",
    title: "Flow",
    description:
      "ERP implementation was all manual. Spreadsheets, Word docs, no shared system. I built a tool that standardized the process and added AI-powered analysis.",
    tags: ["Case Study", "Enterprise", "Product Design"],
    href: "/work/flow",
    thumbnail: "/images/work/flow-thumb.png",
  },
  {
    id: "cometeer",
    title: "Cometeer",
    description:
      "Redesigning the checkout experience to simplify the choice between one-time purchases and subscriptions — increasing OTP conversion without cannibalizing subscriptions.",
    tags: ["Case Study", "E-Commerce", "UX Design"],
    href: "/work/cometeer",
    thumbnail: "/images/work/cometeer-thumb.png",
    comingSoon: true,
  },
];

export function getProjectById(id: string): WorkProject | undefined {
  return PROJECTS.find((p) => p.id === id);
}
