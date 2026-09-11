import type { NurseryLightDto, ProjectLightDto } from "@/generated/v3/entityService/entityServiceSchemas";

export type NurseryIndexRow = NurseryLightDto & {
  id: string;
  projectUuid: string | null;
  projectFrameworkKey: string | null;
  seedlingGrown?: number | null;
};

export type NurseryIndexMetric = {
  progress: number;
  goal: number;
};

export type NurseryIndexProjectSection = {
  id: string;
  projectUuid: string | null;
  projectName: string;
  organisationName: string | null;
  frameworkKey: string | null;
  seedlingsGrown: NurseryIndexMetric;
  nurseries: NurseryIndexRow[];
};

export type NurseryIndexData = {
  projects: ProjectLightDto[];
  sections: NurseryIndexProjectSection[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
  nurseryTotal: number;
  error: boolean;
};
