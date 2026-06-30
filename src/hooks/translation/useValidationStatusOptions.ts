import { useT } from "@transifex/react";
import { useMemo } from "react";

import { PolygonValidationStatus } from "@/pages/site/[uuid]/components/polygonFilter.constants";

export const useValidationStatusOptions = () => {
  const t = useT();

  return useMemo(
    (): { value: PolygonValidationStatus; label: string }[] => [
      { value: "not_checked", label: t("Not Started") },
      { value: "failed", label: t("Failed") },
      { value: "partial", label: t("Partially Passed") },
      { value: "passed", label: t("Passed") }
    ],
    [t]
  );
};
