import type { NurseryLightDto, ProjectLightDto } from "@/generated/v3/entityService/entityServiceSchemas";

export type NurseryIndexRow = NurseryLightDto & {
  id: string;
  projectUuid: string | null;
  projectFrameworkKey: string | null;
};

export type NurseryIndexProjectSection = {
  id: string;
  projectUuid: string | null;
  projectName: string;
  organisationName: string | null;
  frameworkKey: string | null;
  nurseries: NurseryIndexRow[];
};

export type NurseryIndexData = {
  projects: ProjectLightDto[];
  sections: NurseryIndexProjectSection[];
  loading: boolean;
  error: boolean;
};
