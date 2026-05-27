import { useT } from "@transifex/react";

import { Option } from "@/types/common";

export const getProjectCohortOptions = (t: typeof useT | Function = (t: string) => t) =>
  [
    {
      value: "ppc",
      title: t("Priceless Planet Coalition")
    },
    {
      value: "terrafund",
      title: t("TerraFund Top 100")
    },
    {
      value: "terrafund-landscapes",
      title: t("TerraFund Landscapes")
    },
    {
      value: "terrafund-cohort-1",
      title: t("TerraFund Cohort One")
    },
    {
      value: "terrafund-cohort-2",
      title: t("TerraFund Cohort Two")
    },
    {
      value: "terrafund-3",
      title: t("TerraFund Cohort Three")
    },
    {
      value: "hbf",
      title: t("Harit Bharat Fund")
    },
    {
      value: "epa-ghana-pilot",
      title: t("EPA-Ghana Pilot")
    },
    {
      value: "fundo-flora-cohort-1",
      title: t("Fundo Flora Cohort One")
    }
  ] as Option[];
