import { Grid, Stack } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { TabbedShowLayout, TabProps, useShowContext } from "react-admin";
import { When } from "react-if";

import { convertDateFormat } from "@/admin/apiProvider/utils/entryFormat";
import { GetV2AuditStatusResponse, useGetV2AuditStatus } from "@/generated/apiComponents";
import { AuditStatusResponse } from "@/generated/apiSchemas";
import useAuditLogActions from "@/hooks/useAuditLogActions";
import useLoadEntityList from "@/hooks/useLoadEntityList";
import { Entity } from "@/types/common";

import AuditLogSiteTabSelection from "./AuditLogSiteTabSelection";
import SiteAuditLogEntityStatus from "./components/SiteAuditLogEntityStatus";
import SiteAuditLogEntityStatusSide from "./components/SiteAuditLogEntityStatusSide";
// import SiteAuditLogPolygonStatusSide from "./components/SiteAuditLogPolygonStatusSide";
import SiteAuditLogProjectStatus from "./components/SiteAuditLogProjectStatus";
// import SiteAuditLogProjectStatusSide from "./components/SiteAuditLogProjectStatusSide";
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

export interface EntityList {
  poly_name?: string | undefined;
  name?: string | undefined;
  uuid?: string | undefined;
  value?: string | undefined;
  meta?: string | undefined;
  status?: string | undefined;
}

const AuditLogTab: FC<IProps> = ({ label, entity, ...rest }) => {
  const [buttonToogle, setButtonToogle] = useState(ButtonStates.PROJECTS);
  const { record, isLoading } = useShowContext();
  const { mutateEntity, valuesForStatus, statusLabels, entityType } = useAuditLogActions({ buttonToogle });
  const {
    loadEntityList: loadPolygonList,
    selected: selectedPolygon,
    setSelected: setSelectedPolygon,
    entityList: polygonList
  } = useLoadEntityList({
    entityUuid: record?.uuid,
    entityType: "projectPolygon"
  });

  const {
    loadEntityList: loadSiteList,
    selected: selectedSite,
    setSelected: setSelectedSite,
    entityList: siteList
  } = useLoadEntityList({
    entityUuid: record?.uuid,
    entityType: "Site"
  });
  const isProject = buttonToogle === ButtonStates.PROJECTS;
  const isSite = buttonToogle === ButtonStates.SITE;
  const { data: auditLogData, refetch } = useGetV2AuditStatus<{ data: GetV2AuditStatusResponse }>({
    queryParams: {
      entity: ReverseButtonStates[buttonToogle],
      uuid: isProject ? record?.uuid : isSite ? selectedSite?.uuid : selectedPolygon?.uuid
    }
  });

  useEffect(() => {
    refetch();
    if (buttonToogle === ButtonStates.POLYGON) {
      loadPolygonList();
    }
    if (buttonToogle === ButtonStates.SITE) {
      loadSiteList();
    }
  }, [buttonToogle, record]);

  const recentRequestData = (recentRequest: AuditStatusResponse) => {
    return `From ${recentRequest.first_name ?? ""} ${recentRequest.last_name ?? ""} on
    ${convertDateFormat(recentRequest.date_created) ?? ""}`;
  };

  return (
    <When condition={!isLoading}>
      <TabbedShowLayout.Tab label={label ?? "Audit log"} {...rest}>
        <Grid spacing={2} container className="max-h-[200vh] overflow-auto">
          <Grid xs={8}>
            <Stack gap={4} className="pl-8 pt-9">
              <AuditLogSiteTabSelection buttonToogle={buttonToogle} setButtonToogle={setButtonToogle} />
              <When condition={buttonToogle === ButtonStates.PROJECTS}>
                <SiteAuditLogProjectStatus record={record} auditLogData={auditLogData} refresh={refetch} />
              </When>
              <When condition={buttonToogle !== ButtonStates.PROJECTS}>
                <SiteAuditLogEntityStatus
                  record={isSite ? selectedSite : selectedPolygon}
                  auditLogData={auditLogData}
                  refresh={refetch}
                  buttonToogle={buttonToogle}
                  buttonStates={ButtonStates}
                />
              </When>
            </Stack>
          </Grid>
          <Grid xs={4} className="pl-8 pr-4 pt-9">
            <SiteAuditLogEntityStatusSide
              getValueForStatus={valuesForStatus}
              progressBarLabels={statusLabels}
              mutate={mutateEntity}
              recordType={
                entityType == "SitePolygon" || entityType == "projectPolygon"
                  ? "Polygon"
                  : (entityType as "Site" | "Project")
              }
              refresh={() => {
                refetch();
                isSite ? loadSiteList() : loadPolygonList();
              }}
              record={isProject ? record : isSite ? selectedSite : selectedPolygon}
              polygonList={isProject ? [] : isSite ? siteList : polygonList}
              selectedPolygon={isProject ? null : isSite ? selectedSite : selectedPolygon}
              setSelectedPolygon={isProject ? null : isSite ? setSelectedSite : setSelectedPolygon}
              auditLogData={auditLogData?.data}
              recentRequestData={recentRequestData}
            />
            {/* <When condition={buttonToogle === ButtonStates.PROJECTS}>
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
            </When> */}
          </Grid>
        </Grid>
      </TabbedShowLayout.Tab>
    </When>
  );
};

export default AuditLogTab;
