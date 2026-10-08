import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useMemo, useState } from "react";

import { useIndexAccordionOpen } from "@/hooks/useIndexAccordionOpen";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import ListSectionHeader from "@/redesignComponents/containers/Accordion/ListSectionHeader";
import NoResults from "@/redesignComponents/content/NoResults/NoResults";
import { LoadingIcon } from "@/redesignComponents/foundations/Icons";
import TextBadge from "@/redesignComponents/status/Badge/TextBadge";

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
  sectionName?: string;
  loading: boolean;
  error: boolean;
  hasActiveSearch?: boolean;
  openResetKey?: string;
  openFirstSection?: boolean;
  indexHref?: string;
  restoreGroupId?: string;
  restoreReportId?: string;
  onRowRestored?: () => void;
};

const getGroupLabel = (type: AdditionalReportType, t: ReturnType<typeof useT>) => {
  if (type === "financial-report") return t("Financial Report");
  if (type === "srp-report") return t("Annual SRP");
  return t("Disturbance Reports");
};

const AdditionalReportGroupSection: FC<{
  group: AdditionalReportGroup;
  indexHref?: string;
  restoreReportId?: string;
  onRowRestored?: () => void;
}> = ({ group, indexHref, restoreReportId, onRowRestored }) => {
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
        <div className="bg-theme-neutral-100 px-4 pt-4 pb-5">
          <AdditionalReportsTable
            reports={group.reports}
            type={group.type}
            indexHref={indexHref}
            restoreRowId={restoreReportId}
            onRowRestored={onRowRestored}
          />
        </div>
      ) : null}
    </Accordion>
  );
};

const AdditionalReportsEntitySection: FC<{
  section: AdditionalReportsEntitySectionData;
  sectionName?: string;
  defaultOpen: boolean;
  openResetKey?: string;
  indexHref?: string;
  restoreGroupId?: string;
  restoreReportId?: string;
  onRowRestored?: () => void;
}> = ({
  section,
  sectionName,
  defaultOpen,
  openResetKey,
  indexHref,
  restoreGroupId,
  restoreReportId,
  onRowRestored
}) => {
  const t = useT();
  const [open, setOpen] = useIndexAccordionOpen({
    defaultOpen,
    resetKey: openResetKey,
    restoreOpen: restoreGroupId == null ? undefined : section.groups.some(group => group.id === restoreGroupId)
  });
  const reports = useMemo(() => section.groups.flatMap(group => group.reports), [section.groups]);
  const attentionCount = useMemo(() => getReportsRequiringAttention(reports), [reports]);
  const childSections = section.children ?? [];

  return (
    <>
      {section.groups.length > 0 ? (
        <Accordion
          variant="tertiary"
          open={open}
          onOpenChange={setOpen}
          className="overflow-hidden rounded bg-theme-neutral-100"
          classNameHeader="!mb-0"
          header={
            <ListSectionHeader
              level="top-level"
              title={
                sectionName ?? section.name ?? (section.type === "organisation" ? t("Organisation") : t("Project"))
              }
              titleHref={section.type === "project" ? `/project/${section.id}` : `/organization/${section.id}`}
              caption={section.type === "organisation" ? t("Organisation") : section.caption}
              open={open}
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
              <AdditionalReportGroupSection
                key={group.id}
                group={group}
                indexHref={indexHref}
                restoreReportId={group.id === restoreGroupId ? restoreReportId : undefined}
                onRowRestored={onRowRestored}
              />
            ))}
          </div>
        </Accordion>
      ) : null}
      {childSections.map((child, index) => (
        <AdditionalReportsEntitySection
          key={`${child.type}-${child.id}`}
          section={child}
          sectionName={sectionName}
          defaultOpen={defaultOpen && section.groups.length === 0 && index === 0}
          openResetKey={openResetKey}
          indexHref={indexHref}
          restoreGroupId={restoreGroupId}
          restoreReportId={restoreReportId}
          onRowRestored={onRowRestored}
        />
      ))}
    </>
  );
};

const AdditionalReportsContent: FC<AdditionalReportsContentProps> = ({
  sections,
  sectionName,
  loading,
  error,
  hasActiveSearch = false,
  openResetKey,
  openFirstSection = true,
  indexHref,
  restoreGroupId,
  restoreReportId,
  onRowRestored
}) => {
  const t = useT();

  return (
    <>
      {loading ? (
        <Flex minHeight="15rem" alignItems="center" justifyContent="center" gap={3}>
          <LoadingIcon boxSize={6} className="animate-spin" color="primary.700" />
          <Text textStyle="400" color="neutral.800">
            {t("Loading reports...")}
          </Text>
        </Flex>
      ) : error ? (
        <NoResults title={t("Reports could not be loaded")} description={t("Please refresh the page and try again.")} />
      ) : sections.length === 0 ? (
        hasActiveSearch ? (
          <NoResults
            title={t("No reports found")}
            description={t("We couldn’t find any reports matching your search. Try a different keyword.")}
          />
        ) : (
          <NoResults title={t("No reports found")} description={t("Try changing your search or filters.")} />
        )
      ) : (
        <div className="space-y-4">
          {sections.map((section, index) => (
            <AdditionalReportsEntitySection
              key={`${section.type}-${section.id}`}
              section={section}
              sectionName={sectionName}
              defaultOpen={openFirstSection && index === 0}
              openResetKey={openResetKey}
              indexHref={indexHref}
              restoreGroupId={restoreGroupId}
              restoreReportId={restoreReportId}
              onRowRestored={onRowRestored}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default AdditionalReportsContent;
