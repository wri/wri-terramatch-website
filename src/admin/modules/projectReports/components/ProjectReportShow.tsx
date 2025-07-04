import { Show, TabbedShowLayout } from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import AuditLogTab from "@/admin/components/ResourceTabs/AuditLogTab/AuditLogTab";
import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import ChangeRequestsTab from "@/admin/components/ResourceTabs/ChangeRequestsTab/ChangeRequestsTab";
import DocumentTab from "@/admin/components/ResourceTabs/DocumentTab/DocumentTab";
import GalleryTab from "@/admin/components/ResourceTabs/GalleryTab/GalleryTab";
import InformationTab from "@/admin/components/ResourceTabs/InformationTab";
import { RecordFrameworkProvider } from "@/context/framework.provider";

const ProjectReportShow = () => (
  <Show actions={<ShowActions resourceName="project report" />} className="-mt-[50px] bg-neutral-100">
    <RecordFrameworkProvider>
      <TabbedShowLayout>
        <InformationTab type="project-reports" />
        <GalleryTab label="Project Report Gallery" entity="projectReports" />
        <DocumentTab label="Project Report Documents" entity="projectReports" />
        <ChangeRequestsTab entity="project-reports" singularEntity="project-report" />
        <AuditLogTab entity={AuditLogButtonStates.PROJECT_REPORT} />
      </TabbedShowLayout>
    </RecordFrameworkProvider>
  </Show>
);

export default ProjectReportShow;
