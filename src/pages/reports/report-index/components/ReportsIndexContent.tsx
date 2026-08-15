import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { useProjectIndex } from "@/connections/Entity";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import type { HighLevelSelectorItem } from "@/redesignComponents/Forms/Inputs/HighLevelSelector/HighLevelSelector.types";
import { LoadingIcon } from "@/redesignComponents/foundations/Icons";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";

import { ReportsIndexSourceEntity } from "../reportIndex.types";
import { ALL_PROJECTS_VIEW_VALUE, getReportsIndexUrl, ReportsIndexSource } from "../reportIndex.utils";
import { useReportsSelectionActions } from "../ReportsSelection.provider";
import { useAdditionalReportsData } from "../useAdditionalReportsData";
import { useReportsIndexData } from "../useReportsIndexData";
import { useReportsIndexFilters } from "../useReportsIndexFilters";
import AdditionalReportsContent from "./AdditionalReportsContent";
import ProjectReportsSection from "./ProjectReportsSection";
import ReportsIndexBulkBar from "./ReportsIndexBulkBar";
import ReportsIndexHeader from "./ReportsIndexHeader";

type ReportsIndexContentProps = {
  project: ProjectFullDto;
  source: ReportsIndexSource;
  sourceEntity: ReportsIndexSourceEntity;
};

const ReportsIndexContent = ({ project, source, sourceEntity }: ReportsIndexContentProps) => {
  const t = useT();
  const router = useRouter();
  const viewFromQuery = typeof router.query.view === "string" ? router.query.view : undefined;
  const [activeTab, setActiveTab] = useState("progress-reports");
  const [query, setQuery] = useState("");
  const [viewValue, setViewValue] = useState(
    viewFromQuery === ALL_PROJECTS_VIEW_VALUE ? ALL_PROJECTS_VIEW_VALUE : project.uuid
  );
  const { clearSelection } = useReportsSelectionActions();
  const [reloadNonce, setReloadNonce] = useState(0);
  const [projectsLoaded, { data: projects }] = useProjectIndex({});
  const isAllProjectsView = viewValue === ALL_PROJECTS_VIEW_VALUE;

  const {
    sections: progressSections,
    loading: progressLoading,
    error: progressError
  } = useReportsIndexData(project, source, sourceEntity.uuid, isAllProjectsView, reloadNonce);
  const {
    sections: additionalSections,
    loading: additionalLoading,
    error: additionalError
  } = useAdditionalReportsData(project, activeTab === "additional-reports", isAllProjectsView);

  const { filteredProgressSections, filteredAdditionalSections, progressReportCount, additionalReportCount } =
    useReportsIndexFilters({ progressSections, additionalSections, query });

  const reportCount = activeTab === "additional-reports" ? additionalReportCount : progressReportCount;

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

    return [{ label: t("All Projects"), value: ALL_PROJECTS_VIEW_VALUE }, ...items];
  }, [project.name, project.uuid, projects, t]);

  useEffect(() => {
    if (!router.isReady) return;
    const nextView = viewFromQuery === ALL_PROJECTS_VIEW_VALUE ? ALL_PROJECTS_VIEW_VALUE : project.uuid;
    if (nextView !== viewValue) setViewValue(nextView);
  }, [project.uuid, router.isReady, viewFromQuery, viewValue]);

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

      void router.push(getReportsIndexUrl("project", nextView));
    },
    [clearSelection, project.uuid, router]
  );

  const handleTabChange = useCallback(
    (tab: string) => {
      clearSelection();
      setActiveTab(tab);
    },
    [clearSelection]
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
        onTabChange={handleTabChange}
        onViewChange={handleViewChange}
        onQueryChange={setQuery}
      />
      <PageContent className="px-2 py-0">
        {activeTab === "progress-reports" && (
          <>
            {progressLoading || (isAllProjectsView && !projectsLoaded) ? (
              <Flex minHeight="240px" alignItems="center" justifyContent="center" gap={3}>
                <LoadingIcon boxSize={6} className="animate-spin" color="primary.700" />
                <Text textStyle="400" color="neutral.800">
                  {t("Loading reports...")}
                </Text>
              </Flex>
            ) : progressError ? (
              <InlineMessage
                className="m-4"
                variant="error"
                label={t("Reports could not be loaded")}
                caption={t("Please refresh the page and try again.")}
              />
            ) : filteredProgressSections.length === 0 ? (
              <InlineMessage
                className="m-4"
                variant="info-grey"
                label={t("No reports found")}
                caption={t("Try changing your search or filters.")}
              />
            ) : (
              <div className="space-y-4">
                {filteredProgressSections.map((section, index) => (
                  <ProjectReportsSection key={section.id} section={section} defaultOpen={index === 0} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "additional-reports" && (
          <AdditionalReportsContent
            sections={filteredAdditionalSections}
            loading={additionalLoading}
            error={additionalError}
          />
        )}

        <ReportsIndexBulkBar onReportsChanged={handleReportsChanged} />
      </PageContent>
    </>
  );
};

export default ReportsIndexContent;
