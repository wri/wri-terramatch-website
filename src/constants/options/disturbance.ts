import { useT } from "@transifex/react";

import { Option } from "@/types/common";

export const getDisturbanceTypeOptions = (t: typeof useT = (t: string) => t): Option[] => [
  {
    title: t("Ecological"),
    value: "ecological"
  },
  {
    title: t("Climatic"),
    value: "climatic"
  },
  {
    title: t("Man-made"),
    value: "manmade"
  }
];

export const getDisturbanceIntensityOptions = (t: typeof useT = (t: string) => t): Option[] => [
  {
    title: t("High"),
    value: "high"
  },
  {
    title: t("Medium"),
    value: "medium"
  },
  {
    title: t("Low"),
    value: "low"
  }
];

export const getDisturbanceExtentOptions = (t: typeof useT = (t: string) => t): Option[] => [
  {
    title: t("0 - 20%"),
    value: "0-20"
  },
  {
    title: t("21 - 40%"),
    value: "21-40"
  },
  {
    title: t("41 - 60%"),
    value: "41-60"
  },
  {
    title: t("61 - 80%"),
    value: "61-80"
  },
  {
    title: t("81 - 100%"),
    value: "81-100"
  }
];
