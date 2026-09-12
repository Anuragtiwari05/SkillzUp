"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import type { RoadmapNode } from "@/data/roadmaps/types";

function AccordionItem({ node, depth = 0 }: { node: RoadmapNode; depth?: number }) {
  const [open, setOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className={depth > 0 ? "ml-4 sm:ml-6 border-l border-surface-border pl-4" : ""}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 py-3 text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 ${
              node.category === "core" ? "bg-primary-500" : "bg-transparent border border-primary-400"
            }`}
          />
          <span className="font-semibold text-neutral-900 truncate">{node.title}</span>
          {node.category === "optional" && (
            <span className="text-[10px] uppercase font-bold text-neutral-500 flex-shrink-0">Optional</span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-neutral-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="pb-4 pl-5">
          <p className="text-sm text-neutral-600 leading-relaxed mb-3">{node.description}</p>

          {node.resources && node.resources.length > 0 && (
            <ul className="space-y-1.5 mb-3">
              {node.resources.map((res) => (
                <li key={res.url}>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary-700 hover:text-primary-800"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {res.title}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {hasChildren && (
            <div>
              {node.children!.map((child) => (
                <AccordionItem key={child.id} node={child} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function RoadmapAccordion({ nodes }: { nodes: RoadmapNode[] }) {
  return (
    <div className="bg-surface border border-surface-border rounded-2xl p-4 sm:p-6 divide-y divide-surface-border shadow-[var(--shadow-card)]">
      {nodes.map((node) => (
        <AccordionItem key={node.id} node={node} />
      ))}
    </div>
  );
}
