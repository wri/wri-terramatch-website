import { useT } from "@transifex/react";
import { useMemo } from "react";

import { restorationStrategyType } from "@/constants/polygons";

export const useRestorationPracticeLabels = () => {
  const t = useT();

  return useMemo(
    (): Record<restorationStrategyType, string> => ({
      "tree-planting": t("Tree Planting"),
      "sapling-planting": t("Sapling Planting"),
      "assisted-natural-regeneration": t("Assisted Natural Regeneration"),
      "direct-seeding": t("Direct Seeding")
    }),
    [t]
  );
};
