import { FC } from "react";
import { Show, TabbedShowLayout, TabbedShowLayoutTabs } from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import AuditLogTab from "@/admin/components/ResourceTabs/AuditLogTab/AuditLogTab";
import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import ChangeRequestsTab from "@/admin/components/ResourceTabs/ChangeRequestsTab/ChangeRequestsTab";
import DocumentTab from "@/admin/components/ResourceTabs/DocumentTab/DocumentTab";
import GalleryTab from "@/admin/components/ResourceTabs/GalleryTab/GalleryTab";
import InformationTab from "@/admin/components/ResourceTabs/InformationTab";
import ShowTitle from "@/admin/components/ShowTitle";
import { RecordFrameworkProvider } from "@/context/framework.provider";

const ProjectShow: FC = () => {
  return (
    <Show
      title={<ShowTitle moduleName="Project" getTitle={record => record?.name} />}
      actions={<ShowActions titleSource="name" resourceName="project" />}
      className="-mt-[50px] bg-neutral-100"
    >
      <RecordFrameworkProvider>
        <TabbedShowLayout tabs={<TabbedShowLayoutTabs variant="scrollable" scrollButtons="auto" />}>
          <InformationTab type="projects" />
          <GalleryTab label="Project Gallery" entity="projects" />
          <DocumentTab label="Project Documents" entity="projects" />
          <ChangeRequestsTab entity="projects" singularEntity="project" />
          <TabbedShowLayout.Tab label="Monitored Data">In Progress</TabbedShowLayout.Tab>
          <AuditLogTab entity={AuditLogButtonStates.PROJECT} />
        </TabbedShowLayout>
      </RecordFrameworkProvider>
    </Show>
  );
};

export default ProjectShow;
