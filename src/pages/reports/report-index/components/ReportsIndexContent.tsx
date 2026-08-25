import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { useProjectIndex } from "@/connections/Entity";
import { useReportsContext } from "@/context/reports.provider";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import type { HighLevelSelectorItem } from "@/redesignComponents/Forms/Inputs/HighLevelSelector/HighLevelSelector.types";
import { LoadingIcon } from "@/redesignComponents/foundations/Icons";

import { ReportsIndexSourceEntity } from "../reportIndex.types";
import {
  ALL_PROJECTS_VIEW_VALUE,
  clearReportsIndexRestore,
  findAdditionalReportLocation,
  findProgressReportLocation,
  getReportsIndexUrl,
  isReportsIndexTab,
  readReportsIndexRestore,
  ReportsIndexSource,
  ReportsIndexTab
} from "../reportIndex.utils";
import { getReportPeriodOptions } from "../reportPeriodFilter";
import { useReportsSelectionActions } from "../ReportsSelection.provider";
import { useAdditionalReportsData } from "../useAdditionalReportsData";
import { useReportsIndexData } from "../useReportsIndexData";
import { useReportsIndexFilters } from "../useReportsIndexFilters";
import AdditionalReportsContent from "./AdditionalReportsContent";
import ProjectReportsSection from "./ProjectReportsSection";
import ReportsIndexBulkBar from "./ReportsIndexBulkBar";
import ReportsIndexHeader from "./ReportsIndexHeader";
import ReportsSearchNoResults from "./ReportsSearchNoResults";

type ReportsIndexContentProps = {
  project: ProjectFullDto;
  source: ReportsIndexSource;
  sourceEntity: ReportsIndexSourceEntity;
};

