import { useT } from "@transifex/react";
import { useMemo } from "react";

export const useDisturbancePropertyAffectedOptions = () => {
  const t = useT();

  return useMemo(
    () => [
      { value: "tree-seedlings", title: t("Tree Seedlings") },
      { value: "nursery-structure", title: t("Nursery Structure") },
      { value: "trees", title: t("Trees") },
      { value: "nursery-saplings", title: t("Nursery Saplings") },
      { value: "animals", title: t("Animals") }
    ],
    [t]
  );
};
