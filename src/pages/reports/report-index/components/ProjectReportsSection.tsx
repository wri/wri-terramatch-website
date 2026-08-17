import { useT } from "@transifex/react";
import { useMemo, useState } from "react";

import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import ListSectionHeader from "@/redesignComponents/containers/Accordion/ListSectionHeader";
import { FolderIcon, FolderOpenIcon } from "@/redesignComponents/foundations/Icons";
import TextBadge from "@/redesignComponents/status/Badge/TextBadge";

import { ReportsIndexProjectSection } from "../reportIndex.types";
import { getReportsRequiringAttention } from "../reportIndex.utils";
import ReportingPeriodSection from "./ReportingPeriodSection";

type ProjectReportsSectionProps = {
  section: ReportsIndexProjectSection;
  defaultOpen?: boolean;
};

const ProjectReportsSection = ({ section, defaultOpen = false }: ProjectReportsSectionProps) => {
  const t = useT();
  const [open, setOpen] = useState(defaultOpen);

  const attentionCount = useMemo(
    () => section.periods.reduce((total, period) => total + getReportsRequiringAttention(period.reports), 0),
    [section.periods]
  );

  return (
    <Accordion
      variant="tertiary"
      open={open}
      onOpenChange={setOpen}
      className="bg-theme-neutral-100 overflow-hidden rounded"
      classNameHeader="!mb-0"
      header={
        <ListSectionHeader
          level="top-level"
          title={section.name ?? t("Project")}
          titleHref={`/project/${section.id}`}
          caption={section.organisationName ?? ""}
          icon={
            open ? (
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
        {open
          ? section.periods.map((period, index) => (
              <ReportingPeriodSection key={period.id} period={period} defaultOpen={index === 0} />
            ))
          : null}
      </div>
    </Accordion>
  );
};

export default ProjectReportsSection;
