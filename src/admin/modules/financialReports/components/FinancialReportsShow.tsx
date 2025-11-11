import { Show, TabbedShowLayout } from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import ChangeRequestsTab from "@/admin/components/ResourceTabs/ChangeRequestsTab/ChangeRequestsTab";
import InformationTab from "@/admin/components/ResourceTabs/InformationTab";
import { RecordFrameworkProvider } from "@/context/framework.provider";

const FinancialReportsShow = () => (
  <Show actions={<ShowActions resourceName="financial report" />} className="-mt-[50px] bg-neutral-100">
    <RecordFrameworkProvider>
      <TabbedShowLayout>
        <InformationTab type="financial-reports" title="Financial History" />
        <ChangeRequestsTab entity="financialReports" singularEntity="financial-report" />
      </TabbedShowLayout>
    </RecordFrameworkProvider>
  </Show>
);

export default FinancialReportsShow;
