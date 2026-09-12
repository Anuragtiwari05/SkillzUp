export interface RoadmapResource {
  title: string;
  url: string;
}

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  category: "core" | "optional";
  children?: RoadmapNode[];
  resources?: RoadmapResource[];
}

export interface RoadmapData {
  slug: string;
  title: string;
  description: string;
  group: "role" | "skill";
  icon: string; // lucide-react icon name, resolved by the page
  nodes: RoadmapNode[];
}

export function countTopics(nodes: RoadmapNode[]): number {
  return nodes.reduce(
    (total, node) => total + 1 + (node.children ? countTopics(node.children) : 0),
    0
  );
}
