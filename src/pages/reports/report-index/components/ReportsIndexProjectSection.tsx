import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useEffect, useState } from "react";

import { useFullProject } from "@/connections/Entity";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import ListSectionHeader from "@/redesignComponents/containers/Accordion/ListSectionHeader";
import { FolderIcon, FolderOpenIcon, LoadingIcon } from "@/redesignComponents/foundations/Icons";
import TextBadge from "@/redesignComponents/status/Badge/TextBadge";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";

import { getReportsRequiringAttention, ReportsIndexSource } from "../reportIndex.utils";
import { useReportsIndexData } from "../useReportsIndexData";
import { useReportsIndexFilters } from "../useReportsIndexFilters";
import ReportingPeriodSection from "./ReportingPeriodSection";

type ReportsIndexProjectSectionProps = {
  projectUuid: string;
  source: ReportsIndexSource;
  sourceEntityUuid: string;
  query: string;
  defaultOpen?: boolean;
  onReportCountChange?: (projectUuid: string, count: number) => void;
};

const ReportsIndexProjectSection: FC<ReportsIndexProjectSectionProps> = ({
  projectUuid,
  source,
  sourceEntityUuid,
  query,
  defaultOpen = false,
  onReportCountChange
}) => {
  const t = useT();
  const [projectOpen, setProjectOpen] = useState(defaultOpen);
  const [projectLoaded, { data: project }] = useFullProject({ id: projectUuid });
  const { periods, loading, error } = useReportsIndexData(projectUuid, source, sourceEntityUuid);
  const { filteredPeriods, progressReportCount } = useReportsIndexFilters({
    periods,
    additionalSections: [],
    query
  });

  const attentionCount = periods.reduce((total, period) => total + getReportsRequiringAttention(period.reports), 0);

  useEffect(() => {
    onReportCountChange?.(projectUuid, progressReportCount);
  }, [onReportCountChange, projectUuid, progressReportCount]);

  if (!projectLoaded || project == null || loading) {
    return (
      <Flex
        minHeight="160px"
        alignItems="center"
        justifyContent="center"
        gap={3}
        className="rounded bg-theme-neutral-100"
      >
        <LoadingIcon boxSize={5} className="animate-spin" color="primary.600" />
        <Text textStyle="400" color="neutral.800">
          {t("Loading reports...")}
        </Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <InlineMessage
        className="m-2"
        variant="error"
        label={t("Reports could not be loaded")}
        caption={t("Please refresh the page and try again.")}
      />
    );
  }

  if (filteredPeriods.length === 0) {
    return null;
  }

  return (
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
  );
};

export default ReportsIndexProjectSection;
