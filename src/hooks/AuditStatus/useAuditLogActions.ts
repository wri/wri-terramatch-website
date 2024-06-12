import { useEffect, useState } from "react";

import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import { AuditLogEntity } from "@/admin/components/ResourceTabs/AuditLogTab/constants/types";
import { POLYGON, PROJECT, SITE } from "@/constants/entities";
import {
  fetchGetV2SitesSiteCheckApprove,
  fetchPostV2TerrafundValidationPolygon,
  fetchPutV2ENTITYUUIDStatus,
  GetV2AuditStatusENTITYUUIDResponse,
  useGetV2AuditStatusENTITYUUID
} from "@/generated/apiComponents";
import {
  getValueForStatusPolygon,
  getValueForStatusProject,
  getValueForStatusSite,
  polygonProgressBarStatusLabels,
  projectStatusLabels,
  siteProgressBarStatusLabels
} from "@/utils/statusUtils";

import useLoadEntityList from "./useLoadEntityList";

const ESTIMATED_AREA_CRITERIA_ID = 12;

const ReverseButtonStates2: { [key: number]: string } = {
  0: "project",
  1: "site",
  2: "site-polygon"
};

const statusActionsMap = {
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
}

const useAuditLogActions = ({
  record,
  buttonToogle,
  entityLevel
}: {
  record: any;
  buttonToogle: number;
  entityLevel: string;
}): AuditLogActionsResponse => {
  const { mutateEntity, valuesForStatus, statusLabels, entityType } = statusActionsMap[buttonToogle];
  const isProject = buttonToogle === AuditLogButtonStates.PROJECT;
  const isSite = buttonToogle === AuditLogButtonStates.SITE;
  const isPolygon = buttonToogle === AuditLogButtonStates.POLYGON;
  const isSiteProject = entityLevel === PROJECT;
  const [checkPolygons, setCheckPolygons] = useState<boolean | undefined>(undefined);
  const [criteriaValidation, setCriteriaValidation] = useState<boolean | any>();
  const { entityListItem, selected, setSelected, loadEntityList } = useLoadEntityList({
    entityUuid: record?.uuid,
    entityType: entityType as AuditLogEntity,
    buttonToogle,
    entityLevel
  });

  useEffect(() => {
    const fetchCheckPolygons = async () => {
      if (entityType === "Site" && record?.uuid && isSite) {
        const result = await fetchGetV2SitesSiteCheckApprove({
          pathParams: { uuid: isSiteProject ? selected?.uuid : record.uuid }
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

    fetchCheckPolygons();
    fetchCriteriaValidation();
  }, [entityType, record, selected]);

  const isValidCriteriaData = (criteriaData: any) => {
    if (!criteriaData?.criteria_list?.length) {
      return true;
    }
    return criteriaData.criteria_list.some(
      (criteria: any) => criteria.criteria_id !== ESTIMATED_AREA_CRITERIA_ID && criteria.valid !== 1
    );
  };

  const entityHandlers = (() => {
    if (isSiteProject) {
      return {
        selectedEntityItem: isProject ? record : selected,
        loadToEntity: !isProject ? loadEntityList : () => {},
        ListItemToEntity: !isProject ? entityListItem : [],
        setSelectedToEntity: !isProject ? setSelected : null,
        checkPolygons: isSite ? checkPolygons : isPolygon ? isValidCriteriaData(criteriaValidation) : false
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
      entity: ReverseButtonStates2[buttonToogle],
      uuid: entityHandlers.selectedEntityItem?.uuid
    }
  });

  useEffect(() => {
    refetch();
  }, [buttonToogle, record, entityListItem, selected]);

  return {
    mutateEntity,
    valuesForStatus,
    statusLabels,
    entityType: entityType as AuditLogEntity,
    loadEntityList: entityHandlers.loadToEntity,
    entityListItem: entityHandlers.ListItemToEntity,
    selected: entityHandlers.selectedEntityItem,
    setSelected: entityHandlers.setSelectedToEntity,
    checkPolygonsSite: entityHandlers.checkPolygons,
    auditLogData,
    refetch,
    isLoading
  };
};

export default useAuditLogActions;
