import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { ReportsProvider, useReportsContext } from "@/context/reports.provider";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import AdditionalReportsContent from "@/pages/reports/components/AdditionalReportsContent";
import ProjectReportsSection from "@/pages/reports/components/ProjectReportsSection";
import { getDefaultProgressFiltersForSource } from "@/pages/reports/components/reportFilter.constants";
import ReportsIndexBulkBar from "@/pages/reports/components/ReportsIndexBulkBar";
import ReportsIndexHeader from "@/pages/reports/components/ReportsIndexHeader";
import { getReportPeriodOptions } from "@/pages/reports/reportPeriodFilter";
import ReportProfileOriginProvider from "@/pages/reports/ReportProfileOrigin.provider";
import ReportsSelectionProvider from "@/pages/reports/ReportsSelection.provider";
import { useAdditionalReportsData } from "@/pages/reports/useAdditionalReportsData";
import { useReportsIndexData } from "@/pages/reports/useReportsIndexData";
import { useReportsIndexFilters } from "@/pages/reports/useReportsIndexFilters";
import NoResults from "@/redesignComponents/content/NoResults/NoResults";
import { LoadingIcon } from "@/redesignComponents/foundations/Icons";

const noop = () => {};

interface ReportsTabProps {
  project: ProjectFullDto;
}

const ReportsTabContent: FC<ReportsTabProps> = ({ project }) => {
  const t = useT();
  const { filters } = useReportsContext();
  const [query, setQuery] = useState("");
  const {
    sections: progressSections,
    loading: progressLoading,
    error: progressError
  } = useReportsIndexData(project, "project", project.uuid, false);
  const {
    sections: additionalSections,
    loading: additionalLoading,
    error: additionalError
  } = useAdditionalReportsData(project, true, project.organisationUuid, "project");
  const { filteredProgressSections, filteredAdditionalSections, progressReportCount, additionalReportCount } =
    useReportsIndexFilters({ progressSections, additionalSections, query });

  const loading = progressLoading || additionalLoading;
  const error = progressError || additionalError;
  const hasResults = filteredProgressSections.length > 0 || filteredAdditionalSections.length > 0;
  const showNoResults = !loading && (error || !hasResults);
  const hasActiveSearch = query.trim().length > 0;
  const hasActivePeriodFilter =
    filters.dueDateFrom !== "" || filters.dueDateTo !== "" || filters.dueMonth !== "" || filters.dueYear !== "";
  const defaultReportTypes = getDefaultProgressFiltersForSource("project").reportTypes;
  const hasUserReportTypeFilter =
    filters.reportTypes.length !== defaultReportTypes.length ||
    defaultReportTypes.some(type => !filters.reportTypes.includes(type));
  const hasReportSubset =
    hasActiveSearch || hasUserReportTypeFilter || filters.statuses.length > 0 || hasActivePeriodFilter;

  const periodOptions = useMemo(
    () => getReportPeriodOptions(progressSections, additionalSections),
    [additionalSections, progressSections]
  );
  const unfilteredPeriodsByProjectId = useMemo(
    () => new Map(progressSections.map(section => [section.id, section.periods])),
    [progressSections]
  );

  return (
    <div className="flex h-full w-full flex-col">
      <ReportsIndexHeader
        activeTab="progress-reports"
        source="project"
        sourceUuid={project.uuid}
        projectUuid={project.uuid}
        reportCount={progressReportCount + additionalReportCount}
        viewValue="project"
        viewItems={[]}
        periodOptions={periodOptions}
        onTabChange={noop}
        onViewChange={noop}
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
            className="py-4"
            description={t("Please refresh the page and try again.")}
          />
        ) : !hasResults ? (
          <NoResults
            title={t("No reports found")}
            className="py-4"
            description={
              hasActiveSearch
                ? t("We couldn’t find any reports matching your search. Try a different keyword.")
                : t("Try changing your search or filters.")
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredProgressSections.map((section, index) => (
              <ProjectReportsSection
                key={section.id}
                section={section}
                sectionName={t("Progress Reports")}
                unfilteredPeriods={unfilteredPeriodsByProjectId.get(section.id)}
                defaultOpen={index === 0}
                hasReportSubset={hasReportSubset}
                indexHref=""
              />
            ))}
            {filteredAdditionalSections.length > 0 && (
              <AdditionalReportsContent
                sections={filteredAdditionalSections}
                sectionName={t("Additional Reports")}
                loading={false}
                error={false}
                indexHref=""
              />
            )}
          </div>
        )}

        <ReportsIndexBulkBar />
      </PageContent>
    </div>
  );
};

const ReportsTab: FC<ReportsTabProps> = ({ project }) => (
  <ReportsProvider>
    <ReportsSelectionProvider key={`project:${project.uuid}`}>
      <ReportProfileOriginProvider source="project" uuid={project.uuid}>
        <ReportsTabContent project={project} />
      </ReportProfileOriginProvider>
    </ReportsSelectionProvider>
  </ReportsProvider>
);

export default ReportsTab;
