import {
  fetchPutV2AdminProjectsUUID,
  fetchPutV2AdminSitePolygonUUID,
  fetchPutV2AdminSitesUUID
} from "@/generated/apiComponents";
import {
  getValueForStatusPolygon,
  getValueForStatusProject,
  getValueForStatusSite,
  polygonProgressBarStatusLabels,
  projectStatusLabels,
  siteProgressBarStatusLabels
} from "@/utils/statusUtils";

export const ButtonStates = {
  PROJECTS: 0,
  SITE: 1,
  POLYGON: 2
};

const statusActionsMap = {
  [ButtonStates.PROJECTS]: {
    mutateEntity: fetchPutV2AdminProjectsUUID,
    valuesForStatus: getValueForStatusProject,
    statusLabels: projectStatusLabels,
    entityType: "Project"
  },
  [ButtonStates.SITE]: {
    mutateEntity: fetchPutV2AdminSitesUUID,
    valuesForStatus: getValueForStatusSite,
    statusLabels: siteProgressBarStatusLabels,
    entityType: "Site"
  },
  [ButtonStates.POLYGON]: {
    mutateEntity: fetchPutV2AdminSitePolygonUUID,
    valuesForStatus: getValueForStatusPolygon,
    statusLabels: polygonProgressBarStatusLabels,
    entityType: "projectPolygon"
  }
};

const useAuditLogActions = ({ buttonToogle }: { buttonToogle: number }) => {
  const { mutateEntity, valuesForStatus, statusLabels, entityType } = statusActionsMap[buttonToogle];

  return {
    mutateEntity,
    valuesForStatus,
    statusLabels,
    entityType
  };
};

export default useAuditLogActions;
