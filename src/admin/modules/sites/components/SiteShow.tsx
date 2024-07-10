import { FC } from "react";
import { Show, TabbedShowLayout } from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import AuditLogTab from "@/admin/components/ResourceTabs/AuditLogTab/AuditLogTab";
import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import ChangeRequestsTab from "@/admin/components/ResourceTabs/ChangeRequestsTab/ChangeRequestsTab";
import DocumentTab from "@/admin/components/ResourceTabs/DocumentTab/DocumentTab";
import GalleryTab from "@/admin/components/ResourceTabs/GalleryTab/GalleryTab";
import InformationTab from "@/admin/components/ResourceTabs/InformationTab";
import PolygonReviewTab from "@/admin/components/ResourceTabs/PolygonReviewTab";
import ShowTitle from "@/admin/components/ShowTitle";
import { MapAreaProvider } from "@/context/mapArea.provider";

const SiteShow: FC = () => {
  return (
    <Show
      title={<ShowTitle moduleName="Site" getTitle={record => record?.name} />}
      actions={<ShowActions titleSource="name" resourceName="site" />}
      className="-mt-[50px] bg-neutral-100"
    >
      <TabbedShowLayout>
        <InformationTab type="sites" />
        <TabbedShowLayout.Tab label="Polygon Review">
          <MapAreaProvider>
            <PolygonReviewTab label="" type={"sites"} />
          </MapAreaProvider>
        </TabbedShowLayout.Tab>
        <GalleryTab label="Site Gallery" entity="sites" />
        <DocumentTab label="Site Documents" entity="sites" />
        <ChangeRequestsTab entity="sites" singularEntity="site" />
        <TabbedShowLayout.Tab label="Monitored Data">In Progress</TabbedShowLayout.Tab>
        <AuditLogTab entity={AuditLogButtonStates.SITE} />
      </TabbedShowLayout>
    </Show>
  );
};

export default SiteShow;
