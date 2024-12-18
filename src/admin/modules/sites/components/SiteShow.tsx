import { FC, useState } from "react";
import { Show, TabbedShowLayout } from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import DelayedJobsProgressAlert from "@/admin/components/Alerts/DelayedJobsProgressAlert";
import AuditLogTab from "@/admin/components/ResourceTabs/AuditLogTab/AuditLogTab";
import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import ChangeRequestsTab from "@/admin/components/ResourceTabs/ChangeRequestsTab/ChangeRequestsTab";
import DocumentTab from "@/admin/components/ResourceTabs/DocumentTab/DocumentTab";
import GalleryTab from "@/admin/components/ResourceTabs/GalleryTab/GalleryTab";
import InformationTab from "@/admin/components/ResourceTabs/InformationTab";
import MonitoredTab from "@/admin/components/ResourceTabs/MonitoredTab/MonitoredTab";
import PolygonReviewTab from "@/admin/components/ResourceTabs/PolygonReviewTab";
import ShowTitle from "@/admin/components/ShowTitle";
import { RecordFrameworkProvider } from "@/context/framework.provider";
import { MapAreaProvider } from "@/context/mapArea.provider";

const SiteShow: FC = () => {
  const [isLoadingDelayedJob, setIsLoadingDelayedJob] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");

  return (
    <Show
      title={<ShowTitle moduleName="Site" getTitle={record => record?.name} />}
      actions={<ShowActions titleSource="name" resourceName="site" />}
      className="-mt-[50px] bg-neutral-100"
    >
      <RecordFrameworkProvider>
        <TabbedShowLayout>
          <InformationTab type="sites" />
          <TabbedShowLayout.Tab label="Polygon Review">
            <MapAreaProvider>
              <PolygonReviewTab
                label=""
                type={"sites"}
                setIsLoadingDelayedJob={setIsLoadingDelayedJob!}
                isLoadingDelayedJob={isLoadingDelayedJob!}
                setAlertTitle={setAlertTitle!}
              />
            </MapAreaProvider>
          </TabbedShowLayout.Tab>
          <GalleryTab label="Site Gallery" entity="sites" />
          <DocumentTab label="Site Documents" entity="sites" />
          <ChangeRequestsTab entity="sites" singularEntity="site" />
          <MonitoredTab label="Monitored Data" type={"sites"}></MonitoredTab>
          <AuditLogTab entity={AuditLogButtonStates.SITE} />
        </TabbedShowLayout>
      </RecordFrameworkProvider>
      <DelayedJobsProgressAlert
        show={isLoadingDelayedJob}
        title={alertTitle}
        setIsLoadingDelayedJob={setIsLoadingDelayedJob!}
      />
    </Show>
  );
};

export default SiteShow;
