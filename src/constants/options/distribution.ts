import { useT } from "@transifex/react";

import { Option } from "@/types/common";

export const getDistributionOptions = (t: typeof useT = (t: string) => t): Option[] => [
  { title: t("Partial"), value: "partial" },
  { title: t("Whole"), value: "whole" },
  { title: t("Single Line"), value: "single-line" }
];
