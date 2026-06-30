import { useT } from "@transifex/react";
import { useMemo } from "react";

import { ValidationTagState } from "@/redesignComponents/actions/Tags/ValidationTag/ValidationTag";

export const usePolygonValidationTagValues = () => {
  const t = useT();

  return useMemo(
    (): Record<ValidationTagState, string> => ({
      "not-started": t("Not Started"),
      "partially-passed": t("Partially Passed"),
      failed: t("Failed"),
      passed: t("Passed")
    }),
    [t]
  );
};
