import { useT } from "@transifex/react";
import { useMemo } from "react";

import {
  POLYGON_APPROVED,
  POLYGON_DRAFT,
  POLYGON_INFORMATION_REQUIRED,
  POLYGON_PENDING_APPROVAL
} from "@/constants/polygonStatuses";
import { PolygonSubmissionStatus } from "@/pages/site/[uuid]/components/polygonFilter.constants";

export const useSubmissionStatusOptions = () => {
  const t = useT();

  return useMemo(
    (): { value: PolygonSubmissionStatus; label: string }[] => [
      { value: POLYGON_DRAFT, label: t("Draft") },
      { value: POLYGON_PENDING_APPROVAL, label: t("Pending Approval") },
      { value: POLYGON_INFORMATION_REQUIRED, label: t("Information Required") },
      { value: POLYGON_APPROVED, label: t("Approved") }
    ],
    [t]
  );
};
