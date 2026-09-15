import type { AttributeChangesDto } from "@/generated/v3/researchService/researchServiceSchemas";

import type { CustomAttributeFormValues, PolygonAttributeDefinitionDto } from "./types";

export const selectActiveCustomAttributeDefinitions = (
  definitions: PolygonAttributeDefinitionDto[] | undefined
): PolygonAttributeDefinitionDto[] =>
  (definitions ?? [])
    .filter(definition => definition.isActive)
    .slice()
    .sort((left, right) => left.order - right.order);

export const normalizeCustomAttributeValue = (value: unknown): string[] => {
  if (value == null) return [];
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  if (typeof value === "string") return value === "" ? [] : [value];
  return [];
};

export const buildCustomAttributeFormValues = (
  definitions: PolygonAttributeDefinitionDto[],
  storedValues: Record<string, unknown> | null | undefined
): CustomAttributeFormValues => {
  const values: CustomAttributeFormValues = {};
  for (const definition of definitions) {
    values[definition.key] = normalizeCustomAttributeValue(storedValues?.[definition.key]);
  }
  return values;
};

const areValueArraysEqual = (left: string[], right: string[]): boolean => {
  if (left.length !== right.length) return false;
  const sortedLeft = [...left].sort();
  const sortedRight = [...right].sort();
  return sortedLeft.every((value, index) => value === sortedRight[index]);
};

export const areCustomAttributeRecordsEqual = (
  left: Record<string, unknown> | null | undefined,
  right: Record<string, unknown> | null | undefined
): boolean => {
  const keys = new Set([...Object.keys(left ?? {}), ...Object.keys(right ?? {})]);
  for (const key of keys) {
    if (!areValueArraysEqual(normalizeCustomAttributeValue(left?.[key]), normalizeCustomAttributeValue(right?.[key]))) {
      return false;
    }
  }
  return true;
};

export const buildCustomAttributesChangePayload = (
  definitions: PolygonAttributeDefinitionDto[],
  values: CustomAttributeFormValues
): NonNullable<AttributeChangesDto["customAttributes"]> => {
  const payload: NonNullable<AttributeChangesDto["customAttributes"]> = {};
  for (const definition of definitions) {
    const value = values[definition.key] ?? [];
    payload[definition.key] = definition.inputType === "single_select" ? value[0] ?? null : value;
  }
  return payload;
};
