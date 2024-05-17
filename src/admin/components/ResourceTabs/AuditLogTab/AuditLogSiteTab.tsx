import { Grid, Stack } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { TabbedShowLayout, TabProps, useShowContext } from "react-admin";
import { When } from "react-if";

import {
  fetchGetV2AdminSitePolygonUUID,
  GetV2AuditStatusResponse,
  useGetV2AuditStatus
} from "@/generated/apiComponents";
import { SitePolygonResponse } from "@/generated/apiSchemas";
import { Entity } from "@/types/common";

import AuditLogSiteTabSelection from "./AuditLogSiteTabSelection";
import SiteAuditLogPolygonStatus from "./components/SiteAuditLogPolygonStatus";
import SiteAuditLogPolygonStatusSide from "./components/SiteAuditLogPolygonStatusSide";
import SiteAuditLogProjectStatus from "./components/SiteAuditLogProjectStatus";
import SiteAuditLogProjectStatusSide from "./components/SiteAuditLogProjectStatusSide";
import SiteAuditLogSiteStatus from "./components/SiteAuditLogSiteStatus";
import SiteAuditLogSiteStatusSide from "./components/SiteAuditLogSiteStatusSide";

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
  const { project } = record;

  const [buttonToogle, setButtonToogle] = useState(ButtonStates.PROJECTS);
  const [selectedPolygon, setSelectedPolygon] = useState<any>("");
  const [polygonList, setPolygonList] = useState<any[]>([]);

  const { data: auditLogData, refetch } = useGetV2AuditStatus<{ data: GetV2AuditStatusResponse }>({
    queryParams: {
      entity: ReverseButtonStates[buttonToogle],
      uuid:
        buttonToogle === ButtonStates.PROJECTS
          ? project.uuid
          : buttonToogle === ButtonStates.SITE
          ? record.uuid
          : selectedPolygon.value
    }
  });

  const loadSitePolygonList = async () => {
    const res = await fetchGetV2AdminSitePolygonUUID({
      pathParams: {
        uuid: record.uuid
      }
    });
    setPolygonList(
      (res as { data: SitePolygonResponse[] }).data.map((item: any) => ({
        title: item?.poly_name,
        value: item?.uuid,
        meta: item?.status
      }))
    );
    if (polygonList.length > 0) {
      if (selectedPolygon.title === undefined || !selectedPolygon) {
        setSelectedPolygon({
          title: (res as { data: any[] }).data[0]?.poly_name,
          value: (res as { data: any[] }).data[0]?.uuid,
          meta: (res as { data: any[] }).data[0]?.status
        });
      } else {
        const currentSelectedPolygon = (res as { data: any[] }).data.find(item => item.uuid === selectedPolygon.value);
        setSelectedPolygon({
          title: currentSelectedPolygon?.poly_name,
          value: currentSelectedPolygon?.value,
          meta: currentSelectedPolygon?.status
        });
      }
    }
  };

  useEffect(() => {
    if (buttonToogle === ButtonStates.POLYGON) {
      loadSitePolygonList();
    }
  }, [buttonToogle, record]);

  return (
    <When condition={!isLoading}>
      <TabbedShowLayout.Tab label={label ?? "Audit log"} {...rest}>
        <Grid spacing={2} container className="max-h-[200vh] overflow-auto">
          <Grid xs={8}>
            <Stack gap={4} className="pt-9 pl-8">
              <AuditLogSiteTabSelection buttonToogle={buttonToogle} setButtonToogle={setButtonToogle} />
              <When condition={buttonToogle === ButtonStates.PROJECTS}>
                <SiteAuditLogProjectStatus record={record} auditLogData={auditLogData} refresh={refetch} />
              </When>
              <When condition={buttonToogle === ButtonStates.SITE}>
                <SiteAuditLogSiteStatus record={record} auditLogData={auditLogData} refresh={refetch} />
              </When>
              <When condition={buttonToogle === ButtonStates.POLYGON}>
                <SiteAuditLogPolygonStatus record={selectedPolygon} auditLogData={auditLogData} refresh={refetch} />
              </When>
            </Stack>
          </Grid>
          <Grid xs={4} className="pt-9 pl-8 pr-4">
            <When condition={buttonToogle === ButtonStates.PROJECTS}>
              <SiteAuditLogProjectStatusSide record={project} refresh={refetch} auditLogData={auditLogData?.data} />
            </When>
            <When condition={buttonToogle === ButtonStates.SITE}>
              <SiteAuditLogSiteStatusSide record={record} refresh={refetch} auditLogData={auditLogData?.data} />
            </When>
            <When condition={buttonToogle === ButtonStates.POLYGON}>
              <SiteAuditLogPolygonStatusSide
                refresh={() => {
                  refetch();
                  loadSitePolygonList();
                }}
                record={selectedPolygon}
                polygonList={polygonList}
                selectedPolygon={selectedPolygon}
                setSelectedPolygon={setSelectedPolygon}
                auditLogData={auditLogData?.data}
              />
            </When>
          </Grid>
        </Grid>
      </TabbedShowLayout.Tab>
    </When>
  );
};

export default AuditLogSiteTab;
