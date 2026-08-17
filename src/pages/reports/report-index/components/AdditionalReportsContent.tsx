import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useMemo, useState } from "react";

import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import ListSectionHeader from "@/redesignComponents/containers/Accordion/ListSectionHeader";
import { FolderIcon, FolderOpenIcon, LoadingIcon } from "@/redesignComponents/foundations/Icons";
import TextBadge from "@/redesignComponents/status/Badge/TextBadge";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";

import {
  AdditionalReportGroup,
  AdditionalReportsEntitySection as AdditionalReportsEntitySectionData,
  AdditionalReportType
} from "../reportIndex.types";
import { getReportsRequiringAttention } from "../reportIndex.utils";
import AdditionalReportsTable from "./AdditionalReportsTable";
import ReportAttentionStatusLabels from "./ReportAttentionStatusLabels";

type AdditionalReportsContentProps = {
  sections: AdditionalReportsEntitySectionData[];
  loading: boolean;
  error: boolean;
};

const getGroupLabel = (type: AdditionalReportType, t: ReturnType<typeof useT>) => {
  if (type === "financial-report") return t("Financial Report");
  if (type === "srp-report") return t("Annual SRP");
  return t("Disturbance Reports");
};

const AdditionalReportGroupSection = ({ group }: { group: AdditionalReportGroup }) => {
  const t = useT();
  const [open, setOpen] = useState(true);

  return (
    <Accordion
      variant="quaternary"
      open={open}
      onOpenChange={setOpen}
      className="bg-theme-neutral-100"
      classNameHeader="!mb-0"
      header={
        <ListSectionHeader
          level="sub-level"
          label={t("Report Type")}
          title={getGroupLabel(group.type, t)}
          statusLabels={<ReportAttentionStatusLabels reports={group.reports} />}
        />
      }
    >
      {open ? (
        <div className="bg-theme-neutral-100 px-4 pb-5 pt-4">
          <AdditionalReportsTable reports={group.reports} type={group.type} />
        </div>
      ) : null}
    </Accordion>
  );
};

const AdditionalReportsEntitySection = ({ section }: { section: AdditionalReportsEntitySectionData }) => {
  const t = useT();
  const [open, setOpen] = useState(true);
  const reports = useMemo(() => section.groups.flatMap(group => group.reports), [section.groups]);
  const attentionCount = useMemo(() => getReportsRequiringAttention(reports), [reports]);

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
          title={section.name ?? (section.type === "organisation" ? t("Organisation") : t("Project"))}
          titleHref={section.type === "project" ? `/project/${section.id}` : undefined}
          caption={section.type === "organisation" ? t("Organisation") : section.caption}
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
      <div className="space-y-1 bg-theme-neutral-200 pt-0.5">
        {section.groups.map(group => (
          <AdditionalReportGroupSection key={group.id} group={group} />
        ))}
      </div>
    </Accordion>
  );
};

const AdditionalReportsContent = ({ sections, loading, error }: AdditionalReportsContentProps) => {
  const t = useT();

  return (
    <main className="bg-theme-neutral-200 px-2.5 pb-2.5">
      {loading ? (
        <Flex minHeight="240px" alignItems="center" justifyContent="center" gap={3}>
          <LoadingIcon boxSize={6} className="animate-spin" color="primary.800" />
          <Text textStyle="400" color="neutral.800">
            {t("Loading reports...")}
          </Text>
        </Flex>
      ) : error ? (
        <InlineMessage
          className="m-4"
          variant="error"
          label={t("Reports could not be loaded")}
          caption={t("Please refresh the page and try again.")}
        />
      ) : sections.length === 0 ? (
        <InlineMessage
          className="m-4"
          variant="info-grey"
          label={t("No additional reports found")}
          caption={t("Try changing your search or filters.")}
        />
      ) : (
        <div className="space-y-4">
          {sections.map(section => (
            <AdditionalReportsEntitySection key={`${section.type}-${section.id}`} section={section} />
          ))}
        </div>
      )}
    </main>
  );
};

export default AdditionalReportsContent;
