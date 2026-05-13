import { useT } from "@transifex/react";
import { FC } from "react";

import EmptyState from "@/components/elements/EmptyState/EmptyState";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import CompletedReportsTable from "@/components/extensive/Tables/CompletedReportsTable";
import { NurseryFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

interface ReportingTasksProps {
  nursery: NurseryFullDto;
}

const CompletedReportsTab: FC<ReportingTasksProps> = ({ nursery }) => {
  const t = useT();

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          {nursery.nurseryReportsTotal === 0 ? (
            <EmptyState
              iconProps={{ name: IconNames.DOCUMENT_CIRCLE, className: "fill-success" }}
              title={t("No Completed Nursery Reports")}
              subtitle={t(
                "This section is where your nursery completed reports will appear. When you or your team submit a report, it will appear here. You'll be able to track the progress of the review process, stay informed, and manage your reports all in one place."
              )}
            />
          ) : (
            <PageCard
              title={t("Completed Nursery Reports ({count})", { count: nursery.nurseryReportsTotal ?? 0 })}
              subtitle={t(
                "This is a list of all the reports you have completed for this Nursery. You can monitor their review process and approval status in this section."
              )}
            >
              <CompletedReportsTable modelName="nurseries" modelUUID={nursery.uuid} />
            </PageCard>
          )}
        </PageColumn>
      </PageRow>
      <br />
      <br />
    </PageBody>
  );
};

export default CompletedReportsTab;
