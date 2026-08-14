import { Box, Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useMemo, useState } from "react";

import useCollectionsTotal from "@/components/extensive/TrackingCollapseGrid/hooks";
import { TrackingType } from "@/components/extensive/TrackingCollapseGrid/types";
import { getShortPeriodLabel } from "@/components/extensive/WizardForm/utils";
import { toFramework } from "@/context/framework.provider";
import { DemographicCollections } from "@/generated/v3/entityService/entityServiceConstants";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useDate } from "@/hooks/useDate";
import { useReportingWindow } from "@/hooks/useReportingWindow";
import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import ListSectionHeader from "@/redesignComponents/containers/Accordion/ListSectionHeader";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { JobsIcon, RegenerationIcon, SeedlingsIcon, TreeIcon } from "@/redesignComponents/foundations/Icons";

import { ReportsIndexPeriod } from "../reportIndex.types";
import { getReportStatusCounts } from "../reportIndex.utils";
import ReportsIndexTable from "./ReportsIndexTable";

type ReportingPeriodSectionProps = {
  period: ReportsIndexPeriod;
  project: ProjectFullDto;
  defaultOpen?: boolean;
};

type PeriodJobsMetricCardProps = {
  projectReportUuid: string;
  className: string;
};

const PeriodJobsMetricCard: FC<PeriodJobsMetricCardProps> = ({ projectReportUuid, className }) => {
  const t = useT();
  const jobsCreated =
    useCollectionsTotal({
      entity: "projectReports",
      uuid: projectReportUuid,
      domain: "demographics",
      trackingType: "jobs" as TrackingType,
      collections: DemographicCollections.JOBS_PROJECT
    }) ?? 0;

  return (
    <MetricCard
      title={t("Jobs Created")}
      color="primary.600"
      progress={jobsCreated}
      goal={0}
      icon={<JobsIcon color="primary.600" boxSize="0.875rem" />}
      tooltipContent={t("Total jobs created in this reporting period.")}
      className={className}
    />
  );
};

const ReportingPeriodSection = ({ period, project, defaultOpen = false }: ReportingPeriodSectionProps) => {
  const t = useT();
  const { format } = useDate();
  const [open, setOpen] = useState(defaultOpen);
  const periodLabel = useReportingWindow(toFramework(project.frameworkKey), period.task.dueAt);
  const taskTitle = t("Reporting Task {window}", { window: periodLabel });
  const counts = useMemo(() => getReportStatusCounts(period.reports), [period.reports]);
  const { treesPlantedCount, seedsPlantedCount, regeneratedTreesCount } = period.metrics;
  const metricCardClassName = "w-auto min-w-[12.5rem] border-[0.125rem] bg-theme-neutral-100";

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
            title={getShortPeriodLabel(taskTitle ?? "", true)}
            dueDate={format(period.task.dueAt)}
            statusLabels={
              <Flex alignItems="center" gap={2} className="mobile:flex-wrap mobile:justify-end">
                {counts.due > 0 && <TagSubmission state="due" size="small" labelPrefix={counts.due} />}
                {counts.draft > 0 && <TagSubmission state="draft" size="small" labelPrefix={counts.draft} />}
                {counts.informationRequired > 0 && (
                  <TagSubmission state="information-required" size="small" labelPrefix={counts.informationRequired} />
                )}
                {counts.pendingApproval > 0 && (
                  <TagSubmission state="pending-approval" size="small" labelPrefix={counts.pendingApproval} />
                )}
                {counts.approved > 0 && <TagSubmission state="approved" size="small" labelPrefix={counts.approved} />}
              </Flex>
            }
          />
        }
      >
        {open ? (
          <div className="bg-theme-neutral-100 p-4">
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
              {period.projectReportUuid != null ? (
                <PeriodJobsMetricCard projectReportUuid={period.projectReportUuid} className={metricCardClassName} />
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
            <ReportsIndexTable reports={period.reports} />
          </div>
        ) : null}
      </Accordion>
    </Box>
  );
};

export default ReportingPeriodSection;
