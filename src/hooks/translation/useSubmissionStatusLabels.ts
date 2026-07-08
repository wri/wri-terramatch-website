import { useT } from "@transifex/react";
import { useMemo } from "react";

import {
  POLYGON_APPROVED,
  POLYGON_DRAFT,
  POLYGON_INFORMATION_REQUIRED,
  POLYGON_PENDING_APPROVAL
} from "@/constants/polygonStatuses";
import { PolygonSubmissionStatus } from "@/pages/site/[uuid]/components/polygonFilter.constants";

export const useSubmissionStatusLabels = () => {
  const t = useT();

  return useMemo(
    (): Record<PolygonSubmissionStatus, string> => ({
      [POLYGON_DRAFT]: t("Draft"),
      [POLYGON_PENDING_APPROVAL]: t("Pending Approval"),
      [POLYGON_INFORMATION_REQUIRED]: t("Information Required"),
      [POLYGON_APPROVED]: t("Approved")
    }),
    [t]
  );
};
