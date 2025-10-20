import { useT } from "@transifex/react";
import { Fragment } from "react";

import TextField from "@/components/elements/Field/TextField";
import DemographicsDisplay from "@/components/extensive/DemographicsCollapseGrid/DemographicsDisplay";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import { DemographicCollections } from "@/generated/v3/entityService/entityServiceConstants";

interface SocioEconomicReportDataTabProps {
  report: any;
}

const ReportDataTab = ({ report }: SocioEconomicReportDataTabProps) => {
  const t = useT();

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <PageCard title={t("Project Report Partners - 174")} gap={8}>
            {DemographicCollections.WORKDAYS_SITE.map(collection => (
              <Fragment key={collection}>
                {collection === DemographicCollections.WORKDAYS_SITE_OTHER && (
                  <TextField label={t("Other Activities Description")} value={report?.paidOtherActivityDescription!} />
                )}
                <DemographicsDisplay
                  entity="projectReports"
                  uuid={report.uuid}
                  type="workdays"
                  collection={collection}
                />
              </Fragment>
            ))}
          </PageCard>
        </PageColumn>
      </PageRow>
    </PageBody>
  );
};

export default ReportDataTab;
