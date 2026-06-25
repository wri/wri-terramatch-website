import { useT } from "@transifex/react";
import { FC } from "react";

import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import { ProjectFullDto, ProjectReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import GoalsAndProgressReportEntityTab from "@/pages/reports/components/GoalsAndProgressReportEntityTab";
import GoalsAndProgressReportSections from "@/pages/reports/components/GoalsAndProgressReportSections";

interface GoalsAndProgressProps {
  projectReport: ProjectReportFullDto;
  project?: ProjectFullDto | null;
}

const GoalsAndProgressTab: FC<GoalsAndProgressProps> = ({ projectReport, project }) => {
  const t = useT();

  const metrics = {
    treesPlantedCount: projectReport.treesPlantedCount ?? 0,
    seedsPlantedCount: projectReport.seedsPlantedCount ?? 0,
    regeneratedTreesCount: projectReport.regeneratedTreesCount ?? 0,
    pctSurvivalToDate: projectReport.pctSurvivalToDate,
    seedlingsGrown: projectReport.seedlingsGrown
  };

  return (
    <PageBody className="bg-theme-neutral-200 pt-5 text-darkCustom">
      <PageRow className="mx-0 w-full !max-w-full px-6">
        <PageCard title={t("Indicators & Insights")}>
          <GoalsAndProgressReportEntityTab
            entity="projectReports"
            entityUuid={projectReport.uuid}
            frameworkKey={projectReport.frameworkKey}
            metrics={metrics}
            goals={{
              treesGrownGoal: project?.treesGrownGoal,
              goalTreesRestoredAnr: project?.goalTreesRestoredAnr,
              directSeedingSurvivalRate: project?.directSeedingSurvivalRate,
              jobsCreatedGoal: project?.jobsCreatedGoal
            }}
          />
        </PageCard>
      </PageRow>

      <GoalsAndProgressReportSections
        entity="projectReports"
        entityUuid={projectReport.uuid}
        frameworkKey={projectReport.frameworkKey}
        metrics={metrics}
        reportingPeriodDate={projectReport.dueAt ?? projectReport.submittedAt}
        goals={{
          treesGrownGoal: project?.treesGrownGoal,
          goalTreesRestoredAnr: project?.goalTreesRestoredAnr,
          directSeedingSurvivalRate: project?.directSeedingSurvivalRate
        }}
      />

      <br />
      <br />
    </PageBody>
  );
};

export default GoalsAndProgressTab;
