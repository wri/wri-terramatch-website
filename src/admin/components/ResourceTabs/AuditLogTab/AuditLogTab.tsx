import { Grid, Stack } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { TabbedShowLayout, TabProps, useShowContext } from "react-admin";
import { When } from "react-if";

import { convertDateFormat } from "@/admin/apiProvider/utils/entryFormat";
import {
  fetchGetV2AuditStatusId,
  fetchGetV2ProjectsUUIDSites,
  fetchPutV2AdminSitePolygonUUID,
  GetV2AuditStatusResponse,
  useGetV2Attachment,
  useGetV2AuditStatus
} from "@/generated/apiComponents";
import { Entity } from "@/types/common";

import AuditLogSiteTabSelection from "./AuditLogSiteTabSelection";
import SiteAuditLogPolygonStatus from "./components/SiteAuditLogPolygonStatus";
import SiteAuditLogPolygonStatusSide from "./components/SiteAuditLogPolygonStatusSide";
import SiteAuditLogProjectStatus from "./components/SiteAuditLogProjectStatus";
import SiteAuditLogProjectStatusSide from "./components/SiteAuditLogProjectStatusSide";
import SiteAuditLogSiteStatus from "./components/SiteAuditLogSiteStatus";
// import SiteAuditLogSiteStatusSide from "./components/SiteAuditLogSiteStatusSide";

interface IProps extends Omit<TabProps, "label" | "children"> {
  label?: string;
  entity?: Entity["entityName"];
}

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

const formattedTextStatus = (text: string) => {
  return text.replace(/-/g, " ").replace(/\b\w/g, char => char.toUpperCase());
};

const getTextForActionTable = (item: { type: string; status: string; request_removed: boolean }): string => {
  if (item.type === "comment") {
    return "New Comment";
  } else if (item.type === "status") {
    return `New Status: ${formattedTextStatus(item.status)}`;
  } else if (item.request_removed) {
    return "Change Request Removed";
  } else {
    return "Change Requested Added";
  }
};

const AuditLogTab: FC<IProps> = ({ label, entity, ...rest }) => {
  const [buttonToogle, setButtonToogle] = useState(ButtonStates.PROJECTS);
  const { record: project, isLoading } = useShowContext();
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [siteList, setSiteList] = useState<any[]>([]);
  const [selectedPolygon, setSelectedPolygon] = useState<any>(null);
  const [polygonList, setPolygonList] = useState<any[]>([]);
  const mutateSitePolygons = fetchPutV2AdminSitePolygonUUID;
  const mutateSite = fetchPutV2AdminSitePolygonUUID;

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

  const loadSiteList = async () => {
    const res = await fetchGetV2ProjectsUUIDSites({
      pathParams: {
        uuid: project.uuid
      }
    });
    const _siteList = (res as { data: any[] }).data;
    setSiteList(
      _siteList.map((item: any) => ({
        title: item?.name,
        uuid: item?.uuid,
        name: item?.name,
        value: item?.uuid,
        meta: item?.status,
        status: item?.status
      }))
    );
    if (_siteList.length > 0) {
      if (selectedSite?.title === undefined || !selectedSite) {
        setSelectedSite({
          title: _siteList[0]?.name,
          uuid: _siteList[0]?.uuid,
          name: _siteList[0]?.name,
          value: _siteList[0]?.uuid,
          meta: _siteList[0]?.status,
          status: _siteList[0]?.status
        });
      } else {
        const currentSelectedSite = (res as { data: any[] }).data.find(item => item.uuid === selectedSite?.uuid);
        setSelectedSite({
          title: currentSelectedSite?.name,
          uuid: currentSelectedSite?.uuid,
          name: currentSelectedSite?.name,
          value: currentSelectedSite?.uuid,
          meta: currentSelectedSite?.status,
          status: currentSelectedSite?.status
        });
      }
    } else {
      setSelectedSite(null);
    }
  };

  const loadPolygonList = async () => {
    const res = await fetchGetV2AuditStatusId({
      pathParams: {
        id: project.uuid
      }
    });
    const _PolygonList = (res as { data: any[] }).data;
    setPolygonList(
      _PolygonList.map((item: any) => ({
        title: item?.poly_name,
        uuid: item?.uuid,
        name: item?.poly_name,
        value: item?.uuid,
        meta: item?.status,
        status: item?.status
      }))
    );
    if (_PolygonList.length > 0) {
      if (selectedPolygon?.title === undefined || !selectedPolygon) {
        setSelectedPolygon({
          title: _PolygonList[0]?.poly_name,
          uuid: _PolygonList[0]?.uuid,
          name: _PolygonList[0]?.poly_name,
          value: _PolygonList[0]?.uuid,
          meta: _PolygonList[0]?.status,
          status: _PolygonList[0]?.status
        });
      } else {
        const currentSelectedPolygon = (res as { data: any[] }).data.find(item => item.uuid === selectedPolygon?.uuid);
        setSelectedPolygon({
          title: currentSelectedPolygon?.poly_name,
          uuid: currentSelectedPolygon?.uuid,
          name: currentSelectedPolygon?.poly_name,
          value: currentSelectedPolygon?.uuid,
          meta: currentSelectedPolygon?.status,
          status: currentSelectedPolygon?.status
        });
      }
    } else {
      setSelectedPolygon(null);
    }
  };

  useEffect(() => {
    if (buttonToogle === ButtonStates.SITE) {
      loadSiteList();
    } else if (buttonToogle === ButtonStates.POLYGON) {
      loadPolygonList();
    }
  }, [buttonToogle, project]);

  const { data: attachmentData, refetch: attachmentRefetch } = useGetV2Attachment<AttachmentResponse>({});

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
                  getTextForActionTable={getTextForActionTable}
                />
              </When>
              <When condition={buttonToogle === ButtonStates.SITE}>
                <SiteAuditLogSiteStatus
                  record={selectedSite}
                  auditLogData={auditLogData}
                  refresh={refetch}
                  recordAttachments={attachmentData?.data}
                  refreshAttachments={attachmentRefetch}
                  getTextForActionTable={getTextForActionTable}
                />
              </When>
              <When condition={buttonToogle === ButtonStates.POLYGON}>
                <SiteAuditLogPolygonStatus
                  record={selectedPolygon}
                  auditLogData={auditLogData}
                  refresh={refetch}
                  recordAttachments={attachmentData?.data}
                  refreshAttachments={attachmentRefetch}
                  getTextForActionTable={getTextForActionTable}
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
