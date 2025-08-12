import { useT } from "@transifex/react";
import { Else, If, Then } from "react-if";

import EmptyState from "@/components/elements/EmptyState/EmptyState";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import CompletedReportsTable from "@/components/extensive/Tables/CompletedReportsTable";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

interface SiteCompletedReportsTabProps {
  site: SiteFullDto;
}

const SiteCompletedReportsTab = ({ site }: SiteCompletedReportsTabProps) => {
  const t = useT();

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <If condition={site.totalSiteReports === 0}>
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
                <CompletedReportsTable modelName="sites" modelUUID={site.uuid} />
              </PageCard>
            </Else>
          </If>
        </PageColumn>
      </PageRow>
      <br />
      <br />
    </PageBody>
  );
};

export default SiteCompletedReportsTab;
