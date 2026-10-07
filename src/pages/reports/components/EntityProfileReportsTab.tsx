import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { useLightProject } from "@/connections/Entity";
import { ReportsProvider, useReportsContext } from "@/context/reports.provider";
import { ProjectLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { getReportPeriodOptions, getSectionReportingPeriods } from "@/pages/reports/reportPeriodFilter";
import ReportProfileOriginProvider from "@/pages/reports/ReportProfileOrigin.provider";
import ReportsSelectionProvider from "@/pages/reports/ReportsSelection.provider";
import { ReportingPeriodMetricCard } from "@/pages/reports/useReportingPeriodMetrics";
import { useReportsIndexData } from "@/pages/reports/useReportsIndexData";
import { useReportsIndexFilters } from "@/pages/reports/useReportsIndexFilters";
import NoResults from "@/redesignComponents/content/NoResults/NoResults";
import { LoadingIcon } from "@/redesignComponents/foundations/Icons";

import ReportingPeriodSection from "./ReportingPeriodSection";
import ReportsIndexBulkBar from "./ReportsIndexBulkBar";
import ReportsIndexHeader from "./ReportsIndexHeader";

const PROFILE_METRIC_KEYS: Record<"site" | "nursery", ReportingPeriodMetricCard["key"][]> = {
  site: ["trees-growing", "trees-regenerated", "jobs"],
  nursery: ["seedlings-grown"]
};

interface EntityProfileReportsTabProps {
  source: "site" | "nursery";
  entityUuid: string;
  projectUuid: string | null;
}

interface EntityProfileReportsContentProps extends Omit<EntityProfileReportsTabProps, "projectUuid"> {
  project: ProjectLightDto;
}

const EntityProfileReportsContent: FC<EntityProfileReportsContentProps> = ({ source, entityUuid, project }) => {
  const t = useT();
  const { filters } = useReportsContext();
  const [query, setQuery] = useState("");
  const { sections, loading, error } = useReportsIndexData(project, source, entityUuid);
  const { filteredProgressSections, progressReportCount } = useReportsIndexFilters({
    progressSections: sections,
    additionalSections: [],
    query
  });

  const hasActiveSearch = query.trim().length > 0;
  const hasActivePeriodFilter =
    filters.dueDateFrom !== "" || filters.dueDateTo !== "" || filters.dueMonth !== "" || filters.dueYear !== "";
  const hasReportSubset = hasActiveSearch || filters.statuses.length > 0 || hasActivePeriodFilter;

  // A site / nursery's reports all belong to one project, so the project level accordion is skipped
  // and the reporting periods are listed directly.
  const periods = useMemo(
    () => filteredProgressSections.flatMap(section => section.periods),
    [filteredProgressSections]
  );
  const showNoResults = !loading && (error || periods.length === 0);
  const periodOptions = useMemo(() => getReportPeriodOptions(getSectionReportingPeriods(sections), []), [sections]);
  const unfilteredReportsByPeriodId = useMemo(
    () => new Map(sections.flatMap(section => section.periods).map(period => [period.id, period.reports])),
    [sections]
  );

  return (
    <div className="flex h-full w-full flex-col">
      <ReportsIndexHeader
        activeTab="progress-reports"
        source={source}
        sourceUuid={entityUuid}
        projectUuid={project.uuid}
        reportCount={progressReportCount}
        viewValue={source}
        viewItems={[]}
        periodOptions={periodOptions}
        onTabChange={() => {}}
        onViewChange={() => {}}
        onQueryChange={setQuery}
        indexHref=""
        entityProfile
      />
      <PageContent className={twMerge("h-auto flex-1 px-2 pt-0 pb-8", showNoResults && "bg-theme-neutral-100")}>
        {loading ? (
          <Flex minHeight="15rem" alignItems="center" justifyContent="center" gap={3}>
            <LoadingIcon boxSize={6} className="animate-spin" color="primary.700" />
            <Text textStyle="400" color="neutral.800">
              {t("Loading reports...")}
            </Text>
          </Flex>
        ) : error ? (
          <NoResults
            title={t("Reports could not be loaded")}
            description={t("Please refresh the page and try again.")}
          />
        ) : periods.length === 0 ? (
          <NoResults
            title={t("No reports found")}
            description={
              hasActiveSearch
                ? t("We couldn’t find any reports matching your search. Try a different keyword.")
                : t("Try changing your search or filters.")
            }
          />
        ) : (
          <div className="space-y-0.5 bg-theme-neutral-200 pt-0.5">
            {periods.map((period, index) => (
              <ReportingPeriodSection
                key={period.id}
                period={period}
                allPeriodReports={unfilteredReportsByPeriodId.get(period.id)}
                defaultOpen={index === 0}
                hasReportSubset={hasReportSubset}
                indexHref=""
                metricKeys={PROFILE_METRIC_KEYS[source]}
              />
            ))}
          </div>
        )}

        <ReportsIndexBulkBar />
      </PageContent>
    </div>
  );
};

/**
 * The Reports tab on a site or nursery profile: the progress reports of that one entity, grouped by
 * reporting period.
 */
const EntityProfileReportsTab: FC<EntityProfileReportsTabProps> = ({ source, entityUuid, projectUuid }) => {
  const [, { data: project }] = useLightProject({ id: projectUuid ?? undefined });

  return project == null ? null : (
    <ReportsProvider>
      <ReportsSelectionProvider key={`${source}:${entityUuid}`}>
        <ReportProfileOriginProvider source={source} uuid={entityUuid}>
          <EntityProfileReportsContent source={source} entityUuid={entityUuid} project={project} />
        </ReportProfileOriginProvider>
      </ReportsSelectionProvider>
    </ReportsProvider>
  );
};

export default EntityProfileReportsTab;
