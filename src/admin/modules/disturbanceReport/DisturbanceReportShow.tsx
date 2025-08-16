import { Show, TabbedShowLayout } from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import { RecordFrameworkProvider } from "@/context/framework.provider";

import ReportedData from "./components/ReportedData";
import ReportedDataAside from "./components/ReportedDataAside";

const DisturbanceReportShow = () => (
  <Show
    actions={<ShowActions resourceName="site" />}
    aside={<ReportedDataAside />}
    className="-mt-[50px] bg-neutral-100"
  >
    <RecordFrameworkProvider>
      <TabbedShowLayout>
        <TabbedShowLayout.Tab label="Disturbance Report">
          <ReportedData />
        </TabbedShowLayout.Tab>
      </TabbedShowLayout>
    </RecordFrameworkProvider>
  </Show>
);

export default DisturbanceReportShow;
