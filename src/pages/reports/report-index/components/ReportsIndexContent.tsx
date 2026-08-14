import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { useProjectIndex } from "@/connections/Entity";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import ListSectionHeader from "@/redesignComponents/containers/Accordion/ListSectionHeader";
import type { HighLevelSelectorItem } from "@/redesignComponents/Forms/Inputs/HighLevelSelector/HighLevelSelector.types";
import { FolderIcon, FolderOpenIcon, LoadingIcon } from "@/redesignComponents/foundations/Icons";
import TextBadge from "@/redesignComponents/status/Badge/TextBadge";

import { ReportsIndexSourceEntity } from "../reportIndex.types";
import {
  ALL_PROJECTS_VIEW_VALUE,
  getReportIndexItemPath,
  getReportsIndexUrl,
  getReportsRequiringAttention,
  ReportsIndexSource
} from "../reportIndex.utils";
import { useReportsSelection } from "../ReportsSelection.provider";
import { useAdditionalReportsData } from "../useAdditionalReportsData";
import { useReportsIndexData } from "../useReportsIndexData";
import { useReportsIndexFilters } from "../useReportsIndexFilters";
import AdditionalReportsContent from "./AdditionalReportsContent";
import ReportingPeriodSection from "./ReportingPeriodSection";
import ReportsBulkActionToolbar from "./ReportsBulkActionToolbar";
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
  const [projectOpen, setProjectOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [viewValue, setViewValue] = useState(
    viewFromQuery === ALL_PROJECTS_VIEW_VALUE ? ALL_PROJECTS_VIEW_VALUE : project.uuid
  );
  const { selectedReports, clearSelection } = useReportsSelection();
  const [projectsLoaded, { data: projects }] = useProjectIndex({});
  const isAllProjectsView = viewValue === ALL_PROJECTS_VIEW_VALUE;

  const {
    periods,
    loading: progressLoading,
    error: progressError
  } = useReportsIndexData(project.uuid, source, sourceEntity.uuid);
  const {
    sections: additionalSections,
    loading: additionalLoading,
    error: additionalError
  } = useAdditionalReportsData(project, activeTab === "additional-reports");

  const { filteredPeriods, filteredAdditionalSections, progressReportCount, additionalReportCount } =
    useReportsIndexFilters({ periods, additionalSections, query });

  const reportCount = activeTab === "additional-reports" ? additionalReportCount : progressReportCount;
  const attentionCount = useMemo(
    () => periods.reduce((total, period) => total + getReportsRequiringAttention(period.reports), 0),
    [periods]
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

  const handleBulkEdit = useCallback(() => {
    if (selectedReports.length === 1) {
      void router.push(getReportIndexItemPath(selectedReports[0]));
    }
  }, [router, selectedReports]);

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
              <Box background="neutral.100" h="full" p={4}>
                <Text textStyle="400-bold">{t("Reports could not be loaded")}</Text>
                <Text textStyle="400">{t("Please refresh the page and try again.")}</Text>
              </Box>
            ) : filteredPeriods.length === 0 ? (
              <Box background="neutral.100" h="full" p={4}>
                <Text textStyle="400-bold">{t("No results found")}</Text>
                <Text textStyle="400">{t("Try changing your search or filters.")}</Text>
              </Box>
            ) : (
              <Accordion
                variant="tertiary"
                open={projectOpen}
                onOpenChange={setProjectOpen}
                className="bg-theme-neutral-100 !m-0 rounded"
                classNameHeader="!mb-0"
                isScrollable={false}
                header={
                  <ListSectionHeader
                    level="top-level"
                    title={isAllProjectsView ? t("All Projects") : project.name ?? t("Project")}
                    caption={isAllProjectsView ? "" : project.organisationName ?? ""}
                    icon={
                      projectOpen ? (
                        <FolderOpenIcon minWidth={5} width={5} height={"auto"} color="primary.600" />
                      ) : (
                        <FolderIcon minWidth={5} width={5} height={"auto"} color="neutral.400" />
                      )
                    }
                    statusLabels={
                      attentionCount > 0 ? (
                        <TextBadge>{t("{count} Require Attention", { count: attentionCount })}</TextBadge>
                      ) : null
                    }
                  />
                }
              >
                <div className="bg-theme-neutral-200 space-y-0.5 pt-0.5">
                  {filteredPeriods.map((period, index) => (
                    <ReportingPeriodSection
                      key={period.id}
                      period={period}
                      project={project}
                      defaultOpen={index === 0}
                    />
                  ))}
                </div>
              </Accordion>
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

        <ReportsBulkActionToolbar
          visible={selectedReports.length > 0}
          itemCount={selectedReports.length}
          editDisabled={selectedReports.length !== 1}
          onCancel={clearSelection}
          onEdit={handleBulkEdit}
        />
      </PageContent>
    </>
  );
};

export default ReportsIndexContent;
