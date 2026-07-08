import { useT } from "@transifex/react";
import { useMemo } from "react";

export type TreeDistributionType = "single-line" | "partial" | "full";

export const useTreeDistributionOptions = () => {
  const t = useT();

  return useMemo(
    (): { value: TreeDistributionType; label: string }[] => [
      { value: "single-line", label: t("Single Line") },
      { value: "partial", label: t("Partial") },
      { value: "full", label: t("Full Coverage") }
    ],
    [t]
  );
};
