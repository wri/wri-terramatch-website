import { useMemo } from "react";

import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useGetV2MyActions, useGetV2MyApplications } from "@/generated/apiComponents";
import { ApplicationLiteRead } from "@/generated/apiSchemas";

import ApplicationsCard from "./cards/ApplicationsCard";
import ProjectsCard from "./cards/ProjectsCard";
import ReportsCard from "./cards/ReportsCard";

const PROJECT_TARGETABLE_TYPES = ["Project", "Site", "Nursery"];
const REPORT_TARGETABLE_TYPES = ["ProjectReport", "SiteReport", "NurseryReport"];

const ActionTracker = () => {
  // Queries
  const { data: myApplications, isLoading: isLoadingApplications } = useGetV2MyApplications<{
    data: ApplicationLiteRead[];
  }>({
    queryParams: {
      page: 1,
      per_page: 1000
    }
  });

  const { data: actions, isLoading: isLoadingActions } = useGetV2MyActions({});

  const reportActions = useMemo(
    () =>
      actions?.data?.filter(item => {
        return REPORT_TARGETABLE_TYPES.some(type => item.targetable_type === type);
      }),
    [actions?.data]
  );

  const projectActions = useMemo(
    () =>
      actions?.data?.filter(item => {
        return PROJECT_TARGETABLE_TYPES.some(type => item.targetable_type === type);
      }),
    [actions?.data]
  );

  return (
    <LoadingContainer loading={isLoadingApplications || isLoadingActions}>
      <div className="grid-cols-1 md:grid-cols-3 grid w-full gap-8">
        <ApplicationsCard applications={myApplications?.data} />
        <ProjectsCard actions={projectActions} />
        <ReportsCard actions={reportActions} />
      </div>
    </LoadingContainer>
  );
};

export default ActionTracker;
