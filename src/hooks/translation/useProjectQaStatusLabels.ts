import { useT } from "@transifex/react";
import { useMemo } from "react";

import { ProjectQaStatusOption } from "@/constants/polygonHandoff";

export const useProjectQaStatusLabels = () => {
  const t = useT();

  return useMemo(
    (): Record<ProjectQaStatusOption, string> => ({
      due: t("Due"),
      "no-data-submitted": t("No data submitted"),
      "not-applicable": t("Not applicable"),
      "qa-in-progress": t("QA in progress"),
      "qa-completed": t("QA completed")
    }),
    [t]
  );
};

export const useProjectQaStatusFieldLabels = () => {
  const t = useT();

  return useMemo(
    (): Record<1 | 2 | 3 | 4 | 5, string> => ({
      1: t("QA Status (Cycle 1)"),
      2: t("QA Status (Cycle 2)"),
      3: t("QA Status (Cycle 3)"),
      4: t("QA Status (Cycle 4)"),
      5: t("QA Status (Cycle 5)")
    }),
    [t]
  );
};
