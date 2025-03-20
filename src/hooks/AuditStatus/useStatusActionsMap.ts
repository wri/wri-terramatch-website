import { useT } from "@transifex/react";
import { useMemo } from "react";

import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import { ENTITY_REPORT, NURSERY, POLYGON, PROJECT, SITE } from "@/constants/entities";
import { fetchPutV2ENTITYUUIDStatus } from "@/generated/apiComponents";
import {
  getValueForStatusEntityReport,
  getValueForStatusNursery,
  getValueForStatusPolygon,
  getValueForStatusProject,
  getValueForStatusSite
} from "@/utils/statusUtils";

export const useStatusActionsMap = (reportEntityTypes: number) => {
  const t = useT();

  const ACTIONS_MAP = useMemo(
    () => ({
      [AuditLogButtonStates.PROJECT as number]: {
        mutateEntity: fetchPutV2ENTITYUUIDStatus,
        valuesForStatus: getValueForStatusProject,
        statusLabels: [
          { id: "1", label: t("Started") },
          { id: "2", label: t("Awaiting Approval") },
          { id: "3", label: t("Needs More Information") },
          { id: "4", label: t("Approved") }
        ],
        entityType: PROJECT
      },
      [AuditLogButtonStates.SITE as number]: {
        mutateEntity: fetchPutV2ENTITYUUIDStatus,
        valuesForStatus: getValueForStatusSite,
        statusLabels: [
          { id: "1", label: t("Started") },
          { id: "2", label: t("Awaiting Approval") },
          { id: "3", label: t("Needs More Info") },
          { id: "4", label: t("Restoration in Progress") },
          { id: "5", label: t("Approved") }
        ],
        entityType: SITE
      },
      [AuditLogButtonStates.POLYGON as number]: {
        mutateEntity: fetchPutV2ENTITYUUIDStatus,
        valuesForStatus: getValueForStatusPolygon,
        statusLabels: [
          { id: "1", label: t("Draft") },
          { id: "2", label: t("Submitted") },
          { id: "3", label: t("Needs More Information") },
          { id: "4", label: t("Approved") }
        ],
        entityType: POLYGON
      },
      [AuditLogButtonStates.NURSERY as number]: {
        mutateEntity: fetchPutV2ENTITYUUIDStatus,
        valuesForStatus: getValueForStatusNursery,
        statusLabels: [
          { id: "1", label: t("Started") },
          { id: "2", label: t("Awaiting Approval") },
          { id: "3", label: t("Needs More Information") },
          { id: "4", label: t("Approved") }
        ],
        entityType: NURSERY
      },
      [AuditLogButtonStates.REPORT as number]: {
        mutateEntity: fetchPutV2ENTITYUUIDStatus,
        valuesForStatus: getValueForStatusEntityReport,
        statusLabels: [
          { id: "1", label: t("Due") },
          { id: "2", label: t("Started") },
          { id: "3", label: t("Needs More Information") },
          { id: "4", label: t("Awaiting Approval") },
          { id: "5", label: t("Approved") }
        ],
        entityType: ENTITY_REPORT
      }
    }),
    [t]
  );

  return ACTIONS_MAP[reportEntityTypes];
};
