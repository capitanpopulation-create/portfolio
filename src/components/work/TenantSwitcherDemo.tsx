"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */
interface SwitcherItem {
  id: string;
  name: string;
  description: string;
}

const tenants: SwitcherItem[] = [
  { id: "nexora", name: "Nexora Corp", description: "Enterprise audit & compliance" },
  { id: "veritas", name: "Veritas Solutions", description: "Financial advisory services" },
  { id: "apexion", name: "Apexion Industries", description: "Manufacturing analytics" },
  { id: "luminos", name: "Luminos Digital", description: "Digital transformation" },
  { id: "zentara", name: "Zentara Group", description: "Risk management platform" },
];

const workspaces: SwitcherItem[] = [
  { id: "sox", name: "SOX Environment", description: "Sarbanes-Oxley compliance" },
  { id: "innovation", name: "Innovation Hub", description: "R&D and prototyping" },
  { id: "bank-recon", name: "Bank Reconciliation", description: "Transaction matching" },
  { id: "compliance", name: "Compliance Hub", description: "Regulatory monitoring" },
];

const agents: SwitcherItem[] = [
  { id: "control", name: "Control Validator", description: "SOX control testing" },
  { id: "contract", name: "Contract Audit", description: "Clause extraction & review" },
  { id: "risk", name: "Risk Analyzer", description: "Third-party risk scoring" },
  { id: "compliance-bot", name: "Compliance Bot", description: "Regulatory gap detection" },
];

type DropdownType = "tenant" | "workspace" | "agent" | null;

const colors = {
  tenant: "#0a558e",
  workspace: "#5e36bc",
  agent: "#b14891",
};

/* ------------------------------------------------------------------ */
/*  Icons (simple SVG shapes matching the Figma design)                */
/* ------------------------------------------------------------------ */
function TenantIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect width="16" height="16" rx="2" fill={colors.tenant} />
      <path
        d="M8 3.5C8 3.5 5.5 5.5 5.5 8C5.5 9.38 6.62 10.5 8 10.5C9.38 10.5 10.5 9.38 10.5 8C10.5 5.5 8 3.5 8 3.5Z"
        fill="white"
        fillOpacity="0.9"
      />
      <circle cx="8" cy="12" r="1" fill="white" fillOpacity="0.6" />
    </svg>
  );
}

function WorkspaceIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect width="16" height="16" rx="2" fill={colors.workspace} />
      <circle cx="6" cy="6" r="2" fill="white" fillOpacity="0.9" />
      <circle cx="10" cy="6" r="2" fill="white" fillOpacity="0.6" />
      <circle cx="6" cy="10" r="2" fill="white" fillOpacity="0.6" />
      <circle cx="10" cy="10" r="2" fill="white" fillOpacity="0.6" />
    </svg>
  );
}

function AgentIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect width="16" height="16" rx="2" fill={colors.agent} />
      <path
        d="M4 8C5 6 7 5.5 8 7C9 5.5 11 6 12 8"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.9"
      />
      <circle cx="8" cy="10" r="1.5" fill="white" fillOpacity="0.6" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
      <path d="M2 3L4 5L6 3" stroke="#666a73" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronUp() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
      <path d="M2 5L4 3L6 5" stroke="#f6f6fa" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="4.5" stroke="#666a73" strokeWidth="1.2" />
      <path d="M10.5 10.5L13 13" stroke="#666a73" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8L8 3.5L13 8" stroke="#666a73" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 7V12.5H11.5V7" stroke="#666a73" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export function TenantSwitcherDemo() {
  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);
  const [selectedTenant, setSelectedTenant] = useState("nexora");
  const [selectedWorkspace, setSelectedWorkspace] = useState("sox");
  const [selectedAgent, setSelectedAgent] = useState("control");
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const tenantRef = useRef<HTMLButtonElement>(null);
  const workspaceRef = useRef<HTMLButtonElement>(null);
  const agentRef = useRef<HTMLButtonElement>(null);

  const currentTenant = tenants.find((t) => t.id === selectedTenant)!;
  const currentWorkspace = workspaces.find((w) => w.id === selectedWorkspace)!;
  const currentAgent = agents.find((a) => a.id === selectedAgent)!;

  // Close on escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenDropdown(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleToggle = useCallback(
    (type: DropdownType) => {
      setOpenDropdown((prev) => (prev === type ? null : type));
      setSearchQuery("");
    },
    []
  );

  const handleSelect = useCallback(
    (type: DropdownType, id: string) => {
      if (type === "tenant") setSelectedTenant(id);
      if (type === "workspace") setSelectedWorkspace(id);
      if (type === "agent") setSelectedAgent(id);
      setOpenDropdown(null);
      setSearchQuery("");
    },
    []
  );

  const getItems = (type: DropdownType) => {
    const map = { tenant: tenants, workspace: workspaces, agent: agents };
    const items = map[type as keyof typeof map] || [];
    if (!searchQuery) return items;
    return items.filter((i) =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getSelectedId = (type: DropdownType) => {
    if (type === "tenant") return selectedTenant;
    if (type === "workspace") return selectedWorkspace;
    if (type === "agent") return selectedAgent;
    return "";
  };

  const getIcon = (type: DropdownType, size = 16) => {
    if (type === "tenant") return <TenantIcon size={size} />;
    if (type === "workspace") return <WorkspaceIcon size={size} />;
    return <AgentIcon size={size} />;
  };

  const getLabel = (type: DropdownType) => {
    if (type === "tenant") return "tenants";
    if (type === "workspace") return "workspaces";
    return "agents";
  };

  const getAllItems = (type: DropdownType) => {
    const map = { tenant: tenants, workspace: workspaces, agent: agents };
    return map[type as keyof typeof map] || [];
  };

  return (
    <>
      <div
        ref={containerRef}
        className="tenant-switcher-demo"
        style={{
          background: "#1a1d27",
          borderRadius: 8,
          border: "1px solid rgba(102,106,115,0.3)",
          padding: "32px 24px",
          minHeight: 120,
          position: "relative",
        }}
      >
        {/* Breadcrumb bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            position: "relative",
          }}
        >
          {/* Home icon */}
          <div style={{ marginRight: 12, opacity: 0.6, flexShrink: 0 }}>
            <HomeIcon />
          </div>

          {/* Divider */}
          <span style={{ color: "#666a73", fontSize: 14, marginRight: 8, flexShrink: 0 }}>/</span>

          {/* Tenant segment */}
          <div style={{ position: "relative" }}>
            <button
              ref={tenantRef}
              onClick={() => handleToggle("tenant")}
              className="switcher-segment"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 10px",
                borderRadius: 4,
                border: "none",
                background: openDropdown === "tenant" ? "rgba(102,106,115,0.15)" : "transparent",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
            >
              <TenantIcon />
              <span className="switcher-label" style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: 13, color: "#f6f6fa", fontWeight: 500, whiteSpace: "nowrap" }}>
                {currentTenant.name}
              </span>
              {openDropdown === "tenant" ? <ChevronUp /> : <ChevronDown />}
            </button>

            <AnimatePresence>
              {openDropdown === "tenant" && (
                <Dropdown
                  type="tenant"
                  items={getItems("tenant")}
                  allItems={getAllItems("tenant")}
                  selectedId={getSelectedId("tenant")}
                  searchQuery={searchQuery}
                  onSearch={setSearchQuery}
                  onSelect={(id) => handleSelect("tenant", id)}
                  getIcon={getIcon}
                  label={getLabel("tenant")}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <span style={{ color: "#666a73", fontSize: 14, margin: "0 4px", flexShrink: 0 }}>/</span>

          {/* Workspace segment */}
          <div style={{ position: "relative" }}>
            <button
              ref={workspaceRef}
              onClick={() => handleToggle("workspace")}
              className="switcher-segment"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 10px",
                borderRadius: 4,
                border: "none",
                background: openDropdown === "workspace" ? "rgba(102,106,115,0.15)" : "transparent",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
            >
              <WorkspaceIcon />
              <span className="switcher-label" style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: 13, color: "#f6f6fa", fontWeight: 500, whiteSpace: "nowrap" }}>
                {currentWorkspace.name}
              </span>
              {openDropdown === "workspace" ? <ChevronUp /> : <ChevronDown />}
            </button>

            <AnimatePresence>
              {openDropdown === "workspace" && (
                <Dropdown
                  type="workspace"
                  items={getItems("workspace")}
                  allItems={getAllItems("workspace")}
                  selectedId={getSelectedId("workspace")}
                  searchQuery={searchQuery}
                  onSearch={setSearchQuery}
                  onSelect={(id) => handleSelect("workspace", id)}
                  getIcon={getIcon}
                  label={getLabel("workspace")}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <span style={{ color: "#666a73", fontSize: 14, margin: "0 4px", flexShrink: 0 }}>/</span>

          {/* Agent segment */}
          <div style={{ position: "relative" }}>
            <button
              ref={agentRef}
              onClick={() => handleToggle("agent")}
              className="switcher-segment"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 10px",
                borderRadius: 4,
                border: "none",
                background: openDropdown === "agent" ? "rgba(102,106,115,0.15)" : "transparent",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
            >
              <AgentIcon />
              <span className="switcher-label" style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: 13, color: "#f6f6fa", fontWeight: 500, whiteSpace: "nowrap" }}>
                {currentAgent.name}
              </span>
              {openDropdown === "agent" ? <ChevronUp /> : <ChevronDown />}
            </button>

            <AnimatePresence>
              {openDropdown === "agent" && (
                <Dropdown
                  type="agent"
                  items={getItems("agent")}
                  allItems={getAllItems("agent")}
                  selectedId={getSelectedId("agent")}
                  searchQuery={searchQuery}
                  onSearch={setSearchQuery}
                  onSelect={(id) => handleSelect("agent", id)}
                  getIcon={getIcon}
                  label={getLabel("agent")}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Hint text */}
        <p
          style={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontSize: 11,
            color: "#666a73",
            marginTop: 24,
            textAlign: "center",
          }}
        >
          Click any segment above to switch context
        </p>
      </div>

      <style>{`
        .switcher-segment:hover {
          background: rgba(102,106,115,0.15) !important;
        }
        @media (max-width: 768px) {
          .switcher-label { display: none !important; }
          .tenant-switcher-demo { padding: 24px 16px !important; }
        }
      `}</style>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Dropdown sub-component                                             */
/* ------------------------------------------------------------------ */
function Dropdown({
  type,
  items,
  allItems,
  selectedId,
  searchQuery,
  onSearch,
  onSelect,
  getIcon,
  label,
}: {
  type: DropdownType;
  items: SwitcherItem[];
  allItems: SwitcherItem[];
  selectedId: string;
  searchQuery: string;
  onSearch: (q: string) => void;
  onSelect: (id: string) => void;
  getIcon: (type: DropdownType, size?: number) => React.ReactNode;
  label: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus search on open
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "absolute",
        top: "calc(100% + 4px)",
        left: 0,
        width: 320,
        background: "#1e232d",
        border: "1px solid #666a73",
        borderRadius: 4,
        boxShadow:
          "0px 6px 12px rgba(35,35,47,0.08), 0px 2px 4px rgba(35,35,47,0.06)",
        overflow: "hidden",
        zIndex: 100,
      }}
    >
      {/* Search */}
      <div style={{ padding: "10px 12px", borderBottom: "1px solid #3a3a4a" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            borderRadius: 4,
            border: "1px solid #3a3a4a",
            background: "#161920",
          }}
        >
          <SearchIcon />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={`Search ${label}...`}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "var(--font-outfit), sans-serif",
              fontSize: 14,
              color: "#f6f6fa",
            }}
          />
        </div>
      </div>

      {/* Section label */}
      <div style={{ padding: "10px 14px 6px" }}>
        <p
          style={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontSize: 10,
            fontWeight: 700,
            color: "#666a73",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Recently added
        </p>
      </div>

      {/* Items */}
      <div style={{ maxHeight: 240, overflowY: "auto" }}>
        {items.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "10px 14px",
                border: "none",
                background: isSelected
                  ? "rgba(94,54,188,0.35)"
                  : "transparent",
                cursor: "pointer",
                transition: "background 0.1s",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                if (!isSelected)
                  e.currentTarget.style.background = "rgba(48,52,67,0.5)";
              }}
              onMouseLeave={(e) => {
                if (!isSelected)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              {getIcon(type, 16)}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    fontSize: 14,
                    color: isSelected ? "#f6f6fa" : "#e1e1e6",
                    fontWeight: isSelected ? 600 : 400,
                    lineHeight: 1.4,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.name}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    fontSize: 13,
                    color: isSelected ? "#c4c4cd" : "#919198",
                    lineHeight: 1.4,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
        {items.length === 0 && (
          <p
            style={{
              fontFamily: "var(--font-outfit), sans-serif",
              fontSize: 13,
              color: "#666a73",
              padding: "16px 14px",
              textAlign: "center",
            }}
          >
            No results
          </p>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "8px 14px",
          borderTop: "1px solid #3a3a4a",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontSize: 12,
            color: "#919198",
          }}
        >
          {items.length} of {allItems.length} {label}
        </p>
        <p
          style={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontSize: 11,
            color: "#666a73",
          }}
        >
          Use{" "}
          <span
            style={{
              padding: "1px 4px",
              border: "1px solid #3a3a4a",
              borderRadius: 2,
              fontSize: 10,
            }}
          >
            ↑↓
          </span>{" "}
          to navigate
        </p>
      </div>
    </motion.div>
  );
}
