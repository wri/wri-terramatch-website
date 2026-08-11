import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useMemo, useState } from "react";

import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import ListSectionHeader from "@/redesignComponents/containers/Accordion/ListSectionHeader";
import { FolderIcon, FolderOpenIcon, LoadingIcon } from "@/redesignComponents/foundations/Icons";
import TextBadge from "@/redesignComponents/status/Badge/TextBadge";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";

import { ReportsIndexSourceEntity } from "../reportIndex.types";
import { getReportsRequiringAttention, ReportsIndexSource } from "../reportIndex.utils";
import { useAdditionalReportsData } from "../useAdditionalReportsData";
import { useReportsIndexData } from "../useReportsIndexData";
import AdditionalReportsContent from "./AdditionalReportsContent";
import ReportingPeriodSection from "./ReportingPeriodSection";
import ReportsIndexHeader from "./ReportsIndexHeader";

type ReportsIndexContentProps = {
  project: ProjectFullDto;
  source: ReportsIndexSource;
  sourceEntity: ReportsIndexSourceEntity;
};

const ReportsIndexContent = ({ project, source, sourceEntity }: ReportsIndexContentProps) => {
  const t = useT();
  const [activeTab, setActiveTab] = useState("progress-reports");
  const [projectOpen, setProjectOpen] = useState(true);
  const [query, setQuery] = useState("");
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

  const filteredPeriods = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (normalizedQuery === "") return periods;

    return periods
      .map(period => ({
        ...period,
        reports: period.reports.filter(report => {
          return [report.name, report.type, report.sourceName, report.projectName].some(value =>
            (value ?? "").toLocaleLowerCase().includes(normalizedQuery)
          );
        })
      }))
      .filter(period => period.reports.length > 0);
  }, [periods, query]);

  const filteredAdditionalSections = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (normalizedQuery === "") return additionalSections;

    return additionalSections
      .map(section => ({
        ...section,
        groups: section.groups
          .map(group => ({
            ...group,
            reports: group.reports.filter(report =>
              report.searchTerms.some(value => value.toLocaleLowerCase().includes(normalizedQuery))
            )
          }))
          .filter(group => group.reports.length > 0)
      }))
      .filter(section => section.groups.length > 0);
  }, [additionalSections, query]);

  const progressReportCount = useMemo(
    () => filteredPeriods.reduce((total, period) => total + period.reports.length, 0),
    [filteredPeriods]
  );
  const additionalReportCount = useMemo(
    () =>
      filteredAdditionalSections.reduce(
        (sectionTotal, section) =>
          sectionTotal + section.groups.reduce((groupTotal, group) => groupTotal + group.reports.length, 0),
        0
      ),
    [filteredAdditionalSections]
  );
  const reportCount = activeTab === "additional-reports" ? additionalReportCount : progressReportCount;
  const attentionCount = useMemo(
    () => periods.reduce((total, period) => total + getReportsRequiringAttention(period.reports), 0),
    [periods]
  );
  const selectedViewLabel =
    source === "project" ? project.name ?? t("Project") : sourceEntity.name ?? project.name ?? "";

  return (
    <div className="min-h-full bg-theme-neutral-200 pb-10">
      <ReportsIndexHeader
        activeTab={activeTab}
        reportCount={reportCount}
        selectedViewLabel={selectedViewLabel}
        onTabChange={setActiveTab}
        onQueryChange={setQuery}
      />

      {activeTab === "progress-reports" && (
        <main className="bg-theme-neutral-200 px-2.5 pb-2.5">
          {progressLoading ? (
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
                  title={project.name ?? t("Project")}
                  caption={project.organisationName ?? ""}
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
    </div>
  );
};

export default ReportsIndexContent;
