import { FC, useState } from "react";
import { Show, TabbedShowLayout } from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import AuditLogTab from "@/admin/components/ResourceTabs/AuditLogTab/AuditLogTab";
import ChangeRequestsTab from "@/admin/components/ResourceTabs/ChangeRequestsTab/ChangeRequestsTab";
import DocumentTab from "@/admin/components/ResourceTabs/DocumentTab/DocumentTab";
import GalleryTab from "@/admin/components/ResourceTabs/GalleryTab/GalleryTab";
import InformationTab from "@/admin/components/ResourceTabs/InformationTab";
import PolygonReviewTab from "@/admin/components/ResourceTabs/PolygonReviewTab";
import PolygonDrawer from "@/admin/components/ResourceTabs/PolygonReviewTab/components/PolygonDrawer/PolygonDrawer";
import ShowTitle from "@/admin/components/ShowTitle";
import Drawer from "@/components/elements/Drawer/Drawer";

const SiteShow: FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Show
      title={<ShowTitle moduleName="Site" getTitle={record => record?.name} />}
      actions={<ShowActions titleSource="name" resourceName="site" />}
      className="-mt-[50px] bg-neutral-100"
    >
      <Drawer isOpen={isOpen} setIsOpen={setIsOpen}>
        <PolygonDrawer />
      </Drawer>
      <TabbedShowLayout>
        <InformationTab type="sites" />
        <PolygonReviewTab label="Polygon Validation" type={"sites"} />
        <GalleryTab label="Site Gallery" entity="sites" />
        <DocumentTab label="Site Documents" entity="sites" />
        <ChangeRequestsTab entity="sites" singularEntity="site" />
        <TabbedShowLayout.Tab label="Monitored Data">In Progress</TabbedShowLayout.Tab>
        <AuditLogTab />
      </TabbedShowLayout>
    </Show>
  );
};

export default SiteShow;
