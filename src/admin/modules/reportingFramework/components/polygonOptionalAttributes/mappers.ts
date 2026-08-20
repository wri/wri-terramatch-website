import { camelCase, isEqual } from "lodash";
import { v4 as uuidv4 } from "uuid";

import { isFrameworkKey, PolygonAttributeDefinitionDto } from "@/connections/PolygonAttributeDefinitions";

import { LocalAttribute, LocalOption, UpdatePayload } from "./types";

export { isFrameworkKey };

export const toLocalOption = (dto: PolygonAttributeDefinitionDto["options"][number]): LocalOption => ({
  localId: dto.uuid,
  uuid: dto.uuid,
  label: dto.label,
  value: dto.value
});

export const toLocalAttribute = (dto: PolygonAttributeDefinitionDto): LocalAttribute => ({
  localId: dto.uuid,
  uuid: dto.uuid,
  key: dto.key,
  label: dto.label,
  isRequired: dto.isRequired,
  inputType: dto.inputType,
  order: dto.order,
  options: dto.options.map(toLocalOption),
  isExpanded: false,
  hasValues: dto.hasValues
});

export const emptyAttribute = (order: number): LocalAttribute => ({
  localId: uuidv4(),
  label: "",
  isRequired: false,
  inputType: "single_select",
  order,
  options: [],
  isExpanded: true,
  hasValues: false
});

export const emptyOption = (): LocalOption => ({
  localId: uuidv4(),
  label: ""
});

export const previewKeyFromLabel = (label: string): string => {
  const key = camelCase(label.trim());
  return key === "" ? "Generated from label" : key;
};

export const syncOrder = (attributes: LocalAttribute[]): LocalAttribute[] =>
  attributes.map((attribute, index) => ({ ...attribute, order: index }));

export const buildUpdatePayload = (
  attribute: LocalAttribute,
  original: PolygonAttributeDefinitionDto
): UpdatePayload | null => {
  const payload: UpdatePayload = {};
  if (attribute.label !== original.label) payload.label = attribute.label;
  if (attribute.isRequired !== original.isRequired) payload.isRequired = attribute.isRequired;
  if (attribute.order !== original.order) payload.order = attribute.order;

  const originalOptions = original.options.map(option => ({ uuid: option.uuid, label: option.label }));
  const localOptions = attribute.options.map(option => ({ uuid: option.uuid, label: option.label }));
  if (!isEqual(originalOptions, localOptions)) {
    payload.options = localOptions;
  }

  return Object.keys(payload).length === 0 ? null : payload;
};
