import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { ReactNode, useEffect, useMemo, useState } from "react";

import useCollectionsTotal from "@/components/extensive/TrackingCollapseGrid/hooks";
import { TrackingType } from "@/components/extensive/TrackingCollapseGrid/types";
import { getShortPeriodLabel } from "@/components/extensive/WizardForm/utils";
import HighLevelMetricsCard from "@/components/reports/HighLevelMetrics/HighLevelMetricsCard";
import {
  DemographicsLoader,
  getReportKeyIndicatorFramework,
  getTooltipContent
} from "@/components/reports/KeyIndicators/reportKeyIndicatorPrimitives";
import { useFullProjectReport } from "@/connections/Entity";
import FrameworkProvider, { toFramework } from "@/context/framework.provider";
import { DemographicCollections } from "@/generated/v3/entityService/entityServiceConstants";
import { useDate } from "@/hooks/useDate";
import { useReportingWindow } from "@/hooks/useReportingWindow";
import { useReportsIndexAnalytics } from "@/hooks/useReportsIndexAnalytics";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import ListSectionHeader from "@/redesignComponents/containers/Accordion/ListSectionHeader";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { DueIcon, JobsIcon, RegenerationIcon, SeedlingsIcon, TreeIcon } from "@/redesignComponents/foundations/Icons";
import { PAGE_CONTEXT_REPORTS_INDEX } from "@/utils/analytics/pageContext";

import { ReportsIndexPeriod, ReportsIndexReport } from "../reportIndex.types";
import {
  getReportingPeriodAnalyticsStatus,
  getReportingPeriodDueDateType,
  getReportsRequiringAttention
} from "../reportIndex.utils";
import { useReportingPeriodMetricCards, useReportingPeriodMetrics } from "../useReportingPeriodMetrics";
import ReportAttentionStatusLabels from "./ReportAttentionStatusLabels";
import ReportsIndexTable from "./ReportsIndexTable";

type ReportingPeriodSectionProps = {
  period: ReportsIndexPeriod;
  allPeriodReports?: ReportsIndexReport[];
  defaultOpen?: boolean;
  expandForPeriodFilter?: boolean;
  metricsReady?: boolean;
  hasReportSubset?: boolean;
  indexHref?: string;
  restoreReportId?: string;
  onRowRestored?: () => void;
};

type ReportingPeriodMetricsRowProps = {
  open: boolean;
  reports: ReportsIndexReport[];
  allReports: ReportsIndexReport[];
  hasReportSubset: boolean;
  projectReportUuid: string | null;
  frameworkKey: string | null;
  className: string;
};

const usePeriodJobsTotal = (projectReportUuid: string | null, frameworkKey: string | null) => {
  const framework = getReportKeyIndicatorFramework(frameworkKey);
  const trackingType = (framework === "terrafund" ? "jobs" : "workdays") as TrackingType;
  const collections =
    framework === "hbf"
      ? (["direct"] as const)
      : framework === "ppc"
      ? DemographicCollections.WORKDAYS_PROJECT
      : DemographicCollections.JOBS_PROJECT;

  return useCollectionsTotal({
    entity: "projectReports",
    uuid: projectReportUuid ?? "",
    domain: "demographics",
    trackingType,
    collections
  });
};

const metricIcon = (key: string, color: string): ReactNode => {
  if (key === "jobs") return <JobsIcon color={color} boxSize="0.875rem" />;
  if (key === "seedlings-grown") return <SeedlingsIcon color={color} boxSize="0.875rem" />;
  if (key === "trees-regenerated") return <RegenerationIcon color={color} boxSize="0.875rem" />;
  return <TreeIcon color={color} boxSize="0.875rem" />;
};

const ReportingPeriodMetricsRow = ({
  open,
  reports,
  allReports,
  hasReportSubset,
  projectReportUuid,
  frameworkKey,
  className
}: ReportingPeriodMetricsRowProps) => {
  const jobsTotal = usePeriodJobsTotal(open ? projectReportUuid : null, frameworkKey);
  const {
    loading: subsetMetricsLoading,
    periodTotals,
    filteredTotals,
    selectionTotals,
    jobsProgress
  } = useReportingPeriodMetrics({
    open,
    reports,
    allReports,
    hasReportSubset,
    jobsTotal
  });
  const cards = useReportingPeriodMetricCards(
    frameworkKey,
    periodTotals,
    jobsProgress,
    filteredTotals,
    selectionTotals
  );
  const jobsLoading = projectReportUuid != null && jobsTotal == null;
  const framework = getReportKeyIndicatorFramework(frameworkKey);
  const metricScope = selectionTotals != null ? "selection" : "period";

  if (subsetMetricsLoading || jobsLoading) {
    return <DemographicsLoader className="mb-5 h-10 w-full" />;
  }

  const cardsRow = (
    <div className="mb-5 flex flex-wrap gap-4">
      {cards.map(card => (
        <MetricCard
          key={card.key}
          title={card.title}
          color={card.color}
          progress={card.progress}
          goal={0}
          icon={metricIcon(card.key, card.color)}
          tooltipContent={getTooltipContent({ title: card.title, tooltip: card.tooltip })}
          selection={card.selection}
          filtered={card.filtered}
          metricLabel={card.metricName}
          className={className}
        />
      ))}
    </div>
  );

  if (projectReportUuid == null) {
    return cardsRow;
  }

  return (
    <HighLevelMetricsCard
      entityType="project-report"
      entityId={projectReportUuid}
      pageContext={PAGE_CONTEXT_REPORTS_INDEX}
      framework={framework}
      metricScope={metricScope}
    >
      {cardsRow}
    </HighLevelMetricsCard>
  );
};

