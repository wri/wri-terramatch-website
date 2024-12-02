import { useT } from "@transifex/react";

import { apiBaseUrl } from "@/constants/environment";
import { Option } from "@/types/common";

//Images to be updated when provided
export const getRestorationInterventionTypeOptions = (t: typeof useT = (t: string) => t): Option[] => [
  {
    value: "agroforestry",
    title: t("Agroforestry"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/restoration-methods/agroforestry@2x.png`
    }
  },
  {
    value: "applied-nucleation",
    title: t("Applied Nucleation"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/restoration-methods/applied_nucleation_tree_island@2x.png`
    }
  },
  {
    value: "assisted-natural-regeneration",
    title: t("Assisted Natural Regeneration"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/restoration-methods/assisted_natural@2x.png`
    }
  },
  {
    value: "direct-seeding",
    title: t("Direct Seeding"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/restoration-methods/direct_seeding@2x.png`
    }
  },
  {
    value: "enrichment-planting",
    title: t("Enrichment Planting"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/restoration-methods/enrichment_planting@2x.png`
    }
  },
  {
    value: "mangrove-restoration",
    title: t("Mangrove Restoration"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/restoration-methods/mangrove@2x.png`
    }
  },
  {
    value: "reforestation",
    title: t("Reforestation"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/restoration-methods/reforestation@2x.png`
    }
  },
  {
    value: "riparian-restoration",
    title: t("Riparian Restoration"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/restoration-methods/riparian@2x.png`
    }
  },
  {
    value: "silvopasture",
    title: t("Silvopasture"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/restoration-methods/silvopasture@2x.png`
    }
  }
];
