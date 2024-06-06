import { Grid, Stack } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { TabbedShowLayout, TabProps, useShowContext } from "react-admin";
import { When } from "react-if";

import { convertDateFormat } from "@/admin/apiProvider/utils/entryFormat";
import { PROJECT } from "@/constants/entities";
import { AuditStatusResponse } from "@/generated/apiSchemas";
import useAuditLogActions from "@/hooks/useAuditLogActions";
import { Entity } from "@/types/common";

import AuditLogSiteTabSelection from "./AuditLogSiteTabSelection";
import SiteAuditLogEntityStatus from "./components/SiteAuditLogEntityStatus";
import SiteAuditLogEntityStatusSide from "./components/SiteAuditLogEntityStatusSide";
import SiteAuditLogProjectStatus from "./components/SiteAuditLogProjectStatus";

interface IProps extends Omit<TabProps, "label" | "children"> {
  label?: string;
  entity?: Entity["entityName"];
}

export const ButtonStates = {
  PROJECTS: 0,
  SITE: 1,
  POLYGON: 2
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
  const {
    mutateEntity,
    valuesForStatus,
    statusLabels,
    entityType,
    entityListItem,
    loadEntityList,
    selected,
    setSelected,
    auditLogData,
    refetch,
    checkPolygonsSite
  } = useAuditLogActions({
    record,
    buttonToogle,
    entityLevel: PROJECT
  });

  useEffect(() => {
    refetch();
    loadEntityList();
  }, [buttonToogle]);

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
                  record={selected}
                  auditLogData={auditLogData}
                  refresh={refetch}
                  buttonToogle={buttonToogle}
                  buttonStates={ButtonStates}
                  viewPD={false}
                />
              </When>
            </Stack>
          </Grid>
          <Grid xs={4} className="pl-8 pr-4 pt-9">
            <SiteAuditLogEntityStatusSide
              getValueForStatus={valuesForStatus}
              progressBarLabels={statusLabels}
              mutate={mutateEntity}
              recordType={entityType as "Project" | "Site" | "Polygon"}
              refresh={() => {
                loadEntityList();
                refetch();
              }}
              record={selected}
              polygonList={entityListItem}
              selectedPolygon={selected}
              setSelectedPolygon={setSelected}
              auditLogData={auditLogData?.data}
              recentRequestData={recentRequestData}
              checkPolygonsSite={checkPolygonsSite}
            />
          </Grid>
        </Grid>
      </TabbedShowLayout.Tab>
    </When>
  );
};

export default AuditLogTab;
