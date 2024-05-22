import { Grid, Stack } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { TabbedShowLayout, TabProps, useShowContext } from "react-admin";
import { When } from "react-if";

import { convertDateFormat } from "@/admin/apiProvider/utils/entryFormat";
import {
  fetchGetV2AdminSitePolygonUUID,
  GetV2AuditStatusResponse,
  useGetV2Attachment,
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

interface AttachmentItem {
  id: number;
  entity_id: number;
  attachment: string;
  url_file: string;
}

interface AttachmentResponse {
  data: [AttachmentItem];
}

interface recentRequestItem {
  first_name: string;
  last_name: string;
  date_created: string;
}

const AuditLogSiteTab: FC<IProps> = ({ label, entity, ...rest }) => {
  const { record, isLoading } = useShowContext();
  const { project } = record;

  const [buttonToogle, setButtonToogle] = useState(ButtonStates.PROJECTS);
  const [selectedPolygon, setSelectedPolygon] = useState<any>(null);
  const [polygonList, setPolygonList] = useState<any[]>([]);

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

  const { data: attachmentData, refetch: attachmentRefetch } = useGetV2Attachment<AttachmentResponse>({});

  const loadSitePolygonList = async () => {
    console.log("loadSitePolygonList", record.uuid);
    const res = await fetchGetV2AdminSitePolygonUUID({
      pathParams: {
        uuid: record.uuid
      }
    });
    const _polygonList = (res as { data: SitePolygonResponse[] }).data;
    console.log("data", res);
    setPolygonList(
      _polygonList.map((item: any) => ({
        title: item?.poly_name,
        uuid: item?.uuid,
        name: item?.poly_name,
        value: item?.uuid,
        meta: item?.status,
        status: item?.status
      }))
    );
    if (_polygonList.length > 0) {
      if (selectedPolygon?.title === undefined || !selectedPolygon) {
        setSelectedPolygon({
          title: _polygonList[0]?.poly_name,
          uuid: _polygonList[0]?.uuid,
          name: _polygonList[0]?.poly_name,
          value: _polygonList[0]?.uuid,
          meta: _polygonList[0]?.status,
          status: _polygonList[0]?.status
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

  const recentRequestData = (recentRequest: recentRequestItem) => {
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
                <SiteAuditLogProjectStatus
                  record={project}
                  auditLogData={auditLogData}
                  refresh={refetch}
                  recordAttachments={attachmentData?.data}
                  refreshAttachments={attachmentRefetch}
                />
              </When>
              <When condition={buttonToogle === ButtonStates.SITE}>
                <SiteAuditLogSiteStatus
                  record={record}
                  auditLogData={auditLogData}
                  refresh={refetch}
                  recordAttachments={attachmentData?.data}
                  refreshAttachments={attachmentRefetch}
                />
              </When>
              <When condition={buttonToogle === ButtonStates.POLYGON}>
                <SiteAuditLogPolygonStatus
                  record={selectedPolygon}
                  auditLogData={auditLogData}
                  refresh={refetch}
                  recordAttachments={attachmentData?.data}
                  refreshAttachments={attachmentRefetch}
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
              <SiteAuditLogSiteStatusSide
                record={record}
                refresh={refetch}
                auditLogData={auditLogData?.data}
                recentRequestData={recentRequestData}
              />
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
                recentRequestData={recentRequestData}
              />
            </When>
          </Grid>
        </Grid>
      </TabbedShowLayout.Tab>
    </When>
  );
};

export default AuditLogSiteTab;
