import { useT } from "@transifex/react";

import { Option } from "@/types/common";

export const getFarmersEngagementStrategyOptions = (t: typeof useT = (t: string) => t): Option[] => [
  {
    value: "we-provide-paid-jobs-for-farmers",
    title: t("We provide paid jobs for farmers")
  },
  {
    value: "we-directly-engage-benefit-farmers",
    title: t("We directly engage & benefit farmers")
  },
  {
    value: "we-provide-indirect-benefits-to-farmers",
    title: t("We provide indirect benefits to farmers")
  },
  {
    value: "we-do-not-engage-with-farmers",
    title: t("We do not engage with farmers")
  }
];

export const getWomenEngagementStrategyOptions = (t: typeof useT = (t: string) => t): Option[] => [
  {
    value: "we-provide-paid-jobs-for-women",
    title: t("We provide paid jobs for women")
  },
  {
    value: "we-directly-engage-benefit-women",
    title: t("We directly engage & benefit women")
  },
  {
    value: "we-provide-indirect-benefits-to-women",
    title: t("We provide indirect benefits to women")
  },
  {
    value: "we-do-not-engage-with-women",
    title: t("We do not engage with women")
  }
];

export const getYoungerThan35EngagementStrategyOptions = (t: typeof useT = (t: string) => t): Option[] => [
  {
    value: "we-provide-paid-jobs-for-people-younger-than-35",
    title: t("We provide paid jobs for people younger than 35")
  },
  {
    value: "we-directly-engage-benefit-people-younger-than-35",
    title: t("We directly engage & benefit people younger than 35")
  },
  {
    value: "we-provide-indirect-benefits-to-people-younger-than-35",
    title: t("We provide indirect benefits to people younger than 35")
  },
  {
    value: "we-do-not-engage-with-people-younger-than-35",
    title: t("We do not engage with people younger than 35")
  }
];
