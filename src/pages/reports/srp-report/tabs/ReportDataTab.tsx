import { useT } from "@transifex/react";
import { Fragment } from "react";

import DemographicsDisplay from "@/components/extensive/DemographicsCollapseGrid/DemographicsDisplay";
import useCollectionsTotal from "@/components/extensive/DemographicsCollapseGrid/hooks";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageColumn from "@/components/extensive/PageElements/Column/PageColumn";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import Loader from "@/components/generic/Loading/Loader";
import { DemographicCollections } from "@/generated/v3/entityService/entityServiceConstants";
import { SrpReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

interface SocioEconomicReportDataTabProps {
  report: SrpReportFullDto;
}

const ReportDataTab = ({ report }: SocioEconomicReportDataTabProps) => {
  const t = useT();

  const demographicsTotal = useCollectionsTotal({
    entity: "srpReports",
    uuid: report.uuid,
    demographicType: "restorationPartners",
    collections: DemographicCollections.RESTORATION_PARTNERS_PROJECT
  });
  if (demographicsTotal == null) {
    return (
      <PageCard>
        <Loader />
      </PageCard>
    );
  }

  return (
    <PageBody>
      <PageRow>
        <PageColumn>
          <PageCard title={t(`Restoration Partners by Impact Category - ${demographicsTotal}`)} gap={8}>
            {DemographicCollections.RESTORATION_PARTNERS_PROJECT.map(collection => (
              <Fragment key={collection}>
                <DemographicsDisplay
                  entity="srpReports"
                  uuid={report.uuid}
                  type="restorationPartners"
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
