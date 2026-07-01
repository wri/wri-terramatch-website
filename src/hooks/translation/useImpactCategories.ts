import { useT } from "@transifex/react";
import { useMemo } from "react";

export interface ImpactCategory {
  title: string;
  value: string;
}

export const useImpactCategories = () => {
  const t = useT();

  return useMemo(
    (): ImpactCategory[] => [
      { title: t("Business development/fundraising"), value: "business-dev-fund" },
      { title: t("Community benefits"), value: "community-benefits" },
      { title: t("Livelihoods strengthening"), value: "livelihoods-strengthening" },
      { title: t("Gender equity"), value: "gender-equity" },
      { title: t("Youth engagement"), value: "youth-engagement" },
      { title: t("Ecosystem services"), value: "ecosystem-services" },
      { title: t("Climate resilience"), value: "climate-resilience" },
      { title: t("Institutional capacity"), value: "institutional-capacity" },
      { title: t("Technical capacity"), value: "technical-capacity" }
    ],
    [t]
  );
};
