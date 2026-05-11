import { useT } from "@transifex/react";
import { useCallback, useEffect, useMemo } from "react";

import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import { AuditStatusEntityType, useAuditStatuses, useCreateAuditStatus } from "@/connections/AuditStatus";
import { bulkUpdateSitePolygonStatus, PolygonStatus, useAllSitePolygons } from "@/connections/SitePolygons";
import { usePolygonValidation } from "@/connections/Validation";
import { PROJECT_POLYGON_HANDOFF_AUDIT_TYPES } from "@/constants/polygonHandoff";
import { AuditStatusDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { isValidCriteriaData } from "@/helpers/polygonValidation";
import ApiSlice from "@/store/apiSlice";
import Log from "@/utils/log";
import {
  getValueForStatusDisturbanceReport,
  getValueForStatusEntityReport,
  getValueForStatusNursery
} from "@/utils/statusUtils";

import useLoadEntityList from "./useLoadEntityList";
import { useStatusActionsMap } from "./useStatusActionsMap";

const ReverseButtonStates2: { [key: number]: string } = {
  0: "project",
  1: "site",
  2: "site-polygon",
  3: "nursery",
  4: "project-reports",
  5: "site-reports",
  6: "nursery-reports",
  7: "disturbance-reports",
  8: "srp-reports",
  9: "financial-reports"
};

interface AuditLogActionsResponse {
  onStatusChange: (status: string, comment: string) => Promise<void>;
  onChangeRequest: (comment: string) => void;
  valuesForStatus: any;
  statusLabels: any;
  entityType: AuditStatusEntityType;
  loadEntityList: () => void;
  entityListItem: any;
  selected: any;
  setSelected: any;
  checkPolygonsSite: boolean | undefined;
  auditLogData: { data: AuditStatusDto[] } | undefined;
  refetch: () => void;
  isLoading: boolean;
  auditData: { entity: string; entityUuid: string };
}

const useAuditLogActions = ({
  record,
  buttonToggle,
  entityLevel,
  isProjectReport,
  useProjectPolygonHandoff = false
}: {
  record: any;
  buttonToggle?: number;
  entityLevel?: number;
  isProjectReport?: boolean;
  useProjectPolygonHandoff?: boolean;
}): AuditLogActionsResponse => {
  const t = useT();
  const isLevelDisturbanceReport = entityLevel === AuditLogButtonStates.DISTURBANCE_REPORT;
  const isLevelSrpReport = entityLevel === AuditLogButtonStates.SRP_REPORT;
  const isLevelFinancialReport = entityLevel === AuditLogButtonStates.FINANCIAL_REPORT;
  const { valuesForStatus, statusLabels } = useStatusActionsMap(buttonToggle!);
  const isProject = buttonToggle === AuditLogButtonStates.PROJECT;
  const isSite = buttonToggle === AuditLogButtonStates.SITE;
  const isNursery = buttonToggle === AuditLogButtonStates.NURSERY;
  const isPolygon = buttonToggle === AuditLogButtonStates.POLYGON;
  const isSiteProject = entityLevel === AuditLogButtonStates.PROJECT;
  const isProjectHandoffAuditMode = useProjectPolygonHandoff && isPolygon && isSiteProject;

  const getV3EntityTypeFromButtonToggle = (toggle: number): AuditStatusEntityType => {
    const mapping: Record<number, AuditStatusEntityType> = {
      [AuditLogButtonStates.PROJECT]: "projects",
      [AuditLogButtonStates.SITE]: "sites",
      [AuditLogButtonStates.POLYGON]: "sitePolygons",
      [AuditLogButtonStates.NURSERY]: "nurseries",
      [AuditLogButtonStates.PROJECT_REPORT]: "projectReports",
      [AuditLogButtonStates.SITE_REPORT]: "siteReports",
      [AuditLogButtonStates.NURSERY_REPORT]: "nurseryReports",
      [AuditLogButtonStates.DISTURBANCE_REPORT]: "disturbanceReports",
      [AuditLogButtonStates.SRP_REPORT]: "srpReports",
      [AuditLogButtonStates.FINANCIAL_REPORT]: "financialReports"
    };
    const mapped = mapping[toggle];
    if (mapped == null) {
      throw new Error(`Unsupported button toggle: ${toggle}. Cannot map to V3 entity.`);
    }
    return mapped;
  };

  const v3EntityType: AuditStatusEntityType = isProjectHandoffAuditMode
    ? "projects"
    : getV3EntityTypeFromButtonToggle(buttonToggle!);
  const { entityListItem, selected, setSelected, loadEntityList } = useLoadEntityList({
    entity: record,
    entityType: v3EntityType,
    buttonToggle,
    entityLevel,
    isProjectReport
  });

  const siteUuid =
    v3EntityType === "sites" && record?.uuid && isSite ? (isSiteProject ? selected?.uuid : record.uuid) : undefined;

  const { data: sitePolygons } = useAllSitePolygons({
    entityName: "sites",
    entityUuid: siteUuid,
    enabled: !!siteUuid && v3EntityType === "sites" && isSite
  });

  const checkPolygons = useMemo<boolean | undefined>(() => {
    if (!siteUuid || !sitePolygons || sitePolygons.length === 0) {
      return undefined;
    }
    return sitePolygons.some(polygon => polygon.isActive && polygon.status !== "approved");
  }, [siteUuid, sitePolygons]);

  const verifyEntity = [
    "project-reports",
    "site-reports",
    "nursery-reports",
    "disturbance-reports",
    "srp-reports",
    "financial-reports",
    "nursery"
  ].some(word => ReverseButtonStates2[entityLevel!].includes(word));

  const polygonValidationData = usePolygonValidation({
    polygonUuid:
      selected?.polygonUuid != null && isPolygon && !verifyEntity && !isProjectHandoffAuditMode
        ? (selected.polygonUuid as string)
        : ""
  });

  const hasInvalidPolygonCriteria = useMemo(() => {
    if (polygonValidationData == null) return false;
    return !isValidCriteriaData(polygonValidationData);
  }, [polygonValidationData]);

  const entityHandlers = (() => {
    if (isLevelSrpReport || isLevelDisturbanceReport) {
      return {
        selectedEntityItem: isProject ? { uuid: record.projectUuid, status: record.projectStatus } : record,
        loadToEntity: () => {},
        ListItemToEntity: [],
        setSelectedToEntity: null,
        checkPolygons: false
      };
    }
    if (isLevelFinancialReport) {
      return {
        selectedEntityItem: record,
        loadToEntity: () => {},
        ListItemToEntity: [],
        setSelectedToEntity: null,
        checkPolygons: false
      };
    }
    if (buttonToggle == AuditLogButtonStates.PROJECT_REPORT) {
      return {
        selectedEntityItem: record,
        loadToEntity: () => {},
        ListItemToEntity: [],
        setSelectedToEntity: null,
        checkPolygons: false
      };
    }
    if (isSiteProject || isProjectReport) {
      if (isProjectHandoffAuditMode) {
        return {
          selectedEntityItem: record,
          loadToEntity: () => {},
          ListItemToEntity: [],
          setSelectedToEntity: null,
          checkPolygons: false
        };
      }
      return {
        selectedEntityItem: isProject ? record : selected,
        loadToEntity: !isProject || isProjectReport ? loadEntityList : () => {},
        ListItemToEntity: !isProject || isProjectReport ? entityListItem : [],
        setSelectedToEntity: !isProject || isProjectReport ? setSelected : null,
        checkPolygons: isSite ? checkPolygons : isPolygon ? hasInvalidPolygonCriteria : false
      };
    } else if (verifyEntity) {
      return {
        selectedEntityItem: record,
        loadToEntity: () => {},
        ListItemToEntity: [],
        setSelectedToEntity: null,
        checkPolygons: false
      };
    } else {
      return {
        selectedEntityItem: isProject ? record.project : isSite || isNursery ? record : selected,
        loadToEntity: !isProject && !isSite ? loadEntityList : () => {},
        ListItemToEntity: !isProject && !isSite ? entityListItem : [],
        setSelectedToEntity: !isProject && !isSite ? setSelected : null,
        checkPolygons: isSite ? checkPolygons : isPolygon ? hasInvalidPolygonCriteria : false
      };
    }
  })();

  const targetUuid = isProjectHandoffAuditMode
    ? record?.uuid
    : buttonToggle == AuditLogButtonStates.PROJECT
    ? record?.projectUuid ?? record.uuid
    : entityHandlers.selectedEntityItem?.uuid;

  const auditStatusHookProps =
    isProjectHandoffAuditMode && record?.uuid != null
      ? {
          entity: "projects" as const,
          uuid: record.uuid,
          types: PROJECT_POLYGON_HANDOFF_AUDIT_TYPES
        }
      : {
          entity: v3EntityType,
          uuid: targetUuid ?? ""
        };

  const [isAuditLogLoaded, auditStatusConnection] = useAuditStatuses(auditStatusHookProps);

  const { data: auditStatusesData, refetch: auditStatusRefetch } = auditStatusConnection;

  const refetch = useCallback(() => auditStatusRefetch?.(), [auditStatusRefetch]);
  const auditLogData = auditStatusesData != null ? { data: auditStatusesData } : undefined;
  const isLoading = !isAuditLogLoaded;

  useEffect(() => {
    refetch();
  }, [buttonToggle, record, entityListItem, refetch, selected, targetUuid, v3EntityType, isProjectHandoffAuditMode]);

  const buttonStates = ReverseButtonStates2[entityLevel!];
  const getValuesStatusEntity = (() => {
    if (buttonStates == "disturbance-reports" || buttonStates == "srp-reports") {
      return {
        getValueForStatus: getValueForStatusDisturbanceReport,
        statusLabels: [
          { id: "1", label: t("Started") },
          { id: "2", label: t("Needs More Information") },
          { id: "3", label: t("Awaiting Approval") },
          { id: "4", label: t("Approved") }
        ]
      };
    } else if (
      buttonStates?.includes("project-reports") ||
      buttonStates?.includes("site-reports") ||
      buttonStates?.includes("nursery-reports")
    ) {
      return {
        getValueForStatus: getValueForStatusEntityReport,
        statusLabels: [
          { id: "1", label: t("Due") },
          { id: "2", label: t("Started") },
          { id: "3", label: t("Needs More Information") },
          { id: "4", label: t("Awaiting Approval") },
          { id: "5", label: t("Approved") }
        ]
      };
    } else if (buttonStates == "Nursery") {
      return {
        getValueForStatus: getValueForStatusNursery,
        statusLabels: [
          { id: "1", label: t("Started") },
          { id: "2", label: t("Awaiting Approval") },
          { id: "3", label: t("Needs More Information") },
          { id: "4", label: t("Approved") }
        ]
      };
    } else {
      return {
        getValueForStatus: valuesForStatus,
        statusLabels: statusLabels
      };
    }
  })();

  const onStatusChange = useCallback(
    async (status: string, comment: string): Promise<void> => {
      if (isProjectHandoffAuditMode) {
        return;
      }
      const uuid = targetUuid;
      if (uuid == null) {
        Log.error("Cannot update polygon status: target UUID is missing", { v3EntityType, buttonToggle });
        return;
      }

      await bulkUpdateSitePolygonStatus([uuid], status as PolygonStatus, comment);
      ApiSlice.pruneCache("auditStatuses");
    },
    [targetUuid, v3EntityType, buttonToggle, isProjectHandoffAuditMode]
  );

  const handleChangeRequestSuccess = useCallback(() => {
    ApiSlice.pruneCache("auditStatuses");
    refetch();
  }, [refetch]);

  const { create: createChangeRequest } = useCreateAuditStatus(
    isProjectHandoffAuditMode
      ? { entity: "projects", uuid: record?.uuid ?? "" }
      : { entity: v3EntityType, uuid: targetUuid ?? "" },
    handleChangeRequestSuccess,
    "Failed to create change request. Please try again."
  );

  const onChangeRequest = useCallback(
    (comment: string): void => {
      if (targetUuid == null) {
        Log.error("Cannot create change request: target UUID is missing", { v3EntityType, buttonToggle });
        return;
      }

      createChangeRequest({
        type: "change-request",
        comment,
        isActive: true,
        requestRemoved: false
      });
    },
    [targetUuid, v3EntityType, buttonToggle, createChangeRequest]
  );

  return {
    onStatusChange,
    onChangeRequest,
    valuesForStatus: getValuesStatusEntity.getValueForStatus,
    statusLabels: getValuesStatusEntity.statusLabels,
    entityType: v3EntityType,
    loadEntityList: entityHandlers.loadToEntity,
    entityListItem: entityHandlers.ListItemToEntity,
    selected: entityHandlers.selectedEntityItem,
    setSelected: entityHandlers.setSelectedToEntity,
    checkPolygonsSite: entityHandlers.checkPolygons,
    auditLogData,
    refetch,
    isLoading,
    auditData: {
      entity: isProjectHandoffAuditMode ? "project" : ReverseButtonStates2[buttonToggle!],
      entityUuid: isProjectHandoffAuditMode ? record?.uuid ?? "" : entityHandlers.selectedEntityItem?.uuid ?? ""
    }
  };
};

export default useAuditLogActions;
