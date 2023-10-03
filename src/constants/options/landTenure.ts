import { useT } from "@transifex/react";

import { Option } from "@/types/common";

export const getLandTenureOptions = (t: typeof useT = (t: string) => t): Option[] => [
  {
    value: "public",
    title: t("Public"),
    meta: {
      image_url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/images/V2/land-tenures/public@2x.png`
    }
  },
  {
    value: "private",
    title: t("Private"),
    meta: {
      image_url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/images/V2/land-tenures/private@2x.png`
    }
  },
  {
    value: "indigenous",
    title: t("Indigenous"),
    meta: {
      image_url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/images/V2/land-tenures/indigenous@2x.png`
    }
  },
  {
    value: "communal",
    title: t("Communal"),
    meta: {
      image_url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/images/V2/land-tenures/communal@2x.png`
    }
  },
  {
    value: "national_protected_area",
    title: t("National Protected Area"),
    meta: {
      image_url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/images/V2/land-tenures/national_protected_area@2x.png`
    }
  },
  {
    value: "other",
    title: t("Other"),
    meta: {
      image_url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/images/V2/land-tenures/other@2x.png`
    }
  }
];
