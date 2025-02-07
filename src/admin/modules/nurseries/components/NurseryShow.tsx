import { Show, TabbedShowLayout } from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import AuditLogTab from "@/admin/components/ResourceTabs/AuditLogTab/AuditLogTab";
import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import ChangeRequestsTab from "@/admin/components/ResourceTabs/ChangeRequestsTab/ChangeRequestsTab";
import DocumentTab from "@/admin/components/ResourceTabs/DocumentTab/DocumentTab";
import GalleryTab from "@/admin/components/ResourceTabs/GalleryTab/GalleryTab";
import InformationTab from "@/admin/components/ResourceTabs/InformationTab";
import { RecordFrameworkProvider } from "@/context/framework.provider";

const NurseryShow = () => (
  <Show actions={<ShowActions resourceName="nursery" />} className="-mt-[50px] bg-neutral-100">
    <RecordFrameworkProvider>
      <TabbedShowLayout>
        <InformationTab type="nurseries" />
        <GalleryTab label="Nursery Gallery" entity="nurseries" />
        <DocumentTab label="Nursery Documents" entity="nurseries" />
        <ChangeRequestsTab entity="nurseries" singularEntity="nursery" />
        <AuditLogTab entity={AuditLogButtonStates.NURSERY} />
      </TabbedShowLayout>
    </RecordFrameworkProvider>
  </Show>
);

export default NurseryShow;
