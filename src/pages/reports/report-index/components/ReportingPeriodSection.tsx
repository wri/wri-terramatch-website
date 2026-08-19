import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useState } from "react";

import useCollectionsTotal from "@/components/extensive/TrackingCollapseGrid/hooks";
import { TrackingType } from "@/components/extensive/TrackingCollapseGrid/types";
import { getShortPeriodLabel } from "@/components/extensive/WizardForm/utils";
import {
  DemographicsLoader,
  getReportKeyIndicatorFramework
} from "@/components/reports/KeyIndicators/reportKeyIndicatorPrimitives";
import { useFullProjectReport } from "@/connections/Entity";
import FrameworkProvider, { toFramework } from "@/context/framework.provider";
import { DemographicCollections } from "@/generated/v3/entityService/entityServiceConstants";
import { useDate } from "@/hooks/useDate";
import { useReportingWindow } from "@/hooks/useReportingWindow";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import ListSectionHeader from "@/redesignComponents/containers/Accordion/ListSectionHeader";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { DueIcon, JobsIcon, RegenerationIcon, SeedlingsIcon, TreeIcon } from "@/redesignComponents/foundations/Icons";

import { ReportsIndexPeriod } from "../reportIndex.types";
import { getReportingPeriodDueDateType } from "../reportIndex.utils";
import ReportAttentionStatusLabels from "./ReportAttentionStatusLabels";
import ReportsIndexTable from "./ReportsIndexTable";

type ReportingPeriodSectionProps = {
  period: ReportsIndexPeriod;
  defaultOpen?: boolean;
  metricsReady?: boolean;
  indexHref?: string;
};

type PeriodJobsMetricCardProps = {
  projectReportUuid: string;
  frameworkKey: string | null;
  className: string;
};

const PeriodJobsMetricCard: FC<PeriodJobsMetricCardProps> = ({ projectReportUuid, frameworkKey, className }) => {
  const t = useT();
  const framework = getReportKeyIndicatorFramework(frameworkKey);

  const trackingType = (framework === "terrafund" ? "jobs" : "workdays") as TrackingType;
  const collections =
    framework === "hbf"
      ? (["direct"] as const)
      : framework === "ppc"
      ? DemographicCollections.WORKDAYS_PROJECT
      : DemographicCollections.JOBS_PROJECT;

  const total = useCollectionsTotal({
    entity: "projectReports",
    uuid: projectReportUuid,
    domain: "demographics",
    trackingType,
    collections
  });

  if (total == null) return <DemographicsLoader className="h-auto w-48" />;

  const title = framework === "terrafund" ? t("Jobs Created") : t("Workdays Created");
  const tooltipContent =
    framework === "terrafund"
      ? t("Total jobs created in this reporting period.")
      : t("Total workdays created in this reporting period.");

  return (
    <MetricCard
      title={title}
      color="primary.600"
      progress={total}
      goal={0}
      icon={<JobsIcon color="primary.600" boxSize="0.875rem" />}
      tooltipContent={tooltipContent}
      className={className}
    />
  );
};

const ReportingPeriodSection = ({
  period,
  defaultOpen = false,
  metricsReady = true,
  indexHref
}: ReportingPeriodSectionProps) => {
  const t = useT();
  const { format } = useDate();
  const [open, setOpen] = useState(defaultOpen);
  const periodLabel = useReportingWindow(toFramework(period.frameworkKey), period.dueAt ?? undefined);
  const taskTitle = t("Reporting Task {window}", { window: periodLabel });
  const metricCardClassName = "w-auto min-w-[12.5rem] border-[0.125rem] bg-theme-neutral-100";
  const projectReportUuid = metricsReady ? period.projectReportUuid : null;

  const [reportLoaded, { data: projectReport }] = useFullProjectReport({
    id: open && projectReportUuid != null ? projectReportUuid : undefined
  });

  const metricsLoading = open && (!metricsReady || (projectReportUuid != null && !reportLoaded));
  const treesPlantedCount = projectReport?.treesPlantedCount ?? 0;
  const seedsPlantedCount = projectReport?.seedsPlantedCount ?? 0;
  const regeneratedTreesCount = projectReport?.regeneratedTreesCount ?? 0;
  const frameworkKey = projectReport?.frameworkKey ?? period.frameworkKey;
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
                <div className="mb-5 flex flex-wrap gap-4">
                  <MetricCard
                    title={t("Trees Growing")}
                    color="secondary.600"
                    progress={treesPlantedCount}
                    goal={0}
                    icon={<TreeIcon color="secondary.600" boxSize="0.875rem" />}
                    tooltipContent={t("Total trees planted in this reporting period.")}
                    className={metricCardClassName}
                  />
                  <MetricCard
                    title={t("Seedlings Grown")}
                    color="secondary.600"
                    progress={seedsPlantedCount}
                    goal={0}
                    icon={<SeedlingsIcon color="secondary.600" boxSize="0.875rem" />}
                    tooltipContent={t("Total seedlings and seeds reported in this reporting period.")}
                    className={metricCardClassName}
                  />
                  <MetricCard
                    title={t("Trees Regenerated")}
                    color="secondary.600"
                    progress={regeneratedTreesCount}
                    goal={0}
                    icon={<RegenerationIcon color="secondary.600" boxSize="0.875rem" />}
                    tooltipContent={t("Total naturally regenerated trees reported in this reporting period.")}
                    className={metricCardClassName}
                  />
                  {projectReportUuid != null ? (
                    <PeriodJobsMetricCard
                      projectReportUuid={projectReportUuid}
                      frameworkKey={frameworkKey}
                      className={metricCardClassName}
                    />
                  ) : (
                    <MetricCard
                      title={t("Jobs Created")}
                      color="primary.600"
                      progress={0}
                      goal={0}
                      icon={<JobsIcon color="primary.600" boxSize="0.875rem" />}
                      tooltipContent={t("Total jobs created in this reporting period.")}
                      className={metricCardClassName}
                    />
                  )}
                </div>
              </FrameworkProvider>
            )}
            <ReportsIndexTable reports={period.reports} indexHref={indexHref} />
          </div>
        ) : null}
      </Accordion>
    </Box>
  );
};

export default ReportingPeriodSection;
