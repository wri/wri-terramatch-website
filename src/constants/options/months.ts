import { useT } from "@transifex/react";

import { Option } from "@/types/common";

export const getMonthOptions = (t: typeof useT = (t: string) => t): Option[] => [
  { title: t("January"), value: 1 },
  { title: t("February"), value: 2 },
  { title: t("March"), value: 3 },
  { title: t("April"), value: 4 },
  { title: t("May"), value: 5 },
  { title: t("June"), value: 6 },
  { title: t("July"), value: 7 },
  { title: t("August"), value: 8 },
  { title: t("September"), value: 9 },
  { title: t("October"), value: 10 },
  { title: t("November"), value: 11 },
  { title: t("December"), value: 12 }
];
