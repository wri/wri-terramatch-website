import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useEffect, useMemo, useState } from "react";

import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import ListSectionHeader from "@/redesignComponents/containers/Accordion/ListSectionHeader";
import { LoadingIcon } from "@/redesignComponents/foundations/Icons";
import TextBadge from "@/redesignComponents/status/Badge/TextBadge";

import { ReportsIndexPeriod, ReportsIndexProjectSection } from "../reportIndex.types";
import { getReportsRequiringAttention } from "../reportIndex.utils";
import ReportingPeriodSection from "./ReportingPeriodSection";

type ProjectReportsSectionProps = {
  section: ReportsIndexProjectSection;
  sectionName?: string;
  unfilteredPeriods?: ReportsIndexPeriod[];
  defaultOpen?: boolean;
  metricsReady?: boolean;
  hasReportSubset?: boolean;
  indexHref?: string;
  expandForPeriodFilter?: boolean;
  restoreSectionId?: string;
  restorePeriodId?: string;
  restoreReportId?: string;
  onRowRestored?: () => void;
  /** Overrides the attention count that is otherwise calculated from the section's reports. */
  attentionCount?: number;
  loading?: boolean;
  onOpen?: () => void;
};

const ProjectReportsSection: FC<ProjectReportsSectionProps> = ({
  section,
  sectionName,
  unfilteredPeriods,
  defaultOpen = false,
  metricsReady = true,
  hasReportSubset = false,
  indexHref,
  expandForPeriodFilter = false,
  restoreSectionId,
  restorePeriodId,
  restoreReportId,
  onRowRestored,
  attentionCount,
  loading = false,
  onOpen
}) => {
  const t = useT();
  const [open, setOpen] = useState(restoreSectionId != null ? section.id === restoreSectionId : defaultOpen);

  useEffect(() => {
    if (expandForPeriodFilter) {
      setOpen(true);
    }
  }, [expandForPeriodFilter]);

  useEffect(() => {
    if (open) onOpen?.();
  }, [onOpen, open]);

  const periodsAttentionCount = useMemo(
    () => section.periods.reduce((total, period) => total + getReportsRequiringAttention(period.reports), 0),
    [section.periods]
  );
  const displayedAttentionCount = attentionCount ?? periodsAttentionCount;

  return (
    <Accordion
      variant="tertiary"
      open={open}
      onOpenChange={setOpen}
      className="overflow-hidden rounded bg-theme-neutral-100"
      classNameHeader="!mb-0"
      header={
        <ListSectionHeader
          level="top-level"
          title={sectionName ?? section.name ?? t("Project")}
          titleHref={`/project/${section.id}`}
          caption={section.organisationName ?? ""}
          open={open}
          statusLabels={
            displayedAttentionCount > 0 ? (
              <TextBadge>{t("{count} Require Attention", { count: displayedAttentionCount })}</TextBadge>
            ) : null
          }
        />
      }
    >
      <div className="space-y-0.5 bg-theme-neutral-200 pt-0.5">
        {!open ? null : loading ? (
          <Flex minHeight="5rem" alignItems="center" justifyContent="center" gap={3} bg="neutral.100">
            <LoadingIcon boxSize={6} className="animate-spin" color="primary.700" />
            <Text textStyle="400" color="neutral.800">
              {t("Loading reports...")}
            </Text>
          </Flex>
        ) : (
          section.periods.map((period, index) => (
            <ReportingPeriodSection
              key={period.id}
              period={period}
              allPeriodReports={unfilteredPeriods?.find(item => item.id === period.id)?.reports}
              defaultOpen={
                restorePeriodId != null ? period.id === restorePeriodId : expandForPeriodFilter || index === 0
              }
              expandForPeriodFilter={expandForPeriodFilter}
              metricsReady={metricsReady}
              hasReportSubset={hasReportSubset}
              indexHref={indexHref}
              restoreReportId={period.id === restorePeriodId ? restoreReportId : undefined}
              onRowRestored={onRowRestored}
            />
          ))
        )}
      </div>
    </Accordion>
  );
};

export default ProjectReportsSection;
