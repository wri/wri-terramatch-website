import { useMemo } from "react";

import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { applicationsConnection } from "@/connections/Application";
import { useGetV2MyActions } from "@/generated/apiComponents";
import { useAllPages } from "@/hooks/useConnection";

import ApplicationsCard from "./cards/ApplicationsCard";
import ProjectsCard from "./cards/ProjectsCard";
import ReportsCard from "./cards/ReportsCard";

const PROJECT_TARGETABLE_TYPES = ["Project", "Site", "Nursery"];
const REPORT_TARGETABLE_TYPES = ["ProjectReport", "SiteReport", "NurseryReport", "FinancialReport"];

const ActionTracker = () => {
  const [applicationsLoaded, applications] = useAllPages(applicationsConnection, {});

  const { data: actions, isLoading: isLoadingActions } = useGetV2MyActions({}, { retry: false });

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
    <LoadingContainer loading={!applicationsLoaded || isLoadingActions}>
      <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
        <ApplicationsCard applications={applications} />
        <ProjectsCard actions={projectActions} />
        <ReportsCard actions={reportActions} />
      </div>
    </LoadingContainer>
  );
};

export default ActionTracker;
