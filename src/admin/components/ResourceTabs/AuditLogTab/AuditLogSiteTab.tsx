import { Grid, Stack } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Button, Link, TabbedShowLayout, TabProps, useBasename, useShowContext } from "react-admin";
import { When } from "react-if";

import { convertDateFormat } from "@/admin/apiProvider/utils/entryFormat";
import modules from "@/admin/modules";
import Text from "@/components/elements/Text/Text";
import { GetV2AuditStatusResponse, useGetV2AuditStatus } from "@/generated/apiComponents";
import { AuditStatusResponse } from "@/generated/apiSchemas";
import useAuditLogActions from "@/hooks/useAuditLogActions";
import useLoadEntityList from "@/hooks/useLoadEntityList";
import { Entity } from "@/types/common";

import AuditLogSiteTabSelection from "./AuditLogSiteTabSelection";
import SiteAuditLogEntityStatus from "./components/SiteAuditLogEntityStatus";
import SiteAuditLogEntityStatusSide from "./components/SiteAuditLogEntityStatusSide";
// import SiteAuditLogPolygonStatusSide from "./components/SiteAuditLogPolygonStatusSide";
// import SiteAuditLogProjectStatus from "./components/SiteAuditLogProjectStatus";
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

const AuditLogSiteTab: FC<IProps> = ({ label, entity, ...rest }) => {
  const { record, isLoading } = useShowContext();
  const basename = useBasename();
  const { project } = record;

  const [buttonToogle, setButtonToogle] = useState(ButtonStates.PROJECTS);
  const { mutateEntity, valuesForStatus, statusLabels, entityType } = useAuditLogActions({ buttonToogle });
  const isProject = buttonToogle === ButtonStates.PROJECTS;
  const isPolygon = buttonToogle === ButtonStates.POLYGON;
  const {
    loadEntityList: loadSitePolygonList,
    selected: selectedPolygon,
    setSelected: setSelectedPolygon,
    entityList: polygonList
  } = useLoadEntityList({
    entityUuid: record.uuid,
    entityType: "sitePolygon"
  });
  const { data: auditLogData, refetch } = useGetV2AuditStatus<{ data: GetV2AuditStatusResponse }>({
    queryParams: {
      entity: ReverseButtonStates[buttonToogle],
      uuid: isProject ? project.uuid : isPolygon ? selectedPolygon?.uuid : record.uuid
    }
  });

  useEffect(() => {
    if (buttonToogle === ButtonStates.POLYGON) {
      loadSitePolygonList();
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
                <Text variant="text-24-bold">Project Status</Text>
                <Text variant="text-14-light" className="mb-4">
                  Update the site status, view updates, or add comments
                </Text>
                <Button
                  className="!mb-[25vh] !w-2/5 !rounded-lg !border-2 !border-solid !border-primary-500 !bg-white !px-4 !py-[10.5px] !text-xs !font-bold !uppercase !leading-[normal] !text-primary-500 hover:!bg-grey-900 disabled:!border-transparent disabled:!bg-grey-750 disabled:!text-grey-730 lg:!mb-[40vh] lg:!text-sm wide:!text-base"
                  component={Link}
                  to={`${basename}/${modules.project.ResourceName}/${record.project.uuid}/show/5`}
                  fullWidth
                  label="OPEN PROJECT AUDIT LOG"
                />
              </When>
              <When condition={buttonToogle !== ButtonStates.PROJECTS}>
                <SiteAuditLogEntityStatus
                  record={isProject ? project : isPolygon ? selectedPolygon : record}
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
              recordType={entityType == "projectPolygon" ? "Polygon" : (entityType as "Site" | "Project")}
              refresh={() => {
                refetch();
                isPolygon ? loadSitePolygonList() : refetch();
              }}
              record={isProject ? project : isPolygon ? selectedPolygon : record}
              polygonList={isPolygon ? polygonList : []}
              selectedPolygon={isPolygon ? selectedPolygon : null}
              setSelectedPolygon={isPolygon ? setSelectedPolygon : null}
              auditLogData={auditLogData?.data}
              recentRequestData={recentRequestData}
            />
          </Grid>
        </Grid>
      </TabbedShowLayout.Tab>
    </When>
  );
};

export default AuditLogSiteTab;
