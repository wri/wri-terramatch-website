import { Grid, Stack } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { TabbedShowLayout, TabProps, useShowContext } from "react-admin";
import { When } from "react-if";

import { convertDateFormat } from "@/admin/apiProvider/utils/entryFormat";
import {
  fetchPutV2AdminSitePolygonUUID,
  fetchPutV2AdminSitesUUID,
  GetV2AuditStatusResponse,
  useGetV2AuditStatus
} from "@/generated/apiComponents";
import { AuditStatusResponse } from "@/generated/apiSchemas";
import useLoadEntityList from "@/hooks/useLoadEntityList";
import { Entity } from "@/types/common";

import AuditLogSiteTabSelection from "./AuditLogSiteTabSelection";
import SiteAuditLogEntityStatus from "./components/SiteAuditLogEntityStatus";
import SiteAuditLogPolygonStatusSide from "./components/SiteAuditLogPolygonStatusSide";
import SiteAuditLogProjectStatus from "./components/SiteAuditLogProjectStatus";
import SiteAuditLogProjectStatusSide from "./components/SiteAuditLogProjectStatusSide";
// import SiteAuditLogSiteStatusSide from "./components/SiteAuditLogSiteStatusSide";

interface IProps extends Omit<TabProps, "label" | "children"> {
  label?: string;
  entity?: Entity["entityName"];
}

export const ButtonStates = {
  PROJECTS: 0,
  SITE: 1,
  POLYGON: 2
};

const ReverseButtonStates: { [key: number]: string } = {
  0: "Project",
  1: "Site",
  2: "SitePolygon"
};

export function getValueForStatusPolygon(status: string): number {
  switch (status) {
    case "Submitted":
      return 0;
    case "needs-more-information":
      return 50;
    case "approved":
      return 100;
    default:
      return 0;
  }
}

function getValueForStatusSite(status: string): number {
  switch (status) {
    case "draft":
      return 0;
    case "awaiting-approval":
      return 25;
    case "needs-more-information":
      return 50;
    case "planting-in-progress":
      return 75;
    case "approved":
      return 100;
    default:
      return 0;
  }
}

export const polygonProgressBarStatusLabels = [
  { id: "1", label: "Submitted" },
  { id: "2", label: "Needs More Information" },
  { id: "3", label: "Approved" }
];

const siteProgressBarStatusLabels = [
  { id: "1", label: "Draft" },
  { id: "2", label: "Awaiting Approval" },
  { id: "3", label: "Needs More Information" },
  { id: "4", label: "Planting in Progress" },
  { id: "4", label: "Approved" }
];

const AuditLogTab: FC<IProps> = ({ label, entity, ...rest }) => {
  const [buttonToogle, setButtonToogle] = useState(ButtonStates.PROJECTS);
  const { record: project, isLoading } = useShowContext();
  const mutateSitePolygons = fetchPutV2AdminSitePolygonUUID;
  const mutateSite = fetchPutV2AdminSitesUUID;

  const {
    loadEntityList: loadPolygonList,
    selected: selectedPolygon,
    setSelected: setSelectedPolygon,
    entityList: polygonList
  } = useLoadEntityList({
    entityUuid: project.uuid,
    entityType: "Project"
  });

  const {
    loadEntityList: loadSiteList,
    selected: selectedSite,
    setSelected: setSelectedSite,
    entityList: siteList
  } = useLoadEntityList({
    entityUuid: project.uuid,
    entityType: "Site"
  });
  const { data: auditLogData, refetch } = useGetV2AuditStatus<{ data: GetV2AuditStatusResponse }>({
    queryParams: {
      entity: ReverseButtonStates[buttonToogle],
      uuid:
        buttonToogle === ButtonStates.PROJECTS
          ? project.uuid
          : buttonToogle === ButtonStates.SITE
          ? selectedSite?.uuid
          : selectedPolygon?.uuid
    }
  });

  useEffect(() => {
    if (buttonToogle === ButtonStates.SITE) {
      loadSiteList();
    } else if (buttonToogle === ButtonStates.POLYGON) {
      loadPolygonList();
    }
  }, [buttonToogle, project]);

  const recentRequestData = (recentRequest: AuditStatusResponse) => {
    return `From ${recentRequest.first_name ?? ""} ${recentRequest.last_name ?? ""} on
    ${convertDateFormat(recentRequest.date_created) ?? ""}`;
  };

  const recordToEntity = buttonToogle === ButtonStates.POLYGON ? selectedPolygon : selectedSite;

  return (
    <When condition={!isLoading}>
      <TabbedShowLayout.Tab label={label ?? "Audit log"} {...rest}>
        <Grid spacing={2} container className="max-h-[200vh] overflow-auto">
          <Grid xs={8}>
            <Stack gap={4} className="pl-8 pt-9">
              <AuditLogSiteTabSelection buttonToogle={buttonToogle} setButtonToogle={setButtonToogle} />
              <When condition={buttonToogle === ButtonStates.PROJECTS}>
                <SiteAuditLogProjectStatus record={project} auditLogData={auditLogData} refresh={refetch} />
              </When>
              <When condition={buttonToogle !== ButtonStates.PROJECTS}>
                <SiteAuditLogEntityStatus
                  record={recordToEntity}
                  auditLogData={auditLogData}
                  refresh={refetch}
                  buttonToogle={buttonToogle}
                  buttonStates={ButtonStates}
                />
              </When>
            </Stack>
          </Grid>
          <Grid xs={4} className="pl-8 pr-4 pt-9">
            <When condition={buttonToogle === ButtonStates.PROJECTS}>
              <SiteAuditLogProjectStatusSide
                record={project}
                refresh={refetch}
                auditLogData={auditLogData?.data}
                recentRequestData={recentRequestData}
              />
            </When>
            <When condition={buttonToogle === ButtonStates.SITE}>
              <SiteAuditLogPolygonStatusSide
                getValueForStatus={getValueForStatusSite}
                progressBarLabels={siteProgressBarStatusLabels}
                mutate={mutateSite}
                recordType="Site"
                refresh={() => {
                  refetch();
                  loadSiteList();
                }}
                record={selectedSite}
                polygonList={siteList}
                selectedPolygon={selectedSite}
                setSelectedPolygon={setSelectedSite}
                auditLogData={auditLogData?.data}
                recentRequestData={recentRequestData}
              />
            </When>
            <When condition={buttonToogle === ButtonStates.POLYGON}>
              <SiteAuditLogPolygonStatusSide
                getValueForStatus={getValueForStatusPolygon}
                progressBarLabels={polygonProgressBarStatusLabels}
                mutate={mutateSitePolygons}
                refresh={() => {
                  refetch();
                  loadPolygonList();
                }}
                record={selectedPolygon}
                polygonList={polygonList}
                selectedPolygon={selectedPolygon}
                setSelectedPolygon={setSelectedPolygon}
                auditLogData={auditLogData?.data}
                recentRequestData={recentRequestData}
              />
            </When>
          </Grid>
        </Grid>
      </TabbedShowLayout.Tab>
    </When>
  );
};

export default AuditLogTab;
