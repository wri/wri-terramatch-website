import { useT } from "@transifex/react";
import { useMemo } from "react";

import { restorationStrategyType } from "@/constants/polygons";

export const useRestorationPracticeOptions = () => {
  const t = useT();

  return useMemo(
    (): { value: restorationStrategyType; label: string }[] => [
      { value: "tree-planting", label: t("Tree Planting") },
      { value: "direct-seeding", label: t("Direct Seeding") },
      { value: "assisted-natural-regeneration", label: t("Assisted Natural Regeneration") }
    ],
    [t]
  );
};
