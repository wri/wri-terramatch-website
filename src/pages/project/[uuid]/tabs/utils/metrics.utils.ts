import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

export const calculateTreesRestored = (project: ProjectFullDto) =>
  (project.treesPlantedCount ?? 0) + (project.regeneratedTreesCount ?? 0) + (project.seedsPlantedCount ?? 0);

export const calculateHectaresPercentage = (restored: number, goal: number) =>
  goal > 0 ? Math.round((restored / goal) * 100) : undefined;
