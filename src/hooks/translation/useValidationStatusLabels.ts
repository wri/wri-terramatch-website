import { useT } from "@transifex/react";
import { useMemo } from "react";

import { PolygonValidationStatus } from "@/pages/site/[uuid]/components/polygonFilter.constants";

export const useValidationStatusLabels = () => {
  const t = useT();

  return useMemo(
    (): Record<PolygonValidationStatus, string> => ({
      not_checked: t("Not Started"),
      failed: t("Failed"),
      partial: t("Partially Passed"),
      passed: t("Passed")
    }),
    [t]
  );
};
