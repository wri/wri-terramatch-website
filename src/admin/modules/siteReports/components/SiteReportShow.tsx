import { FC } from "react";
import { Show, TabbedShowLayout } from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import AuditLogTab from "@/admin/components/ResourceTabs/AuditLogTab/AuditLogTab";
import ChangeRequestsTab from "@/admin/components/ResourceTabs/ChangeRequestsTab/ChangeRequestsTab";
import DocumentTab from "@/admin/components/ResourceTabs/DocumentTab/DocumentTab";
import GalleryTab from "@/admin/components/ResourceTabs/GalleryTab/GalleryTab";
import InformationTab from "@/admin/components/ResourceTabs/InformationTab";
import ShowTitle from "@/admin/components/ShowTitle";

const SiteReportShow: FC = () => {
  return (
    <Show
      title={<ShowTitle moduleName="Site Report" getTitle={record => record?.title} />}
      actions={<ShowActions titleSource="title" resourceName="site report" />}
    >
      <TabbedShowLayout>
        <InformationTab type="site-reports" />
        <GalleryTab label="Site Report Gallery" entity="site-reports" />
        <DocumentTab label="Site Report Documents" entity="site-reports" />
        <ChangeRequestsTab entity="site-reports" singularEntity="site-report" />
        <AuditLogTab />
      </TabbedShowLayout>
    </Show>
  );
};

export default SiteReportShow;
