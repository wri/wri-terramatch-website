import { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";

import { Option } from "@/types/common";

const DISTURBANCE_TYPE_OPTIONS: Option[] = [
  { title: "Climatic", value: "climatic", meta: {} },
  { title: "Ecological", value: "ecological", meta: {} },
  { title: "Manmade", value: "manmade", meta: {} }
];

const DISTURBANCE_SUBTYPE_OPTIONS = {
  climatic: ["flooding", "landslide-erosion", "drought", "fire", "heavy-rains", "hail", "strong-winds"],
  ecological: ["pests-disease", "poor-soil", "invasive-species"],
  manmade: [
    "poaching",
    "logging",
    "vandalism",
    "land-use-change-conflict",
    "grazing",
    "mining",
    "lack-community-ownership",
    "cultural-conflict",
    "labor-shortage",
    "inflation",
    "lack-political-will",
    "insecurity"
  ]
};

export const useDisturbanceOptions = (type: "type" | "subtype", formHook?: UseFormReturn, parentFieldName?: string) => {
  if (type === "type") {
    return DISTURBANCE_TYPE_OPTIONS;
  }

  // For subtype, watch the parent field value
  const parentFieldValue = parentFieldName ? formHook?.watch(parentFieldName) : undefined;

  return useMemo(() => {
    if (type === "subtype") {
      if (!parentFieldValue) {
        return [];
      }

      const subtypeValues =
        DISTURBANCE_SUBTYPE_OPTIONS[parentFieldValue as keyof typeof DISTURBANCE_SUBTYPE_OPTIONS] ?? [];
      const mappedOptions = subtypeValues.map(value => ({
        title: value.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
        value: value,
        meta: {}
      })) as Option[];

      return mappedOptions;
    }

    return [];
  }, [type, parentFieldValue]);
};
