import { useT } from "@transifex/react";
import { FC } from "react";

import Text from "@/components/elements/Text/Text";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageRow from "@/components/extensive/PageElements/Row/PageRow";
import DisturbancesTablePD from "@/components/extensive/Tables/DisturbancesTablePD";
import { SiteFullDto, SiteReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import GoalsAndProgressReportEntityTab from "@/pages/reports/components/GoalsAndProgressReportEntityTab";
import GoalsAndProgressReportSections from "@/pages/reports/components/GoalsAndProgressReportSections";

interface GoalsAndProgressTabProps {
  siteReport: SiteReportFullDto;
  site?: SiteFullDto | null;
  workdaysTotal?: number | null;
}

const GoalsAndProgressTab: FC<GoalsAndProgressTabProps> = ({ siteReport, site, workdaysTotal }) => {
  const t = useT();

  const metrics = {
    treesPlantedCount: siteReport.totalTreesPlantedCount ?? 0,
    seedsPlantedCount: siteReport.totalSeedsPlantedCount ?? 0,
    regeneratedTreesCount: siteReport.totalTreesRegeneratingSpeciesCount ?? siteReport.numTreesRegenerating ?? 0,
    pctSurvivalToDate: siteReport.pctSurvivalToDate,
    regenerationDescription: siteReport.regenerationDescription,
    nonTreePlantedCount: siteReport.totalNonTreeSpeciesPlantedCount,
    treeReplantingCount: siteReport.totalTreeReplantingCount,
    invasiveTreesCount: siteReport.totalInvasiveTreesCount
  };

  return (
    <PageBody className="!space-y-10 bg-theme-neutral-200 pt-5 text-darkCustom">
      <PageRow className="mx-0 w-full !max-w-full px-6">
        <PageCard title={t("Progress & Goals")}>
          <GoalsAndProgressReportEntityTab
            entity="siteReports"
            entityUuid={siteReport.uuid}
            frameworkKey={siteReport.frameworkKey}
            metrics={metrics}
            siteGoals={site}
            workdaysTotal={workdaysTotal}
          />
        </PageCard>
      </PageRow>

      <GoalsAndProgressReportSections
        entity="siteReports"
        entityUuid={siteReport.uuid}
        frameworkKey={siteReport.frameworkKey}
        metrics={metrics}
        reportingPeriodDate={siteReport.dueAt ?? siteReport.submittedAt}
        goals={{
          directSeedingSurvivalRate: site?.directSeedingSurvivalRate
        }}
      />

      <PageRow className="mx-0 w-full !max-w-full px-6">
        <PageCard gap={8}>
          <Text variant="text-20-bold">{t("Disturbances")}</Text>
          <DisturbancesTablePD modelName="siteReports" modelUUID={siteReport.uuid} />
        </PageCard>
      </PageRow>

      <br />
      <br />
    </PageBody>
  );
};

export default GoalsAndProgressTab;
