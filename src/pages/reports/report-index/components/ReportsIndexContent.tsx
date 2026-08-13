import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useProjectIndex } from "@/connections/Entity";
import { ProjectFullDto, ProjectLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import type { HighLevelSelectorItem } from "@/redesignComponents/Forms/Inputs/HighLevelSelector/HighLevelSelector.types";
import { LoadingIcon } from "@/redesignComponents/foundations/Icons";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";

import { ReportsIndexSourceEntity } from "../reportIndex.types";
import {
  ALL_PROJECTS_VIEW_VALUE,
  getReportIndexItemPath,
  getReportsIndexUrl,
  ReportsIndexSource
} from "../reportIndex.utils";
import { useReportsSelection } from "../ReportsSelection.provider";
import { useAdditionalReportsData } from "../useAdditionalReportsData";
import { useReportsIndexFilters } from "../useReportsIndexFilters";
import AdditionalReportsContent from "./AdditionalReportsContent";
import ReportsBulkActionToolbar from "./ReportsBulkActionToolbar";
import ReportsIndexHeader from "./ReportsIndexHeader";
import ReportsIndexProjectSection from "./ReportsIndexProjectSection";

type ReportsIndexContentProps = {
  project: ProjectFullDto;
  source: ReportsIndexSource;
  sourceEntity: ReportsIndexSourceEntity;
};

type ViewProject = Pick<ProjectLightDto, "uuid" | "name" | "organisationName" | "organisationUuid">;

const compareProjectName = (left: ViewProject, right: ViewProject) =>
  (left.name ?? "").localeCompare(right.name ?? "", undefined, { sensitivity: "base" });

const ReportsIndexContent = ({ project, source, sourceEntity }: ReportsIndexContentProps) => {
  const t = useT();
  const router = useRouter();
  const viewFromQuery = typeof router.query.view === "string" ? router.query.view : undefined;
  const [activeTab, setActiveTab] = useState("progress-reports");
  const [query, setQuery] = useState("");
  const [viewValue, setViewValue] = useState(
    viewFromQuery === ALL_PROJECTS_VIEW_VALUE ? ALL_PROJECTS_VIEW_VALUE : project.uuid
  );
  const [reportCountsByProject, setReportCountsByProject] = useState<Record<string, number>>({});
  const { selectedReports, clearSelection } = useReportsSelection();
  const [projectsLoaded, { data: projects }] = useProjectIndex({ pageNumber: 1, pageSize: 100 });
  const isAllProjectsView = viewValue === ALL_PROJECTS_VIEW_VALUE;

  const {
    sections: additionalSections,
    loading: additionalLoading,
    error: additionalError
  } = useAdditionalReportsData(project, activeTab === "additional-reports");

  const { filteredAdditionalSections, additionalReportCount } = useReportsIndexFilters({
    periods: [],
    additionalSections,
    query
  });

  // Scope by organisation; pin the user's current project first, then the rest A–Z.
  const organisationProjects = useMemo<ViewProject[]>(() => {
    const currentProject: ViewProject = {
      uuid: project.uuid,
      name: project.name,
      organisationName: project.organisationName,
      organisationUuid: project.organisationUuid
    };
    const others = (projects ?? [])
      .filter(
        item =>
          item.uuid !== project.uuid &&
          (project.organisationUuid == null || item.organisationUuid === project.organisationUuid)
      )
      .map(item => ({
        uuid: item.uuid,
        name: item.name,
        organisationName: item.organisationName,
        organisationUuid: item.organisationUuid
      }))
      .sort(compareProjectName);

    return [currentProject, ...others];
  }, [project.name, project.organisationName, project.organisationUuid, project.uuid, projects]);

  // View order: All Projects → user's current project → remaining organisation projects.
  const viewItems = useMemo<HighLevelSelectorItem[]>(
    () => [
      { label: t("All Projects"), value: ALL_PROJECTS_VIEW_VALUE },
      ...organisationProjects.map(item => ({
        label: item.name ?? t("Project"),
        value: item.uuid
      }))
    ],
    [organisationProjects, t]
  );

  const visibleProjects = useMemo<ViewProject[]>(() => {
    if (isAllProjectsView) return organisationProjects;
    return [organisationProjects[0]];
  }, [isAllProjectsView, organisationProjects]);

  useEffect(() => {
    if (!router.isReady) return;
    const nextView = viewFromQuery === ALL_PROJECTS_VIEW_VALUE ? ALL_PROJECTS_VIEW_VALUE : project.uuid;
    if (nextView !== viewValue) setViewValue(nextView);
  }, [project.uuid, router.isReady, viewFromQuery, viewValue]);

  const handleViewChange = useCallback(
    (nextView: string) => {
      clearSelection();
      setViewValue(nextView);
      setReportCountsByProject({});

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

      void router.push(getReportsIndexUrl("project", nextView));
    },
    [clearSelection, project.uuid, router]
  );

  const handleTabChange = useCallback(
    (tab: string) => {
      clearSelection();
      setActiveTab(tab);
      setReportCountsByProject({});
    },
    [clearSelection]
  );

  const handleQueryChange = useCallback((nextQuery: string) => {
    setQuery(nextQuery);
    setReportCountsByProject({});
  }, []);

  const handleReportCountChange = useCallback((projectUuid: string, count: number) => {
    setReportCountsByProject(current => {
      if (current[projectUuid] === count) return current;
      return { ...current, [projectUuid]: count };
    });
  }, []);

  const handleBulkEdit = useCallback(() => {
    if (selectedReports.length === 1) {
      void router.push(getReportIndexItemPath(selectedReports[0]));
    }
  }, [router, selectedReports]);

  const progressReportCount = useMemo(
    () => Object.values(reportCountsByProject).reduce((total, count) => total + count, 0),
    [reportCountsByProject]
  );
  const reportCount = activeTab === "additional-reports" ? additionalReportCount : progressReportCount;
  const progressSectionsReady =
    !isAllProjectsView || (projectsLoaded && Object.keys(reportCountsByProject).length >= visibleProjects.length);

  return (
    <div className={`min-h-full bg-theme-neutral-200 ${selectedReports.length > 0 ? "pb-24" : "pb-10"}`}>
      <ReportsIndexHeader
        activeTab={activeTab}
        source={source}
        sourceUuid={sourceEntity.uuid}
        projectUuid={project.uuid}
        reportCount={reportCount}
        viewValue={viewValue}
        viewItems={viewItems}
        onTabChange={handleTabChange}
        onViewChange={handleViewChange}
        onQueryChange={handleQueryChange}
      />

      {activeTab === "progress-reports" && (
        <main className="space-y-2.5 bg-theme-neutral-200 px-2.5 pb-2.5">
          {!projectsLoaded && isAllProjectsView ? (
            <Flex minHeight="240px" alignItems="center" justifyContent="center" gap={3}>
              <LoadingIcon boxSize={6} className="animate-spin" color="primary.600" />
              <Text textStyle="400" color="neutral.800">
                {t("Loading reports...")}
              </Text>
            </Flex>
          ) : (
            <>
              {visibleProjects.map((item, index) => {
                const isEntryProject = item.uuid === project.uuid;
                return (
                  <ReportsIndexProjectSection
                    key={item.uuid}
                    projectUuid={item.uuid}
                    source={isEntryProject ? source : "project"}
                    sourceEntityUuid={isEntryProject ? sourceEntity.uuid : item.uuid}
                    query={query}
                    defaultOpen={index === 0}
                    onReportCountChange={handleReportCountChange}
                  />
                );
              })}
              {progressSectionsReady && progressReportCount === 0 && (
                <InlineMessage
                  className="m-4"
                  variant="info-grey"
                  label={t("No reports found")}
                  caption={t("Try changing your search or filters.")}
                />
              )}
            </>
          )}
        </main>
      )}

      {activeTab === "additional-reports" && (
        <AdditionalReportsContent
          sections={filteredAdditionalSections}
          loading={additionalLoading}
          error={additionalError}
        />
      )}

      <ReportsBulkActionToolbar
        visible={selectedReports.length > 0}
        itemCount={selectedReports.length}
        editDisabled={selectedReports.length !== 1}
        onCancel={clearSelection}
        onEdit={handleBulkEdit}
      />
    </div>
  );
};

export default ReportsIndexContent;
