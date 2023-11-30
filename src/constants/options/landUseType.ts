import { useT } from "@transifex/react";

import { Option } from "@/types/common";

export const getLandUseTypeOptions = (t: typeof useT = (t: string) => t): Option[] => [
  { title: t("Agroforest"), value: "agroforest" },
  { title: t("Mangrove"), value: "mangrove" },
  { title: t("Natural Forest"), value: "natural-forest" },
  { title: t("Silvopasture"), value: "silvopasture" },
  { title: t("Riparian Area or Wetland"), value: "riparian-area-or-wetland" },
  { title: t("Urban Forest"), value: "urban-forest" },
  { title: t("Woodlot or Plantation"), value: "woodlot-or-plantation" }
];
