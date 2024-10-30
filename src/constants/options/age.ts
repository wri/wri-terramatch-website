import { useT } from "@transifex/react";

import { Option } from "@/types/common";

export const getAgeOptions = (t: typeof useT = (t: string) => t): Option[] => [
  {
    title: t("Youth (15-29)"),
    value: "youth"
  },
  {
    title: t("Adult (29-64)"),
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
