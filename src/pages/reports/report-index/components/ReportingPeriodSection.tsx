import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { ReactNode, useEffect, useState } from "react";

import useCollectionsTotal from "@/components/extensive/TrackingCollapseGrid/hooks";
import { TrackingType } from "@/components/extensive/TrackingCollapseGrid/types";
import { getShortPeriodLabel } from "@/components/extensive/WizardForm/utils";
import {
  DemographicsLoader,
  getReportKeyIndicatorFramework,
  getTooltipContent
} from "@/components/reports/KeyIndicators/reportKeyIndicatorPrimitives";
import { useFullProjectReport } from "@/connections/Entity";
import FrameworkProvider, { toFramework } from "@/context/framework.provider";
import { DemographicCollections } from "@/generated/v3/entityService/entityServiceConstants";
import { ProjectReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useDate } from "@/hooks/useDate";
import { useReportingWindow } from "@/hooks/useReportingWindow";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import ListSectionHeader from "@/redesignComponents/containers/Accordion/ListSectionHeader";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { DueIcon, JobsIcon, RegenerationIcon, SeedlingsIcon, TreeIcon } from "@/redesignComponents/foundations/Icons";

import { ReportsIndexPeriod, ReportsIndexReport } from "../reportIndex.types";
import { getReportingPeriodDueDateType } from "../reportIndex.utils";
import { useReportingPeriodMetricCards, useReportingPeriodMetrics } from "../useReportingPeriodMetrics";
import ReportAttentionStatusLabels from "./ReportAttentionStatusLabels";
import ReportsIndexTable from "./ReportsIndexTable";

type ReportingPeriodSectionProps = {
  period: ReportsIndexPeriod;
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
  hasReportSubset: boolean;
  projectReport: ProjectReportFullDto | null | undefined;
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
  hasReportSubset,
  projectReport,
  projectReportUuid,
  frameworkKey,
  className
}: ReportingPeriodMetricsRowProps) => {
  const jobsTotal = usePeriodJobsTotal(open ? projectReportUuid : null, frameworkKey);
  const {
    loading: subsetMetricsLoading,
    periodTotals,
    selectionTotals,
    jobsProgress
  } = useReportingPeriodMetrics({
    open,
    reports,
    hasReportSubset,
    projectReport,
    jobsTotal
  });
  const cards = useReportingPeriodMetricCards(frameworkKey, periodTotals, jobsProgress, selectionTotals);
  const jobsLoading = projectReportUuid != null && jobsTotal == null;

  if (subsetMetricsLoading || jobsLoading) {
    return <DemographicsLoader className="mb-5 h-10 w-full" />;
  }

  return (
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
          className={className}
        />
      ))}
    </div>
  );
};

const ReportingPeriodSection = ({
  period,
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

  useEffect(() => {
    if (expandForPeriodFilter) {
      setOpen(true);
    }
  }, [expandForPeriodFilter]);

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
                  hasReportSubset={hasReportSubset}
                  projectReport={projectReport}
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
