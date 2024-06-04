import { useEffect } from "react";

import { POLYGON, PROJECT, SITE, SITE_POLYGON } from "@/constants/entities";
import {
  fetchPutV2SitePolygonUUID,
  fetchPutV2SiteProjectUUID,
  fetchPutV2SiteSiteUUID,
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
    mutateEntity: fetchPutV2SiteSiteUUID,
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
  const isSiteProject = entityLevel === PROJECT;
  const { entityListItem, selected, setSelected, loadEntityList } = useLoadEntityList({
    entityUuid: record.uuid,
    entityType: entityType as "Project" | "Site" | "Polygon",
    buttonToogle,
    entityLevel
  });

  const entityHandlers = (() => {
    if (isSiteProject) {
      return {
        selectedEntityItem: isProject ? record : selected,
        loadToEntity: !isProject ? loadEntityList : () => {},
        ListItemToEntity: !isProject ? entityListItem : [],
        setSelectedToEntity: !isProject ? setSelected : null
      };
    } else {
      return {
        selectedEntityItem: isProject ? record.project : isSite ? record : selected,
        loadToEntity: !isProject && !isSite ? loadEntityList : () => {},
        ListItemToEntity: !isProject && !isSite ? entityListItem : [],
        setSelectedToEntity: !isProject && !isSite ? setSelected : null
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
    auditLogData,
    refetch,
    isLoading
  };
};

export default useAuditLogActions;
