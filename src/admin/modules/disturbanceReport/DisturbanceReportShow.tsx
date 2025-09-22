import { Show, TabbedShowLayout } from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import InformationTab from "@/admin/components/ResourceTabs/InformationTab";
import { RecordFrameworkProvider } from "@/context/framework.provider";

const DisturbanceReportShow = () => (
  <Show actions={<ShowActions resourceName="disturbance report" />} className="-mt-[50px] bg-neutral-100">
    <RecordFrameworkProvider>
      <TabbedShowLayout>
        <InformationTab type="disturbance-reports" title="Disturbance Report" />
      </TabbedShowLayout>
    </RecordFrameworkProvider>
  </Show>
);

export default DisturbanceReportShow;
