import type { NurseryLightDto, ProjectLightDto } from "@/generated/v3/entityService/entityServiceSchemas";

export type NurseryIndexRow = NurseryLightDto & {
  id: string;
  projectUuid: string | null;
  projectFrameworkKey: string | null;
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
  nurseriesLoaded?: boolean;
};

export type NurseryIndexData = {
  projects: ProjectLightDto[];
  sections: NurseryIndexProjectSection[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
  onProjectOpened: (projectId: string) => void;
  nurseryTotal: number;
  error: boolean;
  /** True while a filter is waiting on child rows that have not loaded yet. */
  childrenPending: boolean;
};
