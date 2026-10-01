"use client";

import { useMemo, useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import type { RoadmapNode } from "@/data/roadmaps/types";

const NODE_WIDTH = 200;
const H_SPACING = 230;
const V_SPACING = 120;

interface LaidOutNode {
  node: RoadmapNode;
  parentId: string | null;
  depth: number;
  x: number;
}

// Simple recursive tree layout: each leaf takes one "slot"; a parent is
// centered above its children's slots. Produces a clean top-to-bottom tree
// without needing a full layout library.
function layoutTree(nodes: RoadmapNode[]): LaidOutNode[] {
  const result: LaidOutNode[] = [];
  let cursor = 0;

  function visit(node: RoadmapNode, parentId: string | null, depth: number): number {
    if (!node.children || node.children.length === 0) {
      const x = cursor;
      cursor += 1;
      result.push({ node, parentId, depth, x });
      return x;
    }

    const childXs = node.children.map((child) => visit(child, node.id, depth + 1));
    const x = childXs.reduce((a, b) => a + b, 0) / childXs.length;
    result.push({ node, parentId, depth, x });
    return x;
  }

  nodes.forEach((n) => visit(n, null, 0));
  return result;
}

function TopicNode({ data }: NodeProps<{ label: string; category: "core" | "optional" }>) {
  const isCore = data.category === "core";
  return (
    <div
      className={`px-4 py-2.5 rounded-xl text-sm font-semibold text-center min-w-[160px] transition-transform hover:scale-[1.03] cursor-pointer ${
        isCore
          ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
          : "bg-surface text-link border-2 border-dashed border-primary"
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-primary/85 !border-0" />
      {data.label}
      <Handle type="source" position={Position.Bottom} className="!bg-primary/85 !border-0" />
    </div>
  );
}

const nodeTypes = { topic: TopicNode };

export default function RoadmapFlow({ nodes: treeNodes }: { nodes: RoadmapNode[] }) {
  const [selected, setSelected] = useState<RoadmapNode | null>(null);

  const { flowNodes, flowEdges, nodeById } = useMemo(() => {
    const laidOut = layoutTree(treeNodes);
    const byId = new Map<string, RoadmapNode>();

    const rfNodes: Node[] = laidOut.map((item) => {
      byId.set(item.node.id, item.node);
      return {
        id: item.node.id,
        type: "topic",
        position: { x: item.x * H_SPACING, y: item.depth * V_SPACING },
        data: { label: item.node.title, category: item.node.category },
        style: { width: NODE_WIDTH },
      };
    });

    const rfEdges: Edge[] = laidOut
      .filter((item) => item.parentId)
      .map((item) => ({
        id: `${item.parentId}-${item.node.id}`,
        source: item.parentId as string,
        target: item.node.id,
        animated: item.node.category === "optional",
        style: {
          stroke: item.node.category === "optional" ? "var(--muted-foreground)" : "var(--link)",
          strokeDasharray: item.node.category === "optional" ? "5 5" : undefined,
          strokeWidth: 2,
        },
      }));

    return { flowNodes: rfNodes, flowEdges: rfEdges, nodeById: byId };
  }, [treeNodes]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const raw = nodeById.get(node.id);
      if (raw) setSelected(raw);
    },
    [nodeById]
  );

  return (
    <div className="relative">
      <div className="h-[480px] sm:h-[560px] rounded-2xl overflow-hidden border border-border bg-surface-elevated">
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          fitView
          fitViewOptions={{ padding: 0.15, maxZoom: 1 }}
          proOptions={{ hideAttribution: true }}
          minZoom={0.2}
        >
          <Background color="var(--border)" gap={20} />
          <Controls className="!bg-surface !border-border !shadow-[var(--shadow-card)] [&_button]:!border-border [&_button]:!bg-surface [&_button]:!text-foreground [&_button_svg]:!fill-current" />
          <MiniMap className="!bg-surface" maskColor="var(--scrim)" nodeColor="var(--primary)" />
        </ReactFlow>
      </div>

      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 bg-scrim z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-surface border-l border-border z-50 p-6 overflow-y-auto"
            >
              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <span
                className={`inline-block text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full mb-4 ${
                  selected.category === "core"
                    ? "bg-primary/15 text-link"
                    : "bg-transparent border border-dashed border-primary text-link"
                }`}
              >
                {selected.category === "core" ? "Core Topic" : "Optional"}
              </span>

              <h3 className="text-xl font-heading font-bold text-foreground mb-3">{selected.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">{selected.description}</p>

              {selected.resources && selected.resources.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-muted-foreground mb-2">Resources</h4>
                  <ul className="space-y-2">
                    {selected.resources.map((res) => (
                      <li key={res.url}>
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-link hover:text-link"
                        >
                          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                          {res.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
