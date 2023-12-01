import { useT } from "@transifex/react";

import { Option } from "@/types/common";

export const getLandTenureOptions = (t: typeof useT = (t: string) => t): Option[] => [
  {
    value: "public",
    title: t("Public"),
    meta: {
      image_url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/images/V2/land-tenures/public.png`
    }
  },
  {
    value: "private",
    title: t("Private"),
    meta: {
      image_url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/images/V2/land-tenures/private.png`
    }
  },
  {
    value: "indigenous",
    title: t("Indigenous"),
    meta: {
      image_url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/images/V2/land-tenures/indigenous.png`
    }
  },
  {
    value: "communal",
    title: t("Communal"),
    meta: {
      image_url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/images/V2/land-tenures/communal.png`
    }
  },
  {
    value: "national-protected-area",
    title: t("National Protected Area"),
    meta: {
      image_url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/images/V2/land-tenures/national-protected-area.png`
    }
  },
  {
    value: "other",
    title: t("Other"),
    meta: {
      image_url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/images/V2/land-tenures/other.png`
    }
  }
];
