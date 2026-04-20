import { useMemo } from "react";

import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useActions } from "@/connections/Action";
import { applicationsConnection } from "@/connections/Application";
import { useAllPages } from "@/hooks/useConnection";

import ApplicationsCard from "./cards/ApplicationsCard";
import ProjectsCard from "./cards/ProjectsCard";
import ReportsCard from "./cards/ReportsCard";

const PROJECT_TARGETABLE_TYPES = ["projects"];
const REPORT_TARGETABLE_TYPES = ["projectReports", "siteReports", "nurseryReports"];

const ActionTracker = () => {
  const [applicationsLoaded, applications] = useAllPages(applicationsConnection, {
    sortField: "updatedAt",
    sortDirection: "DESC"
  });

  const [, { data: actions, isLoading: isLoadingActions }] = useActions({});

  const reportActions = useMemo(
    () =>
      actions?.filter(item => {
        return REPORT_TARGETABLE_TYPES.some(type => item.targetableType == type);
      }),
    [actions]
  );

  const projectActions = useMemo(
    () =>
      actions?.filter(item => {
        return PROJECT_TARGETABLE_TYPES.some(type => item.targetableType == type);
      }),
    [actions]
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
