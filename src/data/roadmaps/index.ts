import type { RoadmapData } from "./types";
import frontend from "./frontend";
import python from "./python";
import systemDesign from "./system-design";
import stubs from "./stubs";

export const ROADMAPS: RoadmapData[] = [frontend, python, systemDesign, ...stubs];

export const ROLE_ROADMAPS = ROADMAPS.filter((r) => r.group === "role");
export const SKILL_ROADMAPS = ROADMAPS.filter((r) => r.group === "skill");

export function getRoadmap(slug: string): RoadmapData | undefined {
  return ROADMAPS.find((r) => r.slug === slug);
}

export * from "./types";
