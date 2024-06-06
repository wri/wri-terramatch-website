import { useEffect, useState } from "react";

import { POLYGON, PROJECT, SITE, SITE_POLYGON } from "@/constants/entities";
import {
  fetchGetV2CheckApprovedPolygonsUuid,
  fetchGetV2TerrafundValidationPolygon,
  fetchPutV2SitePolygonUUID,
  fetchPutV2SiteProjectUUID,
  fetchPutV2SiteStatusUUID,
  GetV2AuditStatusResponse,
  useGetV2AuditStatus
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

export const ButtonStates = {
  PROJECTS: 0,
  SITE: 1,
  POLYGON: 2
};

const ReverseButtonStates: { [key: number]: string } = {
  0: PROJECT,
  1: SITE,
  2: SITE_POLYGON
};

const statusActionsMap = {
  [ButtonStates.PROJECTS]: {
    mutateEntity: fetchPutV2SiteProjectUUID,
    valuesForStatus: getValueForStatusProject,
    statusLabels: projectStatusLabels,
    entityType: PROJECT
  },
  [ButtonStates.SITE]: {
    mutateEntity: fetchPutV2SiteStatusUUID,
    valuesForStatus: getValueForStatusSite,
    statusLabels: siteProgressBarStatusLabels,
    entityType: SITE
  },
  [ButtonStates.POLYGON]: {
    mutateEntity: fetchPutV2SitePolygonUUID,
    valuesForStatus: getValueForStatusPolygon,
    statusLabels: polygonProgressBarStatusLabels,
    entityType: POLYGON
  }
};

const useAuditLogActions = ({
  record,
  buttonToogle,
  entityLevel
}: {
  record: any;
  buttonToogle: number;
  entityLevel: string;
}) => {
  const { mutateEntity, valuesForStatus, statusLabels, entityType } = statusActionsMap[buttonToogle];
  const isProject = buttonToogle === ButtonStates.PROJECTS;
  const isSite = buttonToogle === ButtonStates.SITE;
  const isPolygon = buttonToogle === ButtonStates.POLYGON;
  const isSiteProject = entityLevel === PROJECT;
  const [checkPolygons, setCheckPolygons] = useState<boolean | undefined>(undefined);
  const [criteriaValidation, setCriteriaValidation] = useState<boolean | any>();
  const { entityListItem, selected, setSelected, loadEntityList } = useLoadEntityList({
    entityUuid: record?.uuid,
    entityType: entityType as "Project" | "Site" | "Polygon",
    buttonToogle,
    entityLevel
  });

  useEffect(() => {
    const fetchCheckPolygons = async () => {
      if (entityType === "Site" && record?.uuid && isSite) {
        const result = await fetchGetV2CheckApprovedPolygonsUuid({
          pathParams: { uuid: isSiteProject ? selected?.uuid : record.uuid }
        });
        setCheckPolygons(result.data?.check_polygons);
      }
    };

    const fetchCriteriaValidation = async () => {
      if (selected?.poly_id && isPolygon) {
        const criteriaData = await fetchGetV2TerrafundValidationPolygon({
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
  } = useGetV2AuditStatus<{ data: GetV2AuditStatusResponse }>({
    queryParams: {
      entity: ReverseButtonStates[buttonToogle],
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
    entityType: entityType,
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
