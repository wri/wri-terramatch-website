import { useT } from "@transifex/react";

import { Option } from "@/types/common";

export const getStakeholderKeyRoleOptions = (t: typeof useT = (t: string) => t): Option[] => [
  { title: t("Authorities"), value: "authorities" },
  { title: t("Owners"), value: "owners" },
  { title: t("Stewards"), value: "stewards" },
  { title: t("Resource users"), value: "resource-users" },
  { title: t("Negatively affected people"), value: "negatively-affected-people" }
];
