import { Grid, Stack } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Button, Link, TabbedShowLayout, TabProps, useBasename, useShowContext } from "react-admin";
import { When } from "react-if";

import { convertDateFormat } from "@/admin/apiProvider/utils/entryFormat";
import modules from "@/admin/modules";
import Text from "@/components/elements/Text/Text";
import {
  fetchGetV2AdminSitePolygonUUID,
  fetchPutV2AdminSitePolygonUUID,
  GetV2AuditStatusResponse,
  useGetV2AuditStatus
} from "@/generated/apiComponents";
import { AuditStatusResponse, SitePolygonResponse } from "@/generated/apiSchemas";
import { Entity } from "@/types/common";

import AuditLogSiteTabSelection from "./AuditLogSiteTabSelection";
import { getValueForStatusPolygon, polygonProgressBarStatusLabels } from "./AuditLogTab";
import SiteAuditLogPolygonStatus from "./components/SiteAuditLogPolygonStatus";
import SiteAuditLogPolygonStatusSide from "./components/SiteAuditLogPolygonStatusSide";
// import SiteAuditLogProjectStatus from "./components/SiteAuditLogProjectStatus";
import SiteAuditLogProjectStatusSide from "./components/SiteAuditLogProjectStatusSide";
import SiteAuditLogSiteStatus from "./components/SiteAuditLogSiteStatus";
import SiteAuditLogSiteStatusSide from "./components/SiteAuditLogSiteStatusSide";

interface IProps extends Omit<TabProps, "label" | "children"> {
  label?: string;
  entity?: Entity["entityName"];
}

interface selectedPolygon {
  title: string | undefined;
  uuid: string | undefined;
  name: string | undefined;
  value: string | undefined;
  meta: string | undefined;
  status: string | undefined;
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
  const [selectedPolygon, setSelectedPolygon] = useState<selectedPolygon | null>();
  const [polygonList, setPolygonList] = useState<any[]>([]);
  const mutateSitePolygons = fetchPutV2AdminSitePolygonUUID;

  const { data: auditLogData, refetch } = useGetV2AuditStatus<{ data: GetV2AuditStatusResponse }>({
    queryParams: {
      entity: ReverseButtonStates[buttonToogle],
      uuid:
        buttonToogle === ButtonStates.PROJECTS
          ? project.uuid
          : buttonToogle === ButtonStates.SITE
          ? record.uuid
          : selectedPolygon?.uuid
    }
  });

  const unnamedTitleAndSort = (list: SitePolygonResponse[]) => {
    const unnamedItems = list?.map((item: SitePolygonResponse) => {
      if (!item.poly_name) {
        return { ...item, poly_name: "Unnamed Polygon" };
      }
      return item;
    });

    return unnamedItems?.sort((a: SitePolygonResponse, b: SitePolygonResponse) => {
      return a.poly_name?.localeCompare(b.poly_name || "") || 0;
    });
  };

  const loadSitePolygonList = async () => {
    console.log("loadSitePolygonList", record.uuid);
    const res = await fetchGetV2AdminSitePolygonUUID({
      pathParams: {
        uuid: record.uuid
      }
    });
    const _polygonList = (res as { data: SitePolygonResponse[] }).data;
    const _list = unnamedTitleAndSort(_polygonList);
    setPolygonList(
      _list.map((item: SitePolygonResponse) => ({
        title: item?.poly_name,
        uuid: item?.uuid,
        name: item?.poly_name,
        value: item?.uuid,
        meta: item?.status,
        status: item?.status
      }))
    );
    if (_list.length > 0) {
      if (selectedPolygon?.title === undefined || !selectedPolygon) {
        setSelectedPolygon({
          title: _list[0]?.poly_name,
          uuid: _list[0]?.uuid,
          name: _list[0]?.poly_name,
          value: _list[0]?.uuid,
          meta: _list[0]?.status,
          status: _list[0]?.status
        });
      } else {
        const currentSelectedPolygon = (res as { data: any[] }).data.find(item => item.uuid === selectedPolygon?.uuid);
        setSelectedPolygon({
          title: currentSelectedPolygon?.poly_name,
          uuid: currentSelectedPolygon?.uuid,
          name: currentSelectedPolygon?.poly_name,
          value: currentSelectedPolygon?.value,
          meta: currentSelectedPolygon?.status,
          status: currentSelectedPolygon?.status
        });
      }
    } else {
      setSelectedPolygon(null);
    }
  };

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
              <When condition={buttonToogle === ButtonStates.SITE}>
                <SiteAuditLogSiteStatus record={record} auditLogData={auditLogData} refresh={refetch} />
              </When>
              <When condition={buttonToogle === ButtonStates.POLYGON}>
                <SiteAuditLogPolygonStatus record={selectedPolygon} auditLogData={auditLogData} refresh={refetch} />
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
              <SiteAuditLogSiteStatusSide
                record={record}
                refresh={refetch}
                auditLogData={auditLogData?.data}
                recentRequestData={recentRequestData}
              />
            </When>
            <When condition={buttonToogle === ButtonStates.POLYGON}>
              <SiteAuditLogPolygonStatusSide
                getValueForStatus={getValueForStatusPolygon}
                progressBarLabels={polygonProgressBarStatusLabels}
                recordType="Polygon"
                refresh={() => {
                  refetch();
                  loadSitePolygonList();
                }}
                record={selectedPolygon}
                polygonList={polygonList}
                selectedPolygon={selectedPolygon}
                setSelectedPolygon={setSelectedPolygon}
                auditLogData={auditLogData?.data}
                recentRequestData={recentRequestData}
                mutate={mutateSitePolygons}
              />
            </When>
          </Grid>
        </Grid>
      </TabbedShowLayout.Tab>
    </When>
  );
};

export default AuditLogSiteTab;
