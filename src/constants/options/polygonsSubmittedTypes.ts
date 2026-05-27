import { useT } from "@transifex/react";

import {
  POLYGON_APPROVED,
  POLYGON_DRAFT,
  POLYGON_INFORMATION_REQUIRED,
  POLYGON_PENDING_APPROVAL
} from "@/constants/polygonStatuses";
import { Option } from "@/types/common";

export const getPolygonsSubmittedTypes = (t: typeof useT = (t: string) => t): Option[] => [
  {
    value: POLYGON_DRAFT,
    title: t("Draft"),
    meta: {}
  },
  {
    value: POLYGON_PENDING_APPROVAL,
    title: t("Pending Approval"),
    meta: {}
  },
  {
    value: POLYGON_INFORMATION_REQUIRED,
    title: t("Information Required"),
    meta: {}
  },
  {
    value: POLYGON_APPROVED,
    title: t("Approved"),
    meta: {}
  }
];
