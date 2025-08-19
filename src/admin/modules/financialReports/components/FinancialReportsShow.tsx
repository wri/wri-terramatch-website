import { Show, TabbedShowLayout } from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import ChangeRequestsTab from "@/admin/components/ResourceTabs/ChangeRequestsTab/ChangeRequestsTab";
import HistoryTab from "@/admin/components/ResourceTabs/HistoryTab/HistoryTab";
import InformationTab from "@/admin/components/ResourceTabs/InformationTab";
import { RecordFrameworkProvider } from "@/context/framework.provider";
const FinancialReportsShow = () => {
  return (
    <Show actions={<ShowActions resourceName="financial report" />} className="-mt-[50px] bg-neutral-100">
      <RecordFrameworkProvider>
        <TabbedShowLayout>
          <InformationTab type="financial-reports" title="Financial History" />
          <HistoryTab label="Financial History" entity="financial-reports" />
          <ChangeRequestsTab entity="financial-reports" singularEntity="financial-report" />
        </TabbedShowLayout>
      </RecordFrameworkProvider>
    </Show>
  );
};

export default FinancialReportsShow;
