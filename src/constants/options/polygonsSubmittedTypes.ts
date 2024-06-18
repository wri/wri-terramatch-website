import { useT } from "@transifex/react";

import { Option } from "@/types/common";

export const getPolygonsSubmittedTypes = (t: typeof useT = (t: string) => t): Option[] => [
  {
    value: "Draft",
    title: t("Draft"),
    meta: {}
  },
  {
    value: "Submitted",
    title: t("Submitted"),
    meta: {}
  },
  {
    value: "Needs more information",
    title: t("Needs info"),
    meta: {}
  },
  {
    value: "Approved",
    title: t("Approved"),
    meta: {}
  }
];
