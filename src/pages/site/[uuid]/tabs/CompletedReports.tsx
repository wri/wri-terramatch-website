import { useT } from "@transifex/react";
import { Else, If, Then } from "react-if";

import EmptyState from "@/components/elements/EmptyState/EmptyState";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import CompletedReportsTable from "@/components/extensive/Tables/CompletedReportsTable";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useGetV2ENTITYUUIDReports } from "@/generated/apiComponents";

interface SiteCompletedReportsTabProps {
  siteUUID: string;
}

const SiteCompletedReportsTab = ({ siteUUID }: SiteCompletedReportsTabProps) => {
  const t = useT();
  const { data: reports, isLoading } = useGetV2ENTITYUUIDReports(
    {
      pathParams: { entity: "sites", uuid: siteUUID }
    },
    {
      keepPreviousData: true
    }
  );

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <LoadingContainer wrapInPaper loading={isLoading}>
            <If condition={reports?.meta?.total === 0}>
              <Then>
                <EmptyState
                  iconProps={{ name: IconNames.DOCUMENT_CIRCLE, className: "fill-success" }}
                  title={t("No Completed Site Reports")}
                  subtitle={t(
                    "This section is where your completed site reports will appear. When you or your team submit a report, it will appear here. You'll be able to track the progress of the review process, stay informed, and manage your reports all in one place."
                  )}
                />
              </Then>
              <Else>
                <PageCard
                  title={t("Completed Site Reports")}
                  subtitle={t(
                    "This is a list of all the reports you have completed for this Site. You can monitor their review process and approval status in this section."
                  )}
                >
                  <CompletedReportsTable modelName="sites" modelUUID={siteUUID} />
                </PageCard>
              </Else>
            </If>
          </LoadingContainer>
        </PageColumn>
      </PageRow>
    </PageBody>
  );
};

export default SiteCompletedReportsTab;
