import { Flex } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { ReportsProvider, useReportsContext } from "@/context/reports.provider";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import AdditionalReportsContent from "@/pages/reports/components/AdditionalReportsContent";
import ProjectReportsSection from "@/pages/reports/components/ProjectReportsSection";
import { getDefaultProgressFiltersForSource } from "@/pages/reports/components/reportFilter.constants";
import ReportsIndexBulkBar from "@/pages/reports/components/ReportsIndexBulkBar";
import ReportsIndexHeader from "@/pages/reports/components/ReportsIndexHeader";
import {
  clearReportsIndexRestore,
  findAdditionalReportLocation,
  findProgressReportLocation
} from "@/pages/reports/reportIndex.utils";
import ReportsSelectionProvider from "@/pages/reports/ReportsSelection.provider";
import { useAdditionalReportsData } from "@/pages/reports/useAdditionalReportsData";
import { useReportsIndexData } from "@/pages/reports/useReportsIndexData";
import { useReportsIndexFilters } from "@/pages/reports/useReportsIndexFilters";
import NoResults from "@/redesignComponents/content/NoResults/NoResults";
import { LoadingIcon } from "@/redesignComponents/foundations/Icons";

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
  } = useAdditionalReportsData(project, true, project.organisationUuid);
  const { filteredProgressSections, filteredAdditionalSections, progressReportCount, additionalReportCount } =
    useReportsIndexFilters({ progressSections, additionalSections, query });

  const reportCount = additionalReportCount + progressReportCount;
  const hasActiveSearch = query.trim().length > 0;
  const hasActivePeriodFilter =
    filters.dueDateFrom !== "" || filters.dueDateTo !== "" || filters.dueMonth !== "" || filters.dueYear !== "";
  const defaultReportTypes = getDefaultProgressFiltersForSource("project").reportTypes;
  const hasUserReportTypeFilter =
    filters.reportTypes.length !== defaultReportTypes.length ||
    defaultReportTypes.some(type => !filters.reportTypes.includes(type));
  const hasReportSubset =
    hasActiveSearch || hasUserReportTypeFilter || filters.statuses.length > 0 || hasActivePeriodFilter;

  const [restoreReportId, setRestoreReportId] = useState<string | null>(null);
  const [restoreReady, setRestoreReady] = useState(false);

  useEffect(() => {
    // setRestoreReportId(readReportsIndexRestore(indexHref));
    setRestoreReady(true);
  }, []);

  const progressRestore = useMemo(
    () => (restoreReportId == null ? null : findProgressReportLocation(filteredProgressSections, restoreReportId)),
    [filteredProgressSections, restoreReportId]
  );
  const additionalRestore = useMemo(
    () => (restoreReportId == null ? null : findAdditionalReportLocation(filteredAdditionalSections, restoreReportId)),
    [filteredAdditionalSections, restoreReportId]
  );

  const unfilteredPeriodsByProjectId = useMemo(
    () => new Map(progressSections.map(section => [section.id, section.periods])),
    [progressSections]
  );

  const handleRowRestored = useCallback(() => {
    clearReportsIndexRestore();
    setRestoreReportId(null);
  }, []);

  useEffect(() => {
    if (!restoreReady || restoreReportId == null) return;
    const tabLoading = additionalLoading;
    if (tabLoading) return;
    if (progressRestore == null && additionalRestore == null) {
      clearReportsIndexRestore();
      setRestoreReportId(null);
    }
  }, [additionalLoading, additionalRestore, progressLoading, progressRestore, restoreReady, restoreReportId]);

  return (
    <div className="flex h-full w-full flex-col">
      <ReportsIndexHeader
        activeTab={"progress-reports"}
        source={"project"}
        sourceUuid={project.uuid}
        projectUuid={project.uuid}
        reportCount={reportCount}
        viewValue={"project"}
        viewItems={[]}
        periodOptions={{
          progressMonths: [],
          progressYears: [],
          additionalYears: []
        }}
        onTabChange={() => {}}
        onViewChange={() => {}}
        onQueryChange={setQuery}
        indexHref={""}
        entityProfile
      />
      <PageContent className="h-auto flex-1 px-2 py-0">
        {filteredProgressSections.length > 0 && (
          <>
            {progressLoading ? (
              <Flex minHeight="15rem" alignItems="center" justifyContent="center" gap={3}>
                <LoadingIcon boxSize={6} className="animate-spin" color="primary.700" />
                <Text textStyle="400" color="neutral.800">
                  {t("Loading reports...")}
                </Text>
              </Flex>
            ) : progressError ? (
              <NoResults
                title={t("Reports could not be loaded")}
                description={t("Please refresh the page and try again.")}
              />
            ) : filteredProgressSections.length === 0 ? (
              hasActiveSearch ? (
                <NoResults
                  title={t("No reports found")}
                  description={t("We couldn’t find any reports matching your search. Try a different keyword.")}
                />
              ) : (
                <NoResults title={t("No reports found")} description={t("Try changing your search or filters.")} />
              )
            ) : (
              <div className="space-y-4">
                {filteredProgressSections.map((section, index) => (
                  <ProjectReportsSection
                    key={section.id}
                    section={section}
                    sectionName={"Progress Reports"}
                    unfilteredPeriods={unfilteredPeriodsByProjectId.get(section.id)}
                    defaultOpen={index === 0}
                    expandForPeriodFilter={false}
                    metricsReady={true}
                    hasReportSubset={hasReportSubset}
                    indexHref={""}
                    restoreSectionId={progressRestore?.sectionId}
                    restorePeriodId={progressRestore?.periodId}
                    restoreReportId={restoreReportId ?? undefined}
                    onRowRestored={handleRowRestored}
                  />
                ))}
              </div>
            )}
          </>
        )}

        <AdditionalReportsContent
          sections={filteredAdditionalSections}
          sectionName={"Additional Reports"}
          loading={additionalLoading}
          error={additionalError}
          hasActiveSearch={hasActiveSearch}
          indexHref={""}
          restoreGroupId={undefined}
          restoreReportId={undefined}
          onRowRestored={() => {}}
        />

        <ReportsIndexBulkBar />
      </PageContent>
    </div>
  );
};

const ReportsTab: FC<ReportsTabProps> = ({ project }) => (
  <ReportsProvider>
    <ReportsSelectionProvider key={`project:${project.uuid}`}>
      <ReportsTabContent project={project} />
    </ReportsSelectionProvider>
  </ReportsProvider>
);

export default ReportsTab;
