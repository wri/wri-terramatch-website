import { useT } from "@transifex/react";
import { Else, If, Then } from "react-if";

import EmptyState from "@/components/elements/EmptyState/EmptyState";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import CompletedReportsTable from "@/components/extensive/Tables/CompletedReportsTable";
import { useGetV2ENTITYUUIDReports } from "@/generated/apiComponents";

interface ReportingTasksProps {
  nursery: any;
}

const CompletedReportsTab = ({ nursery }: ReportingTasksProps) => {
  const t = useT();
  const { data: reports, isLoading } = useGetV2ENTITYUUIDReports(
    {
      pathParams: { entity: "nurseries", uuid: nursery.uuid }
    },
    {
      keepPreviousData: true
    }
  );

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <If condition={isLoading || reports?.meta?.total === 0}>
            <Then>
              <EmptyState
                iconProps={{ name: IconNames.DOCUMENT_CIRCLE, className: "fill-success" }}
                title={t("No Completed Nursery Reports")}
                subtitle={t(
                  "This section is where your nursery completed reports will appear. When you or your team submit a report, it will appear here. You'll be able to track the progress of the review process, stay informed, and manage your reports all in one place."
                )}
              />
            </Then>
            <Else>
              <PageCard
                title={t("Completed Nursery Reports ({count})", { count: reports?.meta?.total ?? 0 })}
                subtitle={t(
                  "This is a list of all the reports you have completed for this Nursery. You can monitor their review process and approval status in this section."
                )}
              >
                <CompletedReportsTable modelName="nurseries" modelUUID={nursery.uuid} />
              </PageCard>
            </Else>
          </If>
        </PageColumn>
      </PageRow>
    </PageBody>
  );
};

export default CompletedReportsTab;
