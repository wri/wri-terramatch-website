import { useT } from "@transifex/react";

import { Option } from "@/types/common";

export const getGenderOptions = (t: typeof useT = (t: string) => t): Option[] => [
  {
    title: t("Male"),
    value: "male"
  },
  {
    title: t("Female"),
    value: "female"
  },
  {
    title: t("Non-binary"),
    value: "non-binary"
  }
];

export const getGenderOptionsWithUndefined = (t: typeof useT = (t: string) => t): Option[] => [
  {
    title: t("Male"),
    value: "male"
  },
  {
    title: t("Female"),
    value: "female"
  },
  {
    title: t("Gender Undefined"),
    value: "gender-undefined"
  }
];
