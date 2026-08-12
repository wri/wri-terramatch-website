import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useProjectIndex } from "@/connections/Entity";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import ListSectionHeader from "@/redesignComponents/containers/Accordion/ListSectionHeader";
import type { HighLevelSelectorItem } from "@/redesignComponents/Forms/Inputs/HighLevelSelector/HighLevelSelector.types";
import { FolderIcon, FolderOpenIcon, LoadingIcon } from "@/redesignComponents/foundations/Icons";
import TextBadge from "@/redesignComponents/status/Badge/TextBadge";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";

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
        onQueryChange={setQuery}
      />

      {activeTab === "progress-reports" && (
        <main className="bg-theme-neutral-200 px-2.5 pb-2.5">
          {progressLoading || (isAllProjectsView && !projectsLoaded) ? (
            <Flex minHeight="240px" alignItems="center" justifyContent="center" gap={3}>
              <LoadingIcon boxSize={6} className="animate-spin" color="primary.600" />
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
          ) : filteredPeriods.length === 0 ? (
            <InlineMessage
              className="m-4"
              variant="info-grey"
              label={t("No reports found")}
              caption={t("Try changing your search or filters.")}
            />
          ) : (
            <Accordion
              variant="tertiary"
              open={projectOpen}
              onOpenChange={setProjectOpen}
              className="overflow-hidden rounded bg-theme-neutral-100"
              classNameHeader="!mb-0"
              header={
                <ListSectionHeader
                  level="top-level"
                  title={isAllProjectsView ? t("All Projects") : project.name ?? t("Project")}
                  caption={isAllProjectsView ? "" : project.organisationName ?? ""}
                  icon={
                    projectOpen ? (
                      <FolderOpenIcon boxSize={5} color="primary.600" />
                    ) : (
                      <FolderIcon boxSize={5} color="neutral.400" />
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
              <div className="space-y-0.5 bg-theme-neutral-200 pt-0.5">
                {filteredPeriods.map((period, index) => (
                  <ReportingPeriodSection key={period.id} period={period} project={project} defaultOpen={index === 0} />
                ))}
              </div>
            </Accordion>
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
