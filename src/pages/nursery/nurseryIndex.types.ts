import type { NurseryLightDto } from "@/generated/v3/entityService/entityServiceSchemas";

export type NurseryIndexRow = NurseryLightDto & {
  id: string;
  projectUuid: string | null;
  projectFrameworkKey: string | null;
};
