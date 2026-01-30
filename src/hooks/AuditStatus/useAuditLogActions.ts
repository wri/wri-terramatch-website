import { useT } from "@transifex/react";
import { useEffect, useMemo } from "react";

import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import { AuditLogEntity } from "@/admin/components/ResourceTabs/AuditLogTab/constants/types";
import { getV3AuditStatusEntity, useAuditStatuses } from "@/connections/AuditStatus";
import { useAllSitePolygons } from "@/connections/SitePolygons";
import { usePolygonValidation } from "@/connections/Validation";
import { AuditStatusDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { isValidCriteriaData } from "@/helpers/polygonValidation";
import ApiSlice from "@/store/apiSlice";
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
  mutateEntity: any;
  valuesForStatus: any;
  statusLabels: any;
  entityType: AuditLogEntity;
  loadEntityList: () => void;
  entityListItem: any;
  selected: any;
  setSelected: any;
  checkPolygonsSite: boolean | undefined;
  auditLogData: { data: AuditStatusDto[] } | undefined;
  refetch: () => void;
  isLoading: boolean;
  auditData: { entity: string; entity_uuid: string };
}

const useAuditLogActions = ({
  record,
  buttonToggle,
  entityLevel,
  isProjectReport
}: {
  record: any;
  buttonToggle?: number;
  entityLevel?: number;
  isProjectReport?: boolean;
}): AuditLogActionsResponse => {
  const t = useT();
  const isLevelDisturbanceReport = entityLevel === AuditLogButtonStates.DISTURBANCE_REPORT;
  const isLevelSrpReport = entityLevel === AuditLogButtonStates.SRP_REPORT;
  const isLevelFinancialReport = entityLevel === AuditLogButtonStates.FINANCIAL_REPORT;
  const { mutateEntity, valuesForStatus, statusLabels, entityType } = useStatusActionsMap(buttonToggle!);
  const isProject = buttonToggle === AuditLogButtonStates.PROJECT;
  const isSite = buttonToggle === AuditLogButtonStates.SITE;
  const isNursery = buttonToggle === AuditLogButtonStates.NURSERY;
  const isPolygon = buttonToggle === AuditLogButtonStates.POLYGON;
  const isSiteProject = entityLevel === AuditLogButtonStates.PROJECT;
  const { entityListItem, selected, setSelected, loadEntityList } = useLoadEntityList({
    entity: record,
    entityType: entityType as AuditLogEntity,
    buttonToggle,
    entityLevel,
    isProjectReport
  });

  const siteUuid =
    entityType === "Site" && record?.uuid && isSite ? (isSiteProject ? selected?.uuid : record.uuid) : undefined;

  const { data: sitePolygons } = useAllSitePolygons({
    entityName: "sites",
    entityUuid: siteUuid,
    enabled: !!siteUuid && entityType === "Site" && isSite
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
    polygonUuid: selected?.polygonUuid != null && isPolygon && !verifyEntity ? (selected.polygonUuid as string) : ""
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

  const getEntityTypeFromButtonToggle = (toggle: number): AuditLogEntity => {
    const mapping: Record<number, AuditLogEntity> = {
      [AuditLogButtonStates.PROJECT]: "Project",
      [AuditLogButtonStates.SITE]: "Site",
      [AuditLogButtonStates.POLYGON]: "Polygon",
      [AuditLogButtonStates.NURSERY]: "Nursery",
      [AuditLogButtonStates.PROJECT_REPORT]: "Project_Report",
      [AuditLogButtonStates.SITE_REPORT]: "Site_Report",
      [AuditLogButtonStates.NURSERY_REPORT]: "Nursery_Report",
      [AuditLogButtonStates.DISTURBANCE_REPORT]: "Disturbance_Report",
      [AuditLogButtonStates.SRP_REPORT]: "Srp_Report",
      [AuditLogButtonStates.FINANCIAL_REPORT]: "Financial_Report"
    };
    return mapping[toggle] ?? "Project";
  };

  const targetUuid =
    buttonToggle == AuditLogButtonStates.PROJECT
      ? record?.projectUuid ?? record.uuid
      : entityHandlers.selectedEntityItem?.uuid;

  const v3EntityType = getEntityTypeFromButtonToggle(buttonToggle!);
  const [isAuditLogLoaded, { data: auditStatusesData }] = useAuditStatuses({
    entity: getV3AuditStatusEntity(v3EntityType),
    uuid: targetUuid ?? ""
  });

  const refetch = () => {
    ApiSlice.pruneIndex("auditStatuses", "");
  };

  const auditLogData = auditStatusesData != null ? { data: auditStatusesData } : undefined;
  const isLoading = !isAuditLogLoaded;

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttonToggle, record, entityListItem, selected, targetUuid, v3EntityType]);

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

  return {
    mutateEntity,
    valuesForStatus: getValuesStatusEntity.getValueForStatus,
    statusLabels: getValuesStatusEntity.statusLabels,
    entityType: entityType as AuditLogEntity,
    loadEntityList: entityHandlers.loadToEntity,
    entityListItem: entityHandlers.ListItemToEntity,
    selected: entityHandlers.selectedEntityItem,
    setSelected: entityHandlers.setSelectedToEntity,
    checkPolygonsSite: entityHandlers.checkPolygons,
    auditLogData,
    refetch,
    isLoading,
    auditData: { entity: ReverseButtonStates2[buttonToggle!], entity_uuid: entityHandlers.selectedEntityItem?.uuid }
  };
};

export default useAuditLogActions;
