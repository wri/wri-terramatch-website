import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { Show, TabbedShowLayout, TabbedShowLayoutTabs, useRefresh } from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import AuditLogTab from "@/admin/components/ResourceTabs/AuditLogTab/AuditLogTab";
import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import ChangeRequestsTab from "@/admin/components/ResourceTabs/ChangeRequestsTab/ChangeRequestsTab";
import DocumentTab from "@/admin/components/ResourceTabs/DocumentTab/DocumentTab";
import GalleryTab from "@/admin/components/ResourceTabs/GalleryTab/GalleryTab";
import InformationTab from "@/admin/components/ResourceTabs/InformationTab";
import MonitoredTab from "@/admin/components/ResourceTabs/MonitoredTab/MonitoredTab";
import ShowTitle from "@/admin/components/ShowTitle";
import { RecordFrameworkProvider } from "@/context/framework.provider";
import { usePutV2AdminProjectsUUID } from "@/generated/apiComponents";

const ProjectShow = () => {
  const refresh = useRefresh();
  const queryClient = useQueryClient();
  const { mutate: updateProject } = usePutV2AdminProjectsUUID({
    onSuccess: async (data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["v2", "projects", variables.pathParams.uuid] });
      refresh();
    }
  });

  const toggleTestStatus = useCallback(
    (record: any) => {
      updateProject({ pathParams: { uuid: record.uuid }, body: { is_test: !record.is_test } });
    },
    [updateProject]
  );

  return (
    <Show
      title={<ShowTitle moduleName="Project" getTitle={record => record?.name} />}
      actions={<ShowActions titleSource="name" resourceName="project" toggleTestStatus={toggleTestStatus} />}
      className="-mt-[50px] bg-neutral-100"
    >
      <RecordFrameworkProvider>
        <TabbedShowLayout tabs={<TabbedShowLayoutTabs variant="scrollable" scrollButtons="auto" />}>
          <InformationTab type="projects" />
          <GalleryTab label="Project Gallery" entity="projects" />
          <DocumentTab label="Project Documents" entity="projects" />
          <ChangeRequestsTab entity="projects" singularEntity="project" />
          <MonitoredTab label="Monitored Data" />
          <AuditLogTab entity={AuditLogButtonStates.PROJECT} />
        </TabbedShowLayout>
      </RecordFrameworkProvider>
    </Show>
  );
};

export default ProjectShow;
