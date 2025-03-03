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
import { RecordFrameworkProvider } from "@/context/framework.provider";
import { usePutV2AdminProjectsUUID } from "@/generated/apiComponents";
import ApiSlice from "@/store/apiSlice";

const ProjectShow = () => {
  const refresh = useRefresh();
  const { mutate: updateProject } = usePutV2AdminProjectsUUID({
    onSuccess: async (data, variables) => {
      // Temporary until the entity update goes through v3. Then the prune isn't needed, and the
      // refetch() will pull the updated resource from the store without an API request.
      ApiSlice.pruneCache("projects", [variables.pathParams.uuid]);
      refresh();
    }
  });

  const toggleTestStatus = useCallback(
    (record: any) => {
      updateProject({ pathParams: { uuid: record.uuid }, body: { is_test: !record.isTest } });
    },
    [updateProject]
  );

  return (
    <Show
      actions={<ShowActions resourceName="project" toggleTestStatus={toggleTestStatus} />}
      className="-mt-[50px] bg-neutral-100"
    >
      <RecordFrameworkProvider>
        <TabbedShowLayout tabs={<TabbedShowLayoutTabs variant="scrollable" scrollButtons="auto" />}>
          <InformationTab type="projects" />
          <GalleryTab label="Project Gallery" entity="projects" />
          <DocumentTab label="Project Documents" entity="projects" />
          <ChangeRequestsTab entity="projects" singularEntity="project" />
          <MonitoredTab label="Monitored Data" type={"projects"}></MonitoredTab>
          <AuditLogTab entity={AuditLogButtonStates.PROJECT} />
        </TabbedShowLayout>
      </RecordFrameworkProvider>
    </Show>
  );
};

export default ProjectShow;
