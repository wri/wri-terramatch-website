import { useT } from "@transifex/react";
import { FC } from "react";

import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import { NurseryReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import GoalsAndProgressReportEntityTab from "@/pages/reports/components/GoalsAndProgressReportEntityTab";
import GoalsAndProgressReportSections from "@/pages/reports/components/GoalsAndProgressReportSections";

interface GoalsAndProgressTabProps {
  nurseryReport: NurseryReportFullDto;
}

const GoalsAndProgressTab: FC<GoalsAndProgressTabProps> = ({ nurseryReport }) => {
  const t = useT();

  const metrics = {
    treesPlantedCount: 0,
    seedsPlantedCount: 0,
    regeneratedTreesCount: 0,
    seedlingsGrown: nurseryReport.seedlingsYoungTrees ?? 0
  };

  return (
    <PageBody className="!space-y-10 bg-theme-neutral-200 pt-5 text-darkCustom">
      <PageRow className="mx-0 w-full !max-w-full px-6">
        <PageCard title={t("Key Indicators & Insights")}>
          <GoalsAndProgressReportEntityTab
            entity="nurseryReports"
            entityUuid={nurseryReport.uuid}
            frameworkKey={nurseryReport.frameworkKey}
            metrics={metrics}
          />
        </PageCard>
      </PageRow>

      <GoalsAndProgressReportSections
        entity="nurseryReports"
        entityUuid={nurseryReport.uuid}
        frameworkKey={nurseryReport.frameworkKey}
        metrics={metrics}
        reportingPeriodDate={nurseryReport.dueAt ?? nurseryReport.submittedAt}
        seedlingOnly
      />

      <br />
      <br />
    </PageBody>
  );
};

export default GoalsAndProgressTab;
