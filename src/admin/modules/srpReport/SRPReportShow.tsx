import { Show, TabbedShowLayout } from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import AuditLogTab from "@/admin/components/ResourceTabs/AuditLogTab/AuditLogTab";
import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import ChangeRequestsTab from "@/admin/components/ResourceTabs/ChangeRequestsTab/ChangeRequestsTab";
import InformationTab from "@/admin/components/ResourceTabs/InformationTab";
import { RecordFrameworkProvider } from "@/context/framework.provider";

const SRPReportShow = () => (
  <Show actions={<ShowActions resourceName="project report" />} className="-mt-[50px] bg-neutral-100">
    <RecordFrameworkProvider>
      <TabbedShowLayout>
        <InformationTab type="project-reports" />
        <ChangeRequestsTab entity="project-reports" singularEntity="project-report" />
        <AuditLogTab entity={AuditLogButtonStates.PROJECT_REPORT} />
      </TabbedShowLayout>
    </RecordFrameworkProvider>
  </Show>
);

export default SRPReportShow;
