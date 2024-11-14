import { useT } from "@transifex/react";

import { apiBaseUrl } from "@/constants/environment";
import { Option } from "@/types/common";

export const sustainableDevelopmentGoalsOptions = (t: typeof useT = (t: string) => t): Option[] => [
  {
    value: "no-poverty",
    title: t("No Poverty"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/sustainable-development-goals/no_poverty@2x.png`
    }
  },
  {
    value: "zero-hunger",
    title: t("Zero Hunger"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/sustainable-development-goals/zero_hunger@2x.png`
    }
  },
  {
    value: "good-health-and-well-being",
    title: t("Good Health and Well-being"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/sustainable-development-goals/good-health-and-well-being@2x.png`
    }
  },
  {
    value: "quality-education",
    title: t("Quality Education"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/sustainable-development-goals/quality-education@2x.png`
    }
  },
  {
    value: "gender-equality",
    title: t("Gender Equality"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/sustainable-development-goals/gender-equality@2x.png`
    }
  },
  {
    value: "clean-water-and-sanitation",
    title: t("Clean Water and Sanitation"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/sustainable-development-goals/clean-water-and-sanitation@2x.png`
    }
  },
  {
    value: "affordable-and-clean-energy",
    title: t("Affordable and Clean Energy"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/sustainable-development-goals/affordable-and-clean-energy@2x.png`
    }
  },
  {
    value: "decent-work-and-economic-growth",
    title: t("Decent Work and Economic Growth"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/sustainable-development-goals/decent-work-and-economic-growth@2x.png`
    }
  },
  {
    value: "industry-innovation-and-infrastructure",
    title: t("Industry, Innovation, and Infrastructure"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/sustainable-development-goals/industry-innovation-and-infrastructure@2x.png`
    }
  },
  {
    value: "reduced-inequalities",
    title: t("Reduced Inequalities"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/sustainable-development-goals/reduced-inequalities@2x.png`
    }
  },
  {
    value: "sustainable-cities-and-communities",
    title: t("Sustainable Cities and Communities"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/sustainable-development-goals/sustainable-cities-and-communities@2x.png`
    }
  },
  {
    value: "responsible-consumption-and-production",
    title: t("Responsible Consumption and Production"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/sustainable-development-goals/responsible-consumption-and-production@2x.png`
    }
  },
  {
    value: "climate-action",
    title: t("Climate Action"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/sustainable-development-goals/climate-action@2x.png`
    }
  },
  {
    value: "life-below-water",
    title: t("Life Below Water"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/sustainable-development-goals/life-below-water@2x.png`
    }
  },
  {
    value: "life-on-land",
    title: t("Life on Land"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/sustainable-development-goals/life-on-land@2x.png`
    }
  },
  {
    value: "peace-justice-and-strong-institutions",
    title: t("Peace, Justice, and Strong Institutions"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/sustainable-development-goals/peace-justice-and-strong-institutions@2x.png`
    }
  },
  {
    value: "partnerships-for-the-goals",
    title: t("Partnerships for the Goals"),
    meta: {
      image_url: `${apiBaseUrl}/images/V2/sustainable-development-goals/partnerships-for-the-goals@2x.png`
    }
  }
];
