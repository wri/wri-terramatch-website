import { FC } from "react";

import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import { NurseryReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import GoalsAndProgressReportSections from "@/pages/reports/components/GoalsAndProgressReportSections";

interface GoalsAndProgressTabProps {
  nurseryReport: NurseryReportFullDto;
}

const GoalsAndProgressTab: FC<GoalsAndProgressTabProps> = ({ nurseryReport }) => {
  const metrics = {
    treesPlantedCount: 0,
    seedsPlantedCount: 0,
    regeneratedTreesCount: 0
  };

  return (
    <PageBody className="!space-y-10 bg-theme-neutral-200 pt-5 text-darkCustom">
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
