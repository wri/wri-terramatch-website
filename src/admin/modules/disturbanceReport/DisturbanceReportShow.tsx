import { Show, TabbedShowLayout } from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import AuditLogTab from "@/admin/components/ResourceTabs/AuditLogTab/AuditLogTab";
import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import ChangeRequestsTab from "@/admin/components/ResourceTabs/ChangeRequestsTab/ChangeRequestsTab";
import InformationTab from "@/admin/components/ResourceTabs/InformationTab";
import { RecordFrameworkProvider } from "@/context/framework.provider";

const DisturbanceReportShow = () => (
  <Show actions={<ShowActions resourceName="disturbance report" />} className="-mt-[50px] bg-neutral-100">
    <RecordFrameworkProvider>
      <TabbedShowLayout>
        <InformationTab type="disturbance-reports" title="Disturbance Report" />
        <ChangeRequestsTab entity="disturbance-reports" singularEntity="disturbance-report" />
        <AuditLogTab entity={AuditLogButtonStates.DISTURBANCE_REPORT} />
      </TabbedShowLayout>
    </RecordFrameworkProvider>
  </Show>
);

export default DisturbanceReportShow;
