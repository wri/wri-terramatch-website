import { Show } from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import HistoryTab from "@/admin/components/ResourceTabs/HistoryTab/HistoryTab";
import { RecordFrameworkProvider } from "@/context/framework.provider";

import { OrganisationShowAside } from "../../organisations/components/OrganisationShowAside";
const FinancialReportsShow = () => {
  return (
    <Show
      actions={<ShowActions resourceName="financial report" />}
      aside={<OrganisationShowAside financialReportTab={true} />}
      className="-mt-[50px] bg-neutral-100"
    >
      <RecordFrameworkProvider>
        <HistoryTab label="Financial History" entity="financial-reports" />
      </RecordFrameworkProvider>
    </Show>
  );
};

export default FinancialReportsShow;
