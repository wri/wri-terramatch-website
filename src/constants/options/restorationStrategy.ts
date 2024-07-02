import { useT } from "@transifex/react";

import { Option } from "@/types/common";

export const getRestorationStrategyOptions = (t: typeof useT = (t: string) => t): Option[] => [
  {
    value: "assisted-natural-regeneration",
    title: t("Assisted Natural Regeneration")
  },
  {
    value: "direct-seeding",
    title: t("Direct Seeding")
  },
  { value: "tree-planting", title: t("Tree Planting") },
  {
    value: "non-tree-based-intervention",
    title: t("Non-Tree based Intervention")
  }
];
