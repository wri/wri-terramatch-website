import { useT } from "@transifex/react";

import { Option } from "@/types/common";

export const getLanguageOptions = (t: typeof useT = (t: string) => t): Option[] => [
  { title: t("English"), value: "english" },
  { title: t("French"), value: "french" },
  { title: t("Spanish"), value: "spanish" },
  { title: t("Portuguese"), value: "portuguese" },
  { title: t("Other"), value: "other" }
];
