import { useT } from "@transifex/react";

import { Option } from "@/types/common";

export const getRestorationInterventionTypeOptions = (t: typeof useT = (t: string) => t): Option[] => [
  {
    value: "agroforestry",
    title: t("Agroforestry"),
    meta: {
      image_url: "/imges/options/restoration-methods/agroforestry@2x.png"
    }
  },
  {
    value: "applied-nucleation",
    title: t("Applied Nucleation"),
    meta: {
      image_url: "/imges/options/restoration-methods/applied_nucleation_tree_island@2x.png"
    }
  },
  {
    value: "assisted-natural-regeneration",
    title: t("Assisted Natural Regeneration"),
    meta: {
      image_url: "/imges/options/restoration-methods/assisted_natural@2x.png"
    }
  },
  {
    value: "direct-seeding",
    title: t("Direct Seeding"),
    meta: {
      image_url: "/imges/options/restoration-methods/direct_seeding@2x.png"
    }
  },
  {
    value: "enrichment-planting",
    title: t("Enrichment Planting"),
    meta: {
      image_url: "/imges/options/restoration-methods/enrichment_planting@2x.png"
    }
  },
  {
    value: "mangrove-restoration",
    title: t("Mangrove Restoration"),
    meta: {
      image_url: "/imges/options/restoration-methods/mangrove@2x.png"
    }
  },
  {
    value: "reforestation",
    title: t("Reforestation"),
    meta: {
      image_url: "/imges/options/restoration-methods/reforestation@2x.png"
    }
  },
  {
    value: "riparian-restoration",
    title: t("Riparian Restoration"),
    meta: {
      image_url: "/imges/options/restoration-methods/riparian@2x.png"
    }
  },
  {
    value: "silvopasture",
    title: t("Silvopasture"),
    meta: {
      image_url: "/imges/options/restoration-methods/silvopasture@2x.png"
    }
  }
];
