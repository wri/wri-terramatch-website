import { useT } from "@transifex/react";
import { useMemo } from "react";

import { targetLandUseType } from "@/constants/polygons";

export const useTargetLandUseOptions = () => {
  const t = useT();

  return useMemo(
    (): { value: targetLandUseType; label: string }[] => [
      { value: "agroforest", label: t("Agroforest") },
      { value: "agricultural-land", label: t("Agricultural Land") },
      { value: "grassland", label: t("Grassland") },
      { value: "open-natural-ecosystem", label: t("Open Natural Ecosystem") },
      { value: "natural-forest", label: t("Natural Forest") },
      { value: "mangrove", label: t("Mangrove") },
      { value: "peatland", label: t("Peatland") },
      { value: "riparian-area-or-wetland", label: t("Riparian Area / Wetland") },
      { value: "silvopasture", label: t("Silvopasture") },
      { value: "urban-forest", label: t("Urban Forest") },
      { value: "woodlot-or-plantation", label: t("Woodlot / Plantation") }
    ],
    [t]
  );
};
