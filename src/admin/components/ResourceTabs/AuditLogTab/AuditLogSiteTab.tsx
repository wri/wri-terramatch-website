import { Grid, Stack } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { TabbedShowLayout, TabProps, useShowContext } from "react-admin";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import {
  fetchGetV2AdminSitePolygonUUID,
  GetV2AuditStatusResponse,
  useGetV2AuditStatus
} from "@/generated/apiComponents";
import { SitePolygonResponse } from "@/generated/apiSchemas";
import { Entity } from "@/types/common";

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

const ButtonStates = {
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
  const ctx = useShowContext();
  const resource = entity ?? ctx.resource;

  const [buttonToogle, setButtonToogle] = useState(ButtonStates.PROJECTS);
  const [selectedPolygon, setSelectedPolygon] = useState<any>("");
  const [polygonList, setPolygonList] = useState<any[]>([]);

  const { data: auditLogData, refetch } = useGetV2AuditStatus<{ data: GetV2AuditStatusResponse }>({
    queryParams: {
      entity: ReverseButtonStates[buttonToogle],
      uuid:
        buttonToogle === ButtonStates.PROJECTS
          ? ctx.record.project.uuid
          : buttonToogle === ButtonStates.SITE
          ? ctx.record.uuid
          : selectedPolygon.value
    }
  });

  const loadSitePolygonList = async () => {
    const res = await fetchGetV2AdminSitePolygonUUID({
      pathParams: {
        uuid: ctx.record.uuid
      }
    });
    setPolygonList(
      (res as { data: SitePolygonResponse[] }).data.map((item: any) => ({
        title: item.poly_name,
        value: item.uuid,
        meta: item.status
      }))
    );
    if (polygonList.length > 0) {
      if (selectedPolygon === "") {
        setSelectedPolygon({
          title: (res as { data: any[] }).data[0].poly_name,
          value: (res as { data: any[] }).data[0].uuid,
          meta: (res as { data: any[] }).data[0].status
        });
      } else {
        const currentSelectedPolygon = (res as { data: any[] }).data.find(item => item.uuid === selectedPolygon.value);
        setSelectedPolygon({
          title: currentSelectedPolygon.poly_name,
          value: currentSelectedPolygon.value,
          meta: currentSelectedPolygon.status
        });
      }
    }
  };

  useEffect(() => {
    if (buttonToogle === ButtonStates.POLYGON) {
      loadSitePolygonList();
    }
  }, [buttonToogle, ctx.record]);

  return (
    <When condition={!ctx.isLoading}>
      <TabbedShowLayout.Tab label={label ?? "Audit log"} {...rest}>
        <Grid spacing={2} container className="max-h-[200vh] overflow-auto">
          <Grid xs={8}>
            <Stack gap={4} className="pt-9 pl-8">
              <div className="flex w-fit gap-1 rounded-lg bg-neutral-200 p-1">
                <Button
                  variant={`${buttonToogle === ButtonStates.PROJECTS ? "white-toggle" : "transparent-toggle"}`}
                  onClick={() => setButtonToogle(ButtonStates.PROJECTS)}
                >
                  Project Status
                </Button>
                <Button
                  variant={`${buttonToogle === ButtonStates.SITE ? "white-toggle" : "transparent-toggle"}`}
                  onClick={() => setButtonToogle(ButtonStates.SITE)}
                >
                  Site Status
                </Button>
                <Button
                  variant={`${buttonToogle === ButtonStates.POLYGON ? "white-toggle" : "transparent-toggle"}`}
                  onClick={() => setButtonToogle(ButtonStates.POLYGON)}
                >
                  Polygon Status
                </Button>
              </div>
              <When condition={buttonToogle === ButtonStates.PROJECTS}>
                <SiteAuditLogProjectStatus
                  resource={resource}
                  uuid={ctx.record.uuid}
                  record={ctx.record}
                  auditLogData={auditLogData}
                />
              </When>
              <When condition={buttonToogle === ButtonStates.SITE}>
                <SiteAuditLogSiteStatus
                  resource={resource}
                  uuid={ctx.record.uuid}
                  record={ctx.record}
                  auditLogData={auditLogData}
                />
              </When>
              <When condition={buttonToogle === ButtonStates.POLYGON}>
                <SiteAuditLogPolygonStatus
                  resource={resource}
                  uuid={selectedPolygon.value}
                  record={polygonList.find(item => item.uuid === selectedPolygon.value)}
                  auditLogData={auditLogData}
                />
              </When>
            </Stack>
          </Grid>
          <Grid xs={4} className="pt-9 pl-8 pr-4">
            <When condition={buttonToogle === ButtonStates.PROJECTS}>
              <SiteAuditLogProjectStatusSide record={ctx.record.project} refresh={refetch} />
            </When>
            <When condition={buttonToogle === ButtonStates.SITE}>
              <SiteAuditLogSiteStatusSide record={ctx.record} refresh={refetch} />
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
              />
            </When>
          </Grid>
        </Grid>
      </TabbedShowLayout.Tab>
    </When>
  );
};

export default AuditLogSiteTab;
