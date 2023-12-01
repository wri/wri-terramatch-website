import { useT } from "@transifex/react";

import { Option } from "@/types/common";

export const getInvasiveTypeOptions = (t: typeof useT = (t: string) => t): Option[] => [
  {
    title: t("Dominant Species"),
    value: "dominant_species"
  },
  {
    title: t("Common"),
    value: "common"
  },
  {
    title: t("Uncommon"),
    value: "uncommon"
  }
];
