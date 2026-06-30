import { useT } from "@transifex/react";
import { useMemo } from "react";

import { targetLandUseType } from "@/constants/polygons";

export const useTargetLandUseLabels = () => {
  const t = useT();

  return useMemo(
    (): Record<targetLandUseType, string> => ({
      agroforest: t("Agroforest"),
      "agricultural-land": t("Agricultural Land"),
      grassland: t("Grassland"),
      mangrove: t("Mangrove"),
      "open-natural-ecosystem": t("Open Natural Ecosystem"),
      "natural-forest": t("Natural Forest"),
      peatland: t("Peatland"),
      "riparian-area-or-wetland": t("Riparian Area / Wetland"),
      silvopasture: t("Silvopasture"),
      "urban-forest": t("Urban Forest"),
      "woodlot-or-plantation": t("Woodlot / Plantation")
    }),
    [t]
  );
};
