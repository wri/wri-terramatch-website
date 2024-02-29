import { useT } from "@transifex/react";

import { Option } from "@/types/common";

export const getIndigeneityOptions = (t: typeof useT = (t: string) => t): Option[] => [
  {
    title: t("Indigenous"),
    value: "indigenous"
  },
  {
    title: t("Other"),
    value: "other"
  },
  {
    title: t("Unknown"),
    value: "unknown"
  },
  {
    title: t("Decline to Specify"),
    value: "decline to specify"
  }
];

export const getIndigeneityOptionsWithUndefined = (t: typeof useT = (t: string) => t): Option[] => [
  {
    title: t("Indigenous"),
    value: "indigenous"
  },
  {
    title: t("Other"),
    value: "other"
  },
  {
    title: t("Unknown"),
    value: "unknown"
  },
  {
    title: t("Decline to Specify"),
    value: "decline to specify"
  }
];
