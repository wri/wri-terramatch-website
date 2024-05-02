import { FC } from "react";
import { Show, TabbedShowLayout } from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import AuditLogSiteTab from "@/admin/components/ResourceTabs/AuditLogTab/AuditLogSiteTab";
import ChangeRequestsTab from "@/admin/components/ResourceTabs/ChangeRequestsTab/ChangeRequestsTab";
import DocumentTab from "@/admin/components/ResourceTabs/DocumentTab/DocumentTab";
import GalleryTab from "@/admin/components/ResourceTabs/GalleryTab/GalleryTab";
import InformationTab from "@/admin/components/ResourceTabs/InformationTab";
import PolygonReviewTab from "@/admin/components/ResourceTabs/PolygonReviewTab";
import ShowTitle from "@/admin/components/ShowTitle";

const SiteShow: FC = () => {
  return (
    <Show
      title={<ShowTitle moduleName="Site" getTitle={record => record?.name} />}
      actions={<ShowActions titleSource="name" resourceName="site" />}
      className="-mt-[50px] bg-neutral-100"
    >
      <TabbedShowLayout>
        <TabbedShowLayout.Tab label="Site Information">
          <InformationTab type="sites" />
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab label="Polygon Review">
          <PolygonReviewTab label="" type={"sites"} />
        </TabbedShowLayout.Tab>
        <GalleryTab label="Site Gallery" entity="sites" />
        <DocumentTab label="Site Documents" entity="sites" />
        <ChangeRequestsTab entity="sites" singularEntity="site" />
        <TabbedShowLayout.Tab label="Monitored Data">In Progress</TabbedShowLayout.Tab>
        <AuditLogSiteTab />
      </TabbedShowLayout>
    </Show>
  );
};

export default SiteShow;
