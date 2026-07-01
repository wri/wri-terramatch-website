import { useT } from "@transifex/react";
import { useMemo } from "react";

import { PolygonDataSubmissionOption } from "@/constants/polygonHandoff";

export const usePolygonSubmissionStatusLabels = () => {
  const t = useT();

  return useMemo(
    (): Record<PolygonDataSubmissionOption, string> => ({
      "no-polygons-submitted": t("No polygons submitted"),
      "not-applicable": t("Not applicable"),
      "polygons-partially-submitted": t("Polygons partially submitted"),
      "all-polygons-received": t("All polygons submitted")
    }),
    [t]
  );
};
