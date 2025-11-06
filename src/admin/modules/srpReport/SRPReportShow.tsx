import { Show, TabbedShowLayout } from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import AuditLogTab from "@/admin/components/ResourceTabs/AuditLogTab/AuditLogTab";
import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import ChangeRequestsTab from "@/admin/components/ResourceTabs/ChangeRequestsTab/ChangeRequestsTab";
import InformationTab from "@/admin/components/ResourceTabs/InformationTab";
import { RecordFrameworkProvider } from "@/context/framework.provider";

const SRPReportShow = () => (
  <Show actions={<ShowActions resourceName="srp report" />} className="-mt-[50px] bg-neutral-100">
    <RecordFrameworkProvider>
      <TabbedShowLayout>
        <InformationTab type="srp-reports" />
        <ChangeRequestsTab entity="srp-reports" singularEntity="srp-report" />
        <AuditLogTab entity={AuditLogButtonStates.SRP_REPORT - 1} singularEntity="srp-report" />
      </TabbedShowLayout>
    </RecordFrameworkProvider>
  </Show>
);

export default SRPReportShow;
