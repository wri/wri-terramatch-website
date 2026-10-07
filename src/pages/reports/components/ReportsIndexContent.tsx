import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { useProjectIndex } from "@/connections/Entity";
import { useReportsContext } from "@/context/reports.provider";
import { ProjectLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { InfiniteScrollSentinel } from "@/hooks/useInfiniteScrollSentinel";
import NoResults from "@/redesignComponents/content/NoResults/NoResults";
import type { HighLevelSelectorItem } from "@/redesignComponents/Forms/Inputs/HighLevelSelector/HighLevelSelector.types";
import { LoadingIcon } from "@/redesignComponents/foundations/Icons";

import {
  ALL_PROJECTS_VIEW_VALUE,
  clearReportsIndexRestore,
  findAdditionalReportLocation,
  findProgressReportLocation,
  getReportsIndexUrl,
  isReportsIndexTab,
  readReportsIndexRestore,
  ReportsIndexRestoreState,
  ReportsIndexSource,
  ReportsIndexTab
} from "../reportIndex.utils";
import { getReportPeriodOptions, getSectionReportingPeriods } from "../reportPeriodFilter";
import { useReportsSelectionActions } from "../ReportsSelection.provider";
import { useAdditionalReportsData } from "../useAdditionalReportsData";
import { useAllProjectsReportsData } from "../useAllProjectsReportsData";
import { useReportsIndexData } from "../useReportsIndexData";
import { useReportsIndexFilters } from "../useReportsIndexFilters";
import AdditionalReportsContent from "./AdditionalReportsContent";
import ProjectReportsMetaSection from "./ProjectReportsMetaSection";
import ProjectReportsSection from "./ProjectReportsSection";
import { getDefaultProgressFiltersForSource } from "./reportFilter.constants";
import ReportsIndexBulkBar from "./ReportsIndexBulkBar";
import ReportsIndexHeader from "./ReportsIndexHeader";

type ReportsIndexContentProps = {
  project: ProjectLightDto;
};

const ReportsIndexContent: FC<ReportsIndexContentProps> = ({ project }) => {
  const SOURCE = "project" as const;
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
  const [, { data: projects }] = useProjectIndex({});
  const organisationViewItems = useMemo<HighLevelSelectorItem[]>(() => {
    const labelsByUuid = new Map<string, string>();
    (projects ?? []).forEach(item => {
      if (item.organisationUuid == null || labelsByUuid.has(item.organisationUuid)) return;
      labelsByUuid.set(item.organisationUuid, item.organisationName ?? t("Organisation"));
    });
    if (project.organisationUuid != null && !labelsByUuid.has(project.organisationUuid)) {
      labelsByUuid.set(project.organisationUuid, project.organisationName ?? t("Organisation"));
    }

    return Array.from(labelsByUuid.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([value, label]) => ({ value, label }));
  }, [project.organisationName, project.organisationUuid, projects, t]);
  const isKnownProjectView = viewValue === project.uuid || (projects ?? []).some(item => item.uuid === viewValue);
  const isOrganisationView =
    organisationViewItems.some(item => item.value === viewValue) ||
    (viewFromQuery === viewValue && viewValue !== ALL_PROJECTS_VIEW_VALUE && !isKnownProjectView);
  const isAllProjectsView = viewValue === ALL_PROJECTS_VIEW_VALUE || isOrganisationView;
  const isSwitchingProject = !isAllProjectsView && viewValue !== project.uuid;
  const additionalOrganisationUuid =
    activeTab === "additional-reports"
      ? viewValue === ALL_PROJECTS_VIEW_VALUE
        ? null
        : viewValue
      : viewValue === ALL_PROJECTS_VIEW_VALUE
      ? null
      : isOrganisationView
      ? viewValue
      : project.organisationUuid ?? null;

  const {
    sections: progressSections,
    loading: progressLoading,
    error: progressError
  } = useReportsIndexData(project, source, sourceEntity.uuid, !isAllProjectsView);
  const {
    metas: allProjectsMetas,
    loading: allProjectsLoading,
    error: allProjectsError,
    reportCount: allProjectsReportCount,
    reportingPeriods: allProjectsReportingPeriods,
    hasMore: allProjectsHasMore,
    loadingMore: allProjectsLoadingMore,
    loadMore: allProjectsLoadMore
  } = useAllProjectsReportsData({ query, enabled: isAllProjectsView && activeTab === "progress-reports" });
  const {
    sections: additionalSections,
    loading: additionalLoading,
    error: additionalError
  } = useAdditionalReportsData(project, true, additionalOrganisationUuid);

  const { filteredProgressSections, filteredAdditionalSections, progressReportCount, additionalReportCount } =
    useReportsIndexFilters({ progressSections, additionalSections, query });

  const reportTypeFromQuery = typeof router.query.reportType === "string" ? router.query.reportType : undefined;
  const indexHref = getReportsIndexUrl(SOURCE, project.uuid, {
    tab: activeTab,
    view: viewValue === ALL_PROJECTS_VIEW_VALUE || isOrganisationView ? viewValue : undefined,
    reportType: reportTypeFromQuery
  });

  const [restore, setRestore] = useState<ReportsIndexRestoreState | null>(null);
  const [restoreReady, setRestoreReady] = useState(false);
  const restoreReportId = restore?.reportId ?? null;

  useEffect(() => {
    setRestore(readReportsIndexRestore(indexHref));
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

  // In the "All Projects" view, the reports aren't loaded until a project is opened, so the restore
  // is located by project and the project section takes it from there.
  const allProjectsRestoreUuid = useMemo(() => {
    const projectUuid = restore?.projectUuid;
    return projectUuid != null && allProjectsMetas.some(({ uuid }) => uuid === projectUuid) ? projectUuid : undefined;
  }, [allProjectsMetas, restore]);

  const handleRowRestored = useCallback(() => {
    clearReportsIndexRestore();
    setRestore(null);
  }, []);

  useEffect(() => {
    if (!restoreReady || restoreReportId == null) return;
    const tabLoading =
      activeTab === "additional-reports" ? additionalLoading : isAllProjectsView ? allProjectsLoading : progressLoading;
    if (tabLoading) return;
    if (progressRestore == null && additionalRestore == null && allProjectsRestoreUuid == null) {
      // The project to restore may be on a page of the "All Projects" view that hasn't loaded yet.
      if (restore?.projectUuid != null && allProjectsHasMore) {
        allProjectsLoadMore();
        return;
      }

      clearReportsIndexRestore();
      setRestore(null);
    }
  }, [
    activeTab,
    additionalLoading,
    additionalRestore,
    allProjectsHasMore,
    allProjectsLoadMore,
    allProjectsLoading,
    allProjectsRestoreUuid,
    isAllProjectsView,
    progressLoading,
    progressRestore,
    restore?.projectUuid,
    restoreReady,
    restoreReportId
  ]);

  const reportCount =
    activeTab === "additional-reports"
      ? additionalReportCount
      : isAllProjectsView
      ? allProjectsReportCount
      : progressReportCount;
  const hasActiveSearch = query.trim().length > 0;
  const hasActivePeriodFilter =
    filters.dueDateFrom !== "" || filters.dueDateTo !== "" || filters.dueMonth !== "" || filters.dueYear !== "";
  const defaultReportTypes = getDefaultProgressFiltersForSource(SOURCE).reportTypes;
  const hasUserReportTypeFilter =
    filters.reportTypes.length !== defaultReportTypes.length ||
    defaultReportTypes.some(type => !filters.reportTypes.includes(type));
  const hasReportSubset =
    hasActiveSearch || hasUserReportTypeFilter || filters.statuses.length > 0 || hasActivePeriodFilter;

  // Built from the unfiltered sections so refining by a period never shrinks the list of periods
  // still on offer. In the "All Projects" view, the BE leaves the due date filters off its list of
  // periods for the same reason.
  const periodOptions = useMemo(
    () =>
      getReportPeriodOptions(
        isAllProjectsView ? allProjectsReportingPeriods : getSectionReportingPeriods(progressSections),
        additionalSections
      ),
    [additionalSections, allProjectsReportingPeriods, isAllProjectsView, progressSections]
  );

  const unfilteredPeriodsByProjectId = useMemo(
    () => new Map(progressSections.map(section => [section.id, section.periods])),
    [progressSections]
  );

  const viewItems = useMemo<HighLevelSelectorItem[]>(() => {
    if (activeTab === "additional-reports") {
      return [{ label: t("All"), value: ALL_PROJECTS_VIEW_VALUE }, ...organisationViewItems];
    }

    const projectItems =
      projects?.map(item => ({
        label: item.name ?? t("Project"),
        value: item.uuid
      })) ?? [];
    const hasCurrentProject = projectItems.some(item => item.value === project.uuid);
    const items = hasCurrentProject
      ? projectItems
      : [{ label: project.name ?? t("Project"), value: project.uuid }, ...projectItems];

    return [{ label: t("All Projects"), value: ALL_PROJECTS_VIEW_VALUE }, ...items];
  }, [activeTab, organisationViewItems, project.name, project.uuid, projects, t]);

  const headerViewValue =
    activeTab === "additional-reports"
      ? viewValue === ALL_PROJECTS_VIEW_VALUE
        ? ALL_PROJECTS_VIEW_VALUE
        : additionalOrganisationUuid ?? ALL_PROJECTS_VIEW_VALUE
      : isOrganisationView
      ? ALL_PROJECTS_VIEW_VALUE
      : viewValue;

  useEffect(() => {
    if (!router.isReady) return;
    const nextView =
      viewFromQuery === ALL_PROJECTS_VIEW_VALUE || (viewFromQuery != null && viewFromQuery !== "")
        ? viewFromQuery
        : activeTab === "additional-reports"
        ? project.organisationUuid ?? ALL_PROJECTS_VIEW_VALUE
        : uuidFromQuery ?? project.uuid;
    setViewValue(nextView);
  }, [project.uuid, project.organisationUuid, router.isReady, uuidFromQuery, viewFromQuery, activeTab]);

  const handleViewChange = useCallback(
    (nextView: string) => {
      clearSelection();
      setViewValue(nextView);

      if (activeTab === "additional-reports") {
        const query = { ...router.query };
        if (nextView === ALL_PROJECTS_VIEW_VALUE) {
          query.view = ALL_PROJECTS_VIEW_VALUE;
        } else {
          query.view = nextView;
        }
        void router.replace({ pathname: router.pathname, query }, undefined, { shallow: true });
        return;
      }

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
        getReportsIndexUrl(SOURCE, nextView, {
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
        delete query.reportType;
      } else {
        delete query.tab;
      }
      setQuery("");
      void router.replace({ pathname: router.pathname, query }, undefined, { shallow: true });
    },
    [clearSelection, router]
  );

  return (
    <>
      <ReportsIndexHeader
        activeTab={activeTab}
        source={SOURCE}
        sourceUuid={project.uuid}
        projectUuid={project.uuid}
        reportCount={reportCount}
        viewValue={headerViewValue}
        viewItems={viewItems}
        periodOptions={periodOptions}
        onTabChange={handleTabChange}
        onViewChange={handleViewChange}
        onQueryChange={setQuery}
        indexHref={indexHref}
      />
      <PageContent className="h-auto flex-1 px-2 pt-0 pb-8">
        {activeTab === "progress-reports" && (
          <>
            {(isAllProjectsView ? allProjectsLoading : progressLoading) || isSwitchingProject || !restoreReady ? (
              <Flex minHeight="15rem" alignItems="center" justifyContent="center" gap={3}>
                <LoadingIcon boxSize={6} className="animate-spin" color="primary.700" />
                <Text textStyle="400" color="neutral.800">
                  {t("Loading reports...")}
                </Text>
              </Flex>
            ) : isAllProjectsView ? (
              allProjectsError ? (
                <NoResults
                  title={t("Reports could not be loaded")}
                  description={t("Please refresh the page and try again.")}
                />
              ) : allProjectsMetas.length === 0 ? (
                <NoResults title={t("No reports found")} description={t("Try changing your search or filters.")} />
              ) : (
                <div className="space-y-4">
                  {allProjectsMetas.map(meta => (
                    <ProjectReportsMetaSection
                      key={meta.uuid}
                      meta={meta}
                      query={query}
                      expandForPeriodFilter={hasActivePeriodFilter}
                      hasReportSubset={hasReportSubset}
                      indexHref={indexHref}
                      restoreReportId={meta.uuid === allProjectsRestoreUuid ? restoreReportId ?? undefined : undefined}
                      onRowRestored={handleRowRestored}
                    />
                  ))}
                  <InfiniteScrollSentinel
                    hasMore={allProjectsHasMore}
                    loading={allProjectsLoading}
                    loadingMore={allProjectsLoadingMore}
                    label={t("Loading reports...")}
                    resetKey={allProjectsMetas.length}
                    onLoadMore={allProjectsLoadMore}
                  />
                </div>
              )
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
                    unfilteredPeriods={unfilteredPeriodsByProjectId.get(section.id)}
                    defaultOpen={index === 0}
                    expandForPeriodFilter={hasActivePeriodFilter}
                    metricsReady={!progressLoading}
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

        <ReportsIndexBulkBar />
      </PageContent>
    </>
  );
};

export default ReportsIndexContent;
