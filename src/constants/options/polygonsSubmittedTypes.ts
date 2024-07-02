import { useT } from "@transifex/react";

import { Option } from "@/types/common";

export const getPolygonsSubmittedTypes = (t: typeof useT = (t: string) => t): Option[] => [
  {
    value: "draft",
    title: t("Draft"),
    meta: {}
  },
  {
    value: "submitted",
    title: t("Submitted"),
    meta: {}
  },
  {
    value: "needs-more-information",
    title: t("Needs info"),
    meta: {}
  },
  {
    value: "approved",
    title: t("Approved"),
    meta: {}
  }
];
