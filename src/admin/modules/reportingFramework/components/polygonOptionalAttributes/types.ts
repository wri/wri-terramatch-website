import {
  FrameworkKey,
  PolygonAttributeDefinitionDto,
  UpdatePolygonAttributeDefinitionAttributes
} from "@/connections/PolygonAttributeDefinitions";

export type { FrameworkKey };

export type LocalOption = {
  localId: string;
  uuid?: string;
  label: string;
  value?: string;
};

export type LocalAttribute = {
  localId: string;
  uuid?: string;
  key?: string;
  label: string;
  inputType: PolygonAttributeDefinitionDto["inputType"];
  order: number;
  options: LocalOption[];
  isExpanded: boolean;
  hasValues: boolean;
};

export type UpdatePayload = Pick<UpdatePolygonAttributeDefinitionAttributes, "label" | "order" | "options">;
