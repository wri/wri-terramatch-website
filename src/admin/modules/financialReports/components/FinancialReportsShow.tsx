import { Show, TabbedShowLayout } from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import DocumentTab from "@/admin/components/ResourceTabs/DocumentTab/DocumentTab";
import GalleryTab from "@/admin/components/ResourceTabs/GalleryTab/GalleryTab";
import HistoryTab from "@/admin/components/ResourceTabs/HistoryTab/HistoryTab";
import InformationTab from "@/admin/components/ResourceTabs/InformationTab";
import Button from "@/components/elements/Button/Button";
import { RecordFrameworkProvider } from "@/context/framework.provider";

const FinancialReportsShow = () => (
  <Show actions={<ShowActions resourceName="financial report" />} className="-mt-[50px] bg-neutral-100">
    <div className="flex">
      <RecordFrameworkProvider>
        <TabbedShowLayout>
          <InformationTab type="financial-reports" />
          <HistoryTab label="Financial History" entity={"financial-reports"} />
          <GalleryTab label="Community Engagement" entity="financialReport" />
          <DocumentTab label="Restoration Experience" entity="financialReport" />
        </TabbedShowLayout>
      </RecordFrameworkProvider>
      <div className="bg-white">
        <header className="border-b border-neutral-200 py-3 text-lg font-semibold">Organization Review</header>
        <div className="grid grid-cols-2 gap-4 p-4">
          <div className="flex flex-col gap-2">
            <span>Name</span>
            <span className="font-medium">EXOTIC EPZ LIMITED</span>
          </div>
          <div className="flex flex-col gap-2">
            <span>Type</span>
            <span className="font-medium">For-Profit Organization</span>
          </div>
          <div className="flex flex-col gap-2">
            <span>Status</span>
            <span className="font-medium">Approved</span>
          </div>
        </div>
        <footer className="flex gap-4 pb-4">
          <Button>Approve</Button>
          <Button variant="white-page-admin">Reject</Button>
        </footer>
      </div>
    </div>
  </Show>
);

export default FinancialReportsShow;
