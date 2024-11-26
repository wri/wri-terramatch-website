import { FC } from "react";
import { Show, TabbedShowLayout } from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import AuditLogTab from "@/admin/components/ResourceTabs/AuditLogTab/AuditLogTab";
import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import ChangeRequestsTab from "@/admin/components/ResourceTabs/ChangeRequestsTab/ChangeRequestsTab";
import DocumentTab from "@/admin/components/ResourceTabs/DocumentTab/DocumentTab";
import GalleryTab from "@/admin/components/ResourceTabs/GalleryTab/GalleryTab";
import InformationTab from "@/admin/components/ResourceTabs/InformationTab";
import ShowTitle from "@/admin/components/ShowTitle";
import { RecordFrameworkProvider } from "@/context/framework.provider";

const NurseryReportShow: FC = () => {
  return (
    <Show
      title={<ShowTitle moduleName="Nursery Report" getTitle={record => record?.title} />}
      actions={<ShowActions titleSource="title" resourceName="nursery report" />}
      className="-mt-[50px] bg-neutral-100"
    >
      <RecordFrameworkProvider>
        <TabbedShowLayout>
          <InformationTab type="nursery-reports" />
          <GalleryTab label="Nursery Report Gallery" entity="nursery-reports" />
          <DocumentTab label="Nursery Report Documents" entity="nursery-reports" />
          <ChangeRequestsTab entity="nursery-reports" singularEntity="nursery-report" />
          <AuditLogTab entity={AuditLogButtonStates.NURSERY_REPORT} />
        </TabbedShowLayout>
      </RecordFrameworkProvider>
    </Show>
  );
};

export default NurseryReportShow;
