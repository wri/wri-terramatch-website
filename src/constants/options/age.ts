import { useT } from "@transifex/react";

import { Option } from "@/types/common";

export const getAgeOptions = (t: typeof useT = (t: string) => t): Option[] => [
  {
    title: t("Youth (15-24)"),
    value: "youth"
  },
  {
    title: t("Adult (24-65)"),
    value: "adult"
  },
  {
    title: t("Elder (65+)"),
    value: "elder"
  },
  {
    title: t("Age Undefined"),
    value: "age-undefined"
  }
];
