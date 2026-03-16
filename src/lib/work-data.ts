export interface WorkItem {
  id: string;
  title: string;
  description: string;
  tag: string;
  prototypeUrl?: string;
  passwordProtected?: boolean;
  /** Standalone project page route (e.g. /work/cometeer) */
  href?: string;
}

export interface WorkCategory {
  id: string;
  label: string;
  description: string;
  href: string;
  items: WorkItem[];
  placeholder?: boolean;
}

export const WORK_CATEGORIES: WorkCategory[] = [
  {
    id: "design",
    label: "Design",
    description:
      "Product and UX case studies — turning complex systems into clear, usable experiences.",
    href: "/work/design",
    items: [
      {
        id: "cometeer",
        tag: "Case Study",
        title: "Cometeer",
        description:
          "Redesigning the checkout experience to simplify the choice between one-time purchases and subscriptions — increasing OTP conversion without cannibalizing subscriptions.",
        href: "/work/cometeer",
      },
      {
        id: "erp",
        tag: "Product Design",
        title: "ERP Integration Tool",
        description:
          "Designing a seamless interface for connecting enterprise resource planning systems — simplifying complex data flows into clear, actionable workflows.",
      },
      {
        id: "agent-builder",
        tag: "Product Design",
        title: "Agent Builder Platform",
        description:
          "A visual platform for building and deploying AI agents — making autonomous workflows accessible through intuitive drag-and-drop composition.",
        prototypeUrl: "https://bird-trace-73726484.figma.site",
        passwordProtected: true,
      },
      {
        id: "gift-card",
        tag: "Concept",
        title: "B2B Digital Gift Card",
        description:
          "Exploring a digital gift card experience for business-to-business gifting — from bulk purchasing to personalized delivery and redemption.",
      },
    ],
  },
  {
    id: "motion",
    label: "Motion",
    description:
      "Motion graphics and animation explorations — spring physics, micro-interactions, and kinetic behaviors.",
    href: "/work/motion",
    items: [],
    placeholder: true,
  },
  {
    id: "illustration",
    label: "Illustration",
    description:
      "Visual storytelling through illustration — conceptual work, editorial graphics, and brand imagery.",
    href: "/work/illustration",
    items: [],
    placeholder: true,
  },
  {
    id: "experiments",
    label: "Experiments",
    description:
      "Side projects and technical explorations — generative art, design systems, and prototyping tools.",
    href: "/work/experiments",
    items: [
      {
        id: "kinetic-canvas",
        tag: "Generative Art",
        title: "Kinetic Canvas",
        description:
          "Interactive generative art built with HTML Canvas — cursor-reactive line fields with velocity mapping, scroll morphing, and theme switching.",
      },
      {
        id: "design-tokens",
        tag: "Design Systems",
        title: "Design System Tokens",
        description:
          "A spacing, color, and typography token system built on a 4px grid — powering consistent UI across components and themes.",
      },
      {
        id: "motion-experiments",
        tag: "Prototyping",
        title: "Motion Experiments",
        description:
          "Explorations in micro-interaction and animation — spring physics, staggered entrances, and cursor-driven behaviors.",
      },
    ],
  },
];

export function getCategoryById(id: string): WorkCategory | undefined {
  return WORK_CATEGORIES.find((c) => c.id === id);
}

export function getProjectById(id: string): WorkItem | undefined {
  for (const category of WORK_CATEGORIES) {
    const item = category.items.find((item) => item.id === id);
    if (item) return item;
  }
  return undefined;
}
