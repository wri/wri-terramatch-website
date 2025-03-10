import { useEffect, useState } from "react";

import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import { AuditLogEntity } from "@/admin/components/ResourceTabs/AuditLogTab/constants/types";
import { ENTITY_REPORT, NURSERY, POLYGON, PROJECT, SITE } from "@/constants/entities";
import {
  fetchGetV2SitesSiteCheckApprove,
  fetchPostV2TerrafundValidationPolygon,
  fetchPutV2ENTITYUUIDStatus,
  GetV2AuditStatusENTITYUUIDResponse,
  useGetV2AuditStatusENTITYUUID
} from "@/generated/apiComponents";
import {
  entityReportStatusLabels,
  getValueForStatusEntityReport,
  getValueForStatusNursery,
  getValueForStatusPolygon,
  getValueForStatusProject,
  getValueForStatusSite,
  nurseryStatusLabels,
  polygonProgressBarStatusLabels,
  projectStatusLabels,
  siteProgressBarStatusLabels
} from "@/utils/statusUtils";

import useLoadEntityList from "./useLoadEntityList";

const ESTIMATED_AREA_CRITERIA_ID = 12;

const ReverseButtonStates2: { [key: number]: string } = {
  0: "project",
  1: "site",
  2: "site-polygon",
  3: "nursery",
  4: "project-reports",
  5: "site-reports",
  6: "nursery-reports"
};

export const statusActionsMap = {
  [AuditLogButtonStates.PROJECT as number]: {
    mutateEntity: fetchPutV2ENTITYUUIDStatus,
    valuesForStatus: getValueForStatusProject,
    statusLabels: projectStatusLabels,
    entityType: PROJECT
  },
  [AuditLogButtonStates.SITE as number]: {
    mutateEntity: fetchPutV2ENTITYUUIDStatus,
    valuesForStatus: getValueForStatusSite,
    statusLabels: siteProgressBarStatusLabels,
    entityType: SITE
  },
  [AuditLogButtonStates.POLYGON as number]: {
    mutateEntity: fetchPutV2ENTITYUUIDStatus,
    valuesForStatus: getValueForStatusPolygon,
    statusLabels: polygonProgressBarStatusLabels,
    entityType: POLYGON
  },
  [AuditLogButtonStates.NURSERY as number]: {
    mutateEntity: fetchPutV2ENTITYUUIDStatus,
    valuesForStatus: getValueForStatusNursery,
    statusLabels: nurseryStatusLabels,
    entityType: NURSERY
  },
  [AuditLogButtonStates.REPORT as number]: {
    mutateEntity: fetchPutV2ENTITYUUIDStatus,
    valuesForStatus: getValueForStatusEntityReport,
    statusLabels: entityReportStatusLabels,
    entityType: ENTITY_REPORT
  }
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
  auditLogData: { data: GetV2AuditStatusENTITYUUIDResponse } | undefined;
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
  const reportEntityTypes = ReverseButtonStates2[buttonToggle!].includes("reports")
    ? AuditLogButtonStates.REPORT
    : buttonToggle;
  const { mutateEntity, valuesForStatus, statusLabels, entityType } = statusActionsMap[reportEntityTypes!];
  const isProject = buttonToggle === AuditLogButtonStates.PROJECT;
  const isSite = buttonToggle === AuditLogButtonStates.SITE;
  const isPolygon = buttonToggle === AuditLogButtonStates.POLYGON;
  const isSiteProject = entityLevel === AuditLogButtonStates.PROJECT;
  const [checkPolygons, setCheckPolygons] = useState<boolean | undefined>(undefined);
  const [criteriaValidation, setCriteriaValidation] = useState<boolean | any>();
  const { entityListItem, selected, setSelected, loadEntityList } = useLoadEntityList({
    entity: record,
    entityType: entityType as AuditLogEntity,
    buttonToggle,
    entityLevel,
    isProjectReport
  });

  const verifyEntity = ["reports", "nursery"].some(word => ReverseButtonStates2[entityLevel!].includes(word));

  useEffect(() => {
    const fetchCheckPolygons = async () => {
      if (entityType === "Site" && record?.uuid && isSite) {
        const result = await fetchGetV2SitesSiteCheckApprove({
          pathParams: { site: isSiteProject ? selected?.uuid : record.uuid }
        });
        setCheckPolygons(result.data?.can_approve);
      }
    };

    const fetchCriteriaValidation = async () => {
      if (selected?.poly_id && isPolygon) {
        const criteriaData = await fetchPostV2TerrafundValidationPolygon({
          queryParams: {
            uuid: selected?.poly_id as string
          }
        });
        setCriteriaValidation(criteriaData);
      }
    };
    if (!verifyEntity) {
      fetchCriteriaValidation();
      fetchCheckPolygons();
    }
  }, [entityType, isPolygon, isSite, isSiteProject, record?.uuid, selected, verifyEntity]);

  const isValidCriteriaData = (criteriaData: any) => {
    if (!criteriaData?.criteria_list?.length) {
      return true;
    }
    return criteriaData.criteria_list.some(
      (criteria: any) => criteria.criteria_id !== ESTIMATED_AREA_CRITERIA_ID && criteria.valid !== 1
    );
  };

  const entityHandlers = (() => {
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
        checkPolygons: isSite ? checkPolygons : isPolygon ? isValidCriteriaData(criteriaValidation) : false
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
        selectedEntityItem: isProject ? record.project : isSite ? record : selected,
        loadToEntity: !isProject && !isSite ? loadEntityList : () => {},
        ListItemToEntity: !isProject && !isSite ? entityListItem : [],
        setSelectedToEntity: !isProject && !isSite ? setSelected : null,
        checkPolygons: isSite ? checkPolygons : isPolygon ? isValidCriteriaData(criteriaValidation) : false
      };
    }
  })();

  const {
    data: auditLogData,
    refetch,
    isLoading
  } = useGetV2AuditStatusENTITYUUID<{ data: GetV2AuditStatusENTITYUUIDResponse }>({
    pathParams: {
      entity: ReverseButtonStates2[buttonToggle!],
      uuid: entityHandlers.selectedEntityItem?.uuid
    }
  });

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttonToggle, record, entityListItem, selected]);

  const getValuesStatusEntity = (() => {
    if (ReverseButtonStates2[entityLevel!]?.includes("Report")) {
      return {
        getValueForStatus: getValueForStatusEntityReport,
        statusLabels: entityReportStatusLabels
      };
    } else if (ReverseButtonStates2[entityLevel!] == "Nursery") {
      return {
        getValueForStatus: getValueForStatusNursery,
        statusLabels: nurseryStatusLabels
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
