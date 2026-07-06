import { Show, TabbedShowLayout } from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import AuditLogTab from "@/admin/components/ResourceTabs/AuditLogTab/AuditLogTab";
import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import ChangeRequestsTab from "@/admin/components/ResourceTabs/ChangeRequestsTab/ChangeRequestsTab";
import DocumentTab from "@/admin/components/ResourceTabs/DocumentTab/DocumentTab";
import GalleryTab from "@/admin/components/ResourceTabs/GalleryTab/GalleryTab";
import InformationTab from "@/admin/components/ResourceTabs/InformationTab";
import MonitoredTab from "@/admin/components/ResourceTabs/MonitoredTab/MonitoredTab";
import PolygonReviewLauncher from "@/admin/sitePolygonReview/PolygonReviewLauncher";
import { RecordFrameworkProvider } from "@/context/framework.provider";

const SiteShow = () => (
  <Show actions={<ShowActions resourceName="site" />} className="-mt-[50px] bg-neutral-100">
    <RecordFrameworkProvider>
      <TabbedShowLayout>
        <InformationTab type="sites" />
        <TabbedShowLayout.Tab label="Polygon Review">
          <PolygonReviewLauncher />
        </TabbedShowLayout.Tab>
        <GalleryTab label="Site Gallery" entity="sites" />
        <DocumentTab label="Site Documents" entity="sites" />
        <ChangeRequestsTab entity="sites" singularEntity="site" />
        <MonitoredTab label="Monitored Data" type={"sites"}></MonitoredTab>
        <AuditLogTab entity={AuditLogButtonStates.SITE} />
      </TabbedShowLayout>
    </RecordFrameworkProvider>
  </Show>
);

export default SiteShow;