const ReportsIndexContent = ({ project, source, sourceEntity }: ReportsIndexContentProps) => {
  const t = useT();
  const router = useRouter();
  const { filters } = useReportsContext();
  const viewFromQuery = typeof router.query.view === "string" ? router.query.view : undefined;
  const uuidFromQuery = typeof router.query.uuid === "string" ? router.query.uuid : undefined;
  const tabFromQuery = typeof router.query.tab === "string" ? router.query.tab : undefined;
  const activeTab: ReportsIndexTab = isReportsIndexTab(tabFromQuery) ? tabFromQuery : "progress-reports";
  const [query, setQuery] = useState("");
  const [viewValue, setViewValue] = useState(
    viewFromQuery === ALL_PROJECTS_VIEW_VALUE ? ALL_PROJECTS_VIEW_VALUE : project.uuid
  );
  const { clearSelection } = useReportsSelectionActions();
  const [reloadNonce, setReloadNonce] = useState(0);
  const [, { data: projects }] = useProjectIndex({});
  const isAllProjectsView = viewValue === ALL_PROJECTS_VIEW_VALUE;
  const isSwitchingProject = !isAllProjectsView && viewValue !== project.uuid;

  const {
    sections: progressSections,
    loading: progressLoading,
    metricsReady: progressMetricsReady,
    error: progressError
  } = useReportsIndexData(project, source, sourceEntity.uuid, isAllProjectsView, reloadNonce);
  const {
    sections: additionalSections,
    loading: additionalLoading,
    error: additionalError
  } = useAdditionalReportsData(project, activeTab === "additional-reports", isAllProjectsView);

  const { filteredProgressSections, filteredAdditionalSections, progressReportCount, additionalReportCount } =
    useReportsIndexFilters({ progressSections, additionalSections, query });

  const reportTypeFromQuery = typeof router.query.reportType === "string" ? router.query.reportType : undefined;
  const indexHref = getReportsIndexUrl(source, sourceEntity.uuid, {
    tab: activeTab,
    view: isAllProjectsView ? ALL_PROJECTS_VIEW_VALUE : undefined,
    reportType: reportTypeFromQuery
  });

  const [restoreReportId, setRestoreReportId] = useState<string | null>(null);
  const [restoreReady, setRestoreReady] = useState(false);

  useEffect(() => {
    setRestoreReportId(readReportsIndexRestore(indexHref));
    setRestoreReady(true);
  }, [indexHref]);

  const progressRestore = useMemo(
    () => (restoreReportId == null ? null : findProgressReportLocation(filteredProgressSections, restoreReportId)),
    [filteredProgressSections, restoreReportId]
  );
  const additionalRestore = useMemo(
    () => (restoreReportId == null ? null : findAdditionalReportLocation(filteredAdditionalSections, restoreReportId)),
    [filteredAdditionalSections, restoreReportId]
  );

  const handleRowRestored = useCallback(() => {
    clearReportsIndexRestore();
    setRestoreReportId(null);
  }, []);

  useEffect(() => {
    if (!restoreReady || restoreReportId == null) return;
    const tabLoading = activeTab === "additional-reports" ? additionalLoading : progressLoading;
    if (tabLoading) return;
    if (progressRestore == null && additionalRestore == null) {
      clearReportsIndexRestore();
      setRestoreReportId(null);
    }
  }, [
    activeTab,
    additionalLoading,
    additionalRestore,
    progressLoading,
    progressRestore,
    restoreReady,
    restoreReportId
  ]);

  const reportCount = activeTab === "additional-reports" ? additionalReportCount : progressReportCount;
  const hasActiveSearch = query.trim().length > 0;
  const hasReportSubset = hasActiveSearch || filters.reportTypes.length > 0 || filters.statuses.length > 0;
  const hasActivePeriodFilter =
    filters.dueDateFrom !== "" || filters.dueDateTo !== "" || filters.dueMonth !== "" || filters.dueYear !== "";

  // Built from the unfiltered sections so refining by a period never shrinks the list of periods
  // still on offer.
  const periodOptions = useMemo(
    () => getReportPeriodOptions(progressSections, additionalSections),
    [additionalSections, progressSections]
  );

  const viewItems = useMemo<HighLevelSelectorItem[]>(() => {
    const projectItems =
      projects?.map(item => ({
        label: item.name ?? t("Project"),
        value: item.uuid
      })) ?? [];
    const hasCurrentProject = projectItems.some(item => item.value === project.uuid);
    const items = hasCurrentProject
      ? projectItems
      : [{ label: project.name ?? t("Project"), value: project.uuid }, ...projectItems];

    const allLabel = activeTab === "additional-reports" ? t("All") : t("All Projects");
    return [{ label: allLabel, value: ALL_PROJECTS_VIEW_VALUE }, ...items];
  }, [activeTab, project.name, project.uuid, projects, t]);

  useEffect(() => {
    if (!router.isReady) return;
    // Site/nursery entry points put the entity uuid in the query, not the project. Only project
    // URLs should drive the View selector from `uuid`.
    const nextView =
      viewFromQuery === ALL_PROJECTS_VIEW_VALUE
        ? ALL_PROJECTS_VIEW_VALUE
        : source === "project"
        ? uuidFromQuery ?? project.uuid
        : project.uuid;
    setViewValue(nextView);
  }, [project.uuid, router.isReady, source, uuidFromQuery, viewFromQuery]);

  const handleViewChange = useCallback(
    (nextView: string) => {
      clearSelection();
      setViewValue(nextView);

      if (nextView === ALL_PROJECTS_VIEW_VALUE) {
        void router.replace(
          {
            pathname: router.pathname,
            query: { ...router.query, view: ALL_PROJECTS_VIEW_VALUE }
          },
          undefined,
          { shallow: true }
        );
        return;
      }

      if (nextView === project.uuid) {
        const queryWithoutView = { ...router.query };
        delete queryWithoutView.view;
        void router.replace(
          {
            pathname: router.pathname,
            query: queryWithoutView
          },
          undefined,
          { shallow: true }
        );
        return;
      }

      void router.replace(
        getReportsIndexUrl("project", nextView, {
          tab: activeTab === "additional-reports" ? "additional-reports" : undefined,
          reportType: reportTypeFromQuery
        }),
        undefined,
        { shallow: true }
      );
    },
    [clearSelection, project.uuid, router, activeTab, reportTypeFromQuery]
  );

  const handleTabChange = useCallback(
    (tab: string) => {
      clearSelection();
      const query = { ...router.query };
      if (tab === "additional-reports") {
        query.tab = tab;
      } else {
        delete query.tab;
      }
      void router.replace({ pathname: router.pathname, query }, undefined, { shallow: true });
    },
    [clearSelection, router]
  );

  const handleReportsChanged = useCallback(() => {
    setReloadNonce(current => current + 1);
  }, []);

  return (
    <>
      <ReportsIndexHeader
        activeTab={activeTab}
        source={source}
        sourceUuid={sourceEntity.uuid}
        projectUuid={project.uuid}
        reportCount={reportCount}
        viewValue={viewValue}
        viewItems={viewItems}
        periodOptions={periodOptions}
        onTabChange={handleTabChange}
        onViewChange={handleViewChange}
        onQueryChange={setQuery}
        indexHref={indexHref}
      />
      <PageContent className="px-1.5 py-0">
        {activeTab === "progress-reports" && (
          <>
            {progressLoading || isSwitchingProject || !restoreReady ? (
              <Flex minHeight="15rem" alignItems="center" justifyContent="center" gap={3}>
                <LoadingIcon boxSize={6} className="animate-spin" color="primary.700" />
                <Text textStyle="400" color="neutral.800">
                  {t("Loading reports...")}
                </Text>
              </Flex>
            ) : progressError ? (
              <Box background="neutral.100" h="full" p={4}>
                <Text textStyle="400-bold">{t("Reports could not be loaded")}</Text>
                <Text textStyle="400">{t("Please refresh the page and try again.")}</Text>
              </Box>
            ) : filteredProgressSections.length === 0 ? (
              hasActiveSearch ? (
                <ReportsSearchNoResults />
              ) : (
                <Box background="neutral.100" h="full" p={4}>
                  <Text textStyle="400-bold">{t("No reports found")}</Text>
                  <Text textStyle="400">{t("Try changing your search or filters.")}</Text>
                </Box>
              )
            ) : (
              <div className="space-y-4">
                {filteredProgressSections.map((section, index) => (
                  <ProjectReportsSection
                    key={section.id}
                    section={section}
                    defaultOpen={index === 0 && !isAllProjectsView}
                    expandForPeriodFilter={hasActivePeriodFilter}
                    metricsReady={progressMetricsReady}
                    hasReportSubset={hasReportSubset}
                    indexHref={indexHref}
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

        {activeTab === "additional-reports" && (
          <AdditionalReportsContent
            sections={filteredAdditionalSections}
            loading={additionalLoading || isSwitchingProject || !restoreReady}
            error={additionalError}
            hasActiveSearch={hasActiveSearch}
            indexHref={indexHref}
            restoreGroupId={additionalRestore?.groupId}
            restoreReportId={restoreReportId ?? undefined}
            onRowRestored={handleRowRestored}
          />
        )}

        <ReportsIndexBulkBar onReportsChanged={handleReportsChanged} />
      </PageContent>
    </>
  );
};

export default ReportsIndexContent;
