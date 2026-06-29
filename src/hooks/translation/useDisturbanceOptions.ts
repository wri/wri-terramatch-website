import { useT } from "@transifex/react";
import { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";

import { Option } from "@/types/common";

export const useDisturbanceOptions = (type: "type" | "subtype", formHook?: UseFormReturn, parentFieldName?: string) => {
  const t = useT();

  const DISTURBANCE_TYPE_OPTIONS: Option[] = useMemo(
    () => [
      { title: t("Climatic"), value: "climatic", meta: {} },
      { title: t("Ecological"), value: "ecological", meta: {} },
      { title: t("Manmade"), value: "manmade", meta: {} }
    ],
    [t]
  );

  const DISTURBANCE_SUBTYPE_OPTIONS: Record<string, Option[]> = useMemo(
    () => ({
      climatic: [
        { title: t("Flooding"), value: "flooding", meta: {} },
        { title: t("Landslide Erosion"), value: "landslide-erosion", meta: {} },
        { title: t("Drought"), value: "drought", meta: {} },
        { title: t("Fire"), value: "fire", meta: {} },
        { title: t("Hail"), value: "hail", meta: {} },
        { title: t("Strong Winds"), value: "strong-winds", meta: {} }
      ],
      ecological: [
        { title: t("Pests Disease"), value: "pests-disease", meta: {} },
        { title: t("Poor Soil"), value: "poor-soil", meta: {} },
        { title: t("Invasive Species"), value: "invasive-species", meta: {} }
      ],
      manmade: [
        { title: t("Poaching"), value: "poaching", meta: {} },
        { title: t("Logging"), value: "logging", meta: {} },
        { title: t("Vandalism"), value: "vandalism", meta: {} },
        { title: t("Land Use Change Conflict"), value: "land-use-change-conflict", meta: {} },
        { title: t("Grazing"), value: "grazing", meta: {} },
        { title: t("Mining"), value: "mining", meta: {} },
        { title: t("Lack Community Ownership"), value: "lack-community-ownership", meta: {} },
        { title: t("Cultural Conflict"), value: "cultural-conflict", meta: {} },
        { title: t("Labor Shortage"), value: "labor-shortage", meta: {} },
        { title: t("Inflation"), value: "inflation", meta: {} },
        { title: t("Lack Political Will"), value: "lack-political-will", meta: {} },
        { title: t("Insecurity"), value: "insecurity", meta: {} }
      ]
    }),
    [t]
  );

  if (type === "type") {
    return DISTURBANCE_TYPE_OPTIONS;
  }

  const parentFieldValue = parentFieldName ? formHook?.watch(parentFieldName) : undefined;

  return useMemo(() => {
    if (type === "subtype") {
      if (!parentFieldValue) {
        return [];
      }

      const subtypeValues =
        DISTURBANCE_SUBTYPE_OPTIONS[parentFieldValue as keyof typeof DISTURBANCE_SUBTYPE_OPTIONS] ?? [];
      const mappedOptions = subtypeValues;

      return mappedOptions;
    }

    return [];
  }, [type, parentFieldValue, DISTURBANCE_SUBTYPE_OPTIONS]);
};
