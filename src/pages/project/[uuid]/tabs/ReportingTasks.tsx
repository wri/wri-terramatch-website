import { useT } from "@transifex/react";
import { Else, If, Then } from "react-if";

import EmptyState from "@/components/elements/EmptyState/EmptyState";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import ReportingTasksTable from "@/components/extensive/Tables/ReportingTasksTable";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useGetV2ProjectsUUIDTasks } from "@/generated/apiComponents";

interface ReportingTasksProps {
  projectUUID: string;
}

const ReportingTasksTab = ({ projectUUID }: ReportingTasksProps) => {
  const t = useT();
  const { data: reportingTasks, isLoading } = useGetV2ProjectsUUIDTasks(
    {
      pathParams: { uuid: projectUUID }
    },
    { keepPreviousData: true }
  );

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <LoadingContainer wrapInPaper loading={isLoading}>
            <If condition={reportingTasks?.meta?.total === 0}>
              <Then>
                <EmptyState
                  iconProps={{ name: IconNames.DOCUMENT_CIRCLE, className: "fill-success" }}
                  title={t("No reporting tasks")}
                  subtitle={t(
                    "You will find all your reporting tasks here anytime you have a reporting task for your project."
                  )}
                />
              </Then>
              <Else>
                <PageCard
                  title={t("Reporting Tasks")}
                  subtitle={t(
                    "This is a list of your reporting tasks for this project. Please ensure that you review the submission status and complete all reports that are both due and overdue."
                  )}
                >
                  <ReportingTasksTable projectUUID={projectUUID} />
                </PageCard>
              </Else>
            </If>
          </LoadingContainer>
        </PageColumn>
      </PageRow>
      <br />
      <br />
    </PageBody>
  );
};

export default ReportingTasksTab;
