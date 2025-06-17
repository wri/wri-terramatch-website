import { Show, TabbedShowLayout } from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import DocumentTab from "@/admin/components/ResourceTabs/DocumentTab/DocumentTab";
import GalleryTab from "@/admin/components/ResourceTabs/GalleryTab/GalleryTab";
import HistoryTab from "@/admin/components/ResourceTabs/HistoryTab/HistoryTab";
import InformationTab from "@/admin/components/ResourceTabs/InformationTab";
import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
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
      <div className="bg-white pr-1">
        <header className="flex h-[calc(3rem+1px)] items-center border-b border-neutral-200 pl-4 text-lg font-semibold">
          Organization Review
        </header>
        <div className="grid grid-cols-2 gap-4 p-4">
          <div className="flex flex-col gap-0">
            <Text variant="text-14-light" className="text-darkCustom-300">
              Name
            </Text>
            <Text variant="text-14">EXOTIC EPZ LIMITED</Text>
          </div>
          <div className="flex flex-col gap-0">
            <Text variant="text-14-light" className="text-darkCustom-300">
              Type
            </Text>
            <Text variant="text-14">For-Profit Organization</Text>
          </div>
          <div className="flex flex-col gap-0">
            <Text variant="text-14-light" className="text-darkCustom-300">
              Status
            </Text>
            <Text variant="text-14">Approved</Text>
          </div>
        </div>
        <footer className="flex gap-4 pb-4 pl-4">
          <Button>Approve</Button>
          <Button variant="white-page-admin" className="text-black ">
            Reject
          </Button>
        </footer>
      </div>
    </div>
  </Show>
);

export default FinancialReportsShow;
