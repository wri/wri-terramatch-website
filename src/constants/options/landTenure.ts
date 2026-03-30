import { useT } from "@transifex/react";

import { apiBaseUrl } from "@/constants/environment";
import { Option } from "@/types/common";

export const getLandTenureOptions = (t: typeof useT = (t: string) => t): Option[] => [
  {
    value: "public-land",
    title: t("Public"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/land-tenures/public.png`
    }
  },
  {
    value: "private-land",
    title: t("Private"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/land-tenures/private.png`
    }
  },
  {
    value: "indigenous-land",
    title: t("Indigenous"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/land-tenures/indigenous.png`
    }
  },
  {
    value: "communal-land",
    title: t("Communal"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/land-tenures/communal.png`
    }
  },
  {
    value: "national-protected-area",
    title: t("National Protected Area"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/land-tenures/national-protected-area.png`
    }
  },
  {
    value: "other-land",
    title: t("Other"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/land-tenures/other.png`
    }
  }
];

const LAND_TENURE_PROJECT_AREA_LABELS: Record<string, string> = {
  "indigenous-land": "Indigenous Land",
  "extractive-reserve-resex": "Extractive Reserve (RESEX)",
  "sustainable-development-reserve-rds": "Sustainable Development Reserve (RDS)",
  "national-forest-flona": "National Forest (FLONA)",
  "environmental-protection-area-apa": "Environmental Protection Area (APA)",
  "rural-settlements-pae-paex-or-pds": "Rural Settlements (PAE, PAEX, or PDS)",
  "quilombola-land": "Quilombola Land",
  "public-land": "Public Land",
  "private-land": "Private Land",
  "other-land": "Other Land"
};

export const getLandTenureProjectAreaLabel = (slug: string): string => LAND_TENURE_PROJECT_AREA_LABELS[slug] ?? slug;

export const formatLandTenureProjectAreaDisplay = (slugs: string[] | null | undefined): string => {
  if (slugs == null || slugs.length === 0) {
    return "Under Review";
  }

  return slugs.map(getLandTenureProjectAreaLabel).join(", ");
};
