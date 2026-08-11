import { Box, Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useMemo, useState } from "react";

import { toFramework } from "@/context/framework.provider";
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

const ReportingPeriodSection = ({ period, project, defaultOpen = false }: ReportingPeriodSectionProps) => {
  const t = useT();
  const { format } = useDate();
  const [open, setOpen] = useState(defaultOpen);
  const periodLabel = useReportingWindow(toFramework(project.frameworkKey), period.task.dueAt);
  const counts = useMemo(() => getReportStatusCounts(period.reports), [period.reports]);

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
            title={periodLabel || format(period.task.dueAt, "MMMM yyyy")}
            dueDate={format(period.task.dueAt)}
            statusLabels={
              <Flex alignItems="center" gap={2} className="mobile:flex-wrap mobile:justify-end">
                {counts.due > 0 && <TagSubmission state="due" size="small" labelPrefix={counts.due} />}
                {counts.draft > 0 && <TagSubmission state="draft" size="small" labelPrefix={counts.draft} />}
                {counts.informationRequired > 0 && (
                  <TagSubmission state="information-required" size="small" labelPrefix={counts.informationRequired} />
                )}
              </Flex>
            }
          />
        }
      >
        <div className="bg-theme-neutral-100 p-4">
          <div className="mb-5 flex flex-wrap gap-4">
            <MetricCard
              title={t("Trees Growing")}
              color="secondary.600"
              progress={project.treesPlantedCount ?? project.treesRestoredPpc ?? 0}
              goal={0}
              icon={<TreeIcon color="secondary.600" boxSize="0.875rem" />}
              tooltipContent={t("Total trees currently reported for this project.")}
              className="w-auto min-w-[12.5rem] border-[0.125rem] bg-theme-neutral-100"
            />
            <MetricCard
              title={t("Seedlings Grown")}
              color="secondary.600"
              progress={project.seedsPlantedCount ?? 0}
              goal={0}
              icon={<SeedlingsIcon color="secondary.600" boxSize="0.875rem" />}
              tooltipContent={t("Total seedlings and seeds reported for this project.")}
              className="w-auto min-w-[12.5rem] border-[0.125rem] bg-theme-neutral-100"
            />
            <MetricCard
              title={t("Trees Regenerated")}
              color="secondary.600"
              progress={project.regeneratedTreesCount ?? 0}
              goal={0}
              icon={<RegenerationIcon color="secondary.600" boxSize="0.875rem" />}
              tooltipContent={t("Total naturally regenerated trees reported for this project.")}
              className="w-auto min-w-[12.5rem] border-[0.125rem] bg-theme-neutral-100"
            />
            <MetricCard
              title={t("Jobs Created")}
              color="primary.600"
              progress={project.totalJobsCreated ?? 0}
              goal={0}
              icon={<JobsIcon color="primary.600" boxSize="0.875rem" />}
              tooltipContent={t("Total jobs created by this project.")}
              className="w-auto min-w-[12.5rem] border-[0.125rem] bg-theme-neutral-100"
            />
          </div>
          <ReportsIndexTable reports={period.reports} />
        </div>
      </Accordion>
    </Box>
  );
};

export default ReportingPeriodSection;
