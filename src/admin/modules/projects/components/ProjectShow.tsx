import { FC, useCallback } from "react";
import { Show, TabbedShowLayout, TabbedShowLayoutTabs, usePrevious, useRecordContext, useRefresh } from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import AuditLogTab from "@/admin/components/ResourceTabs/AuditLogTab/AuditLogTab";
import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import ChangeRequestsTab from "@/admin/components/ResourceTabs/ChangeRequestsTab/ChangeRequestsTab";
import DocumentTab from "@/admin/components/ResourceTabs/DocumentTab/DocumentTab";
import GalleryTab from "@/admin/components/ResourceTabs/GalleryTab/GalleryTab";
import InformationTab from "@/admin/components/ResourceTabs/InformationTab";
import MonitoredTab from "@/admin/components/ResourceTabs/MonitoredTab/MonitoredTab";
import ReportTab from "@/admin/components/ResourceTabs/ReportTab/ReportTab";
import { useFullProject } from "@/connections/Entity";
import { RecordFrameworkProvider } from "@/context/framework.provider";

const ProjectShowActions: FC = () => {
  const record = useRecordContext();
  if (!record) return null;
  const { uuid, isTest } = record;
  const [, { entityIsUpdating, update }] = useFullProject({ uuid });
  const refresh = useRefresh();
  const wasUpdating = usePrevious(entityIsUpdating);

  if (wasUpdating && !entityIsUpdating) refresh();

  const toggleTestStatus = useCallback(() => update({ isTest: !isTest }), [isTest, update]);

  return <ShowActions resourceName="project" toggleTestStatus={toggleTestStatus} />;
};

const ProjectShow = () => (
  <Show actions={<ProjectShowActions />} className="-mt-[50px] bg-neutral-100">
    <RecordFrameworkProvider>
      <TabbedShowLayout tabs={<TabbedShowLayoutTabs variant="scrollable" scrollButtons="auto" />}>
        <InformationTab type="projects" />
        <ReportTab label="Project Reports" type="projects" />
        <GalleryTab label="Project Gallery" entity="projects" />
        <DocumentTab label="Project Documents" entity="projects" />
        <ChangeRequestsTab entity="projects" singularEntity="project" />
        <MonitoredTab label="Monitored Data" type={"projects"}></MonitoredTab>
        <AuditLogTab entity={AuditLogButtonStates.PROJECT} />
      </TabbedShowLayout>
    </RecordFrameworkProvider>
  </Show>
);

export default ProjectShow;