const ReportingPeriodSection = ({
  period,
  allPeriodReports,
  defaultOpen = false,
  expandForPeriodFilter = false,
  metricsReady = true,
  hasReportSubset = false,
  indexHref,
  restoreReportId,
  onRowRestored
}: ReportingPeriodSectionProps) => {
  const t = useT();
  const { format } = useDate();
  const [open, setOpen] = useState(defaultOpen);
  const { trackAttentionDisplayed } = useReportsIndexAnalytics();

  useEffect(() => {
    if (expandForPeriodFilter) {
      setOpen(true);
    }
  }, [expandForPeriodFilter]);

  const attentionCount = useMemo(() => getReportsRequiringAttention(period.reports), [period.reports]);
  const periodStatus = getReportingPeriodAnalyticsStatus(period.dueAt, period.reports);

  useEffect(() => {
    if (attentionCount === 0) return;
    trackAttentionDisplayed({ attentionCount, periodStatus });
  }, [attentionCount, period.id, periodStatus, trackAttentionDisplayed]);

  const periodLabel = useReportingWindow(toFramework(period.frameworkKey), period.dueAt ?? undefined);
  const taskTitle = t("Reporting Task {window}", { window: periodLabel });
  const metricCardClassName = "w-auto min-w-[12.5rem] border-[0.125rem] bg-theme-neutral-100";
  const projectReportUuid = metricsReady ? period.projectReportUuid : null;

  const [reportLoaded, { data: projectReport }] = useFullProjectReport({
    id: open && projectReportUuid != null ? projectReportUuid : undefined
  });
  const frameworkKey = projectReport?.frameworkKey ?? period.frameworkKey;
  const metricsLoading = open && (!metricsReady || (projectReportUuid != null && !reportLoaded));
  const dueDateType = getReportingPeriodDueDateType(period.dueAt, period.reports);
  const formattedDueDate = period.dueAt == null ? undefined : format(period.dueAt);
  const dueDateLabel =
    formattedDueDate == null
      ? undefined
      : dueDateType === "info-white"
      ? formattedDueDate
      : t("{date}", { date: formattedDueDate });

  return (
    <Box bg="neutral.100">
      <Accordion
        variant="quaternary"
        open={open}
        onOpenChange={setOpen}
        className="bg-theme-neutral-100"
        classNameHeader="!mb-0"
        header={
          <ListSectionHeader
            level="sub-level"
            label={t("Reporting Period")}
            title={getShortPeriodLabel(taskTitle ?? "", false)}
            dueIcon={
              <Flex alignItems="center">
                <DueIcon color={dueDateType === "error" ? "error.500" : undefined} />
                <Text textStyle="200">
                  {t("Overdue:")}
                  {"\u00A0"}
                </Text>
              </Flex>
            }
            dueDate={dueDateLabel}
            dueDateType={dueDateType}
            statusLabels={<ReportAttentionStatusLabels reports={period.reports} />}
          />
        }
      >
        {open ? (
          <div className="bg-theme-neutral-100 p-4">
            {metricsLoading ? (
              <DemographicsLoader className="mb-5 h-10 w-full" />
            ) : (
              <FrameworkProvider frameworkKey={frameworkKey}>
                <ReportingPeriodMetricsRow
                  open={open}
                  reports={period.reports}
                  allReports={allPeriodReports ?? period.reports}
                  hasReportSubset={hasReportSubset}
                  projectReportUuid={projectReportUuid}
                  frameworkKey={frameworkKey}
                  className={metricCardClassName}
                />
              </FrameworkProvider>
            )}
            <ReportsIndexTable
              reports={period.reports}
              indexHref={indexHref}
              restoreRowId={restoreReportId}
              onRowRestored={onRowRestored}
            />
          </div>
        ) : null}
      </Accordion>
    </Box>
  );
};

export default ReportingPeriodSection;
