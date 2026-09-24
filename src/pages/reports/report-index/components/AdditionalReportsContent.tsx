import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useMemo, useState } from "react";

import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import ListSectionHeader from "@/redesignComponents/containers/Accordion/ListSectionHeader";
import { FolderIcon, FolderOpenIcon, LoadingIcon } from "@/redesignComponents/foundations/Icons";
import TextBadge from "@/redesignComponents/status/Badge/TextBadge";

import {
  AdditionalReportGroup,
  AdditionalReportsEntitySection as AdditionalReportsEntitySectionData,
  AdditionalReportType
} from "../reportIndex.types";
import { collectAdditionalReports, getReportsRequiringAttention } from "../reportIndex.utils";
import AdditionalReportsTable from "./AdditionalReportsTable";
import ReportAttentionStatusLabels from "./ReportAttentionStatusLabels";
import ReportsSearchNoResults from "./ReportsSearchNoResults";

type AdditionalReportsContentProps = {
  sections: AdditionalReportsEntitySectionData[];
  loading: boolean;
  error: boolean;
  hasActiveSearch?: boolean;
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

const AdditionalReportGroupSection = ({
  group,
  indexHref,
  restoreReportId,
  onRowRestored
}: {
  group: AdditionalReportGroup;
  indexHref?: string;
  restoreReportId?: string;
  onRowRestored?: () => void;
}) => {
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

const AdditionalReportsEntitySection = ({
  section,
  indexHref,
  restoreGroupId,
  restoreReportId,
  onRowRestored
}: {
  section: AdditionalReportsEntitySectionData;
  indexHref?: string;
  restoreGroupId?: string;
  restoreReportId?: string;
  onRowRestored?: () => void;
}) => {
  const t = useT();
  const [open, setOpen] = useState(true);
  const reports = useMemo(() => collectAdditionalReports(section), [section]);
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
          titleHref={section.type === "project" ? `/project/${section.id}` : `/organization/${section.id}`}
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
          <AdditionalReportGroupSection
            key={group.id}
            group={group}
            indexHref={indexHref}
            restoreReportId={group.id === restoreGroupId ? restoreReportId : undefined}
            onRowRestored={onRowRestored}
          />
        ))}
        {(section.children ?? []).map(child => (
          <AdditionalReportsEntitySection
            key={`${child.type}-${child.id}`}
            section={child}
            indexHref={indexHref}
            restoreGroupId={restoreGroupId}
            restoreReportId={restoreReportId}
            onRowRestored={onRowRestored}
          />
        ))}
      </div>
    </Accordion>
  );
};

const AdditionalReportsContent = ({
  sections,
  loading,
  error,
  hasActiveSearch = false,
  indexHref,
  restoreGroupId,
  restoreReportId,
  onRowRestored
}: AdditionalReportsContentProps) => {
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
        <Box background="neutral.100" h="full" p={4}>
          <Text textStyle="400-bold">{t("Reports could not be loaded")}</Text>
          <Text textStyle="400">{t("Please refresh the page and try again.")}</Text>
        </Box>
      ) : sections.length === 0 ? (
        hasActiveSearch ? (
          <ReportsSearchNoResults />
        ) : (
          <Box background="neutral.100" h="full" p={4}>
            <Text textStyle="400-bold">{t("No additional reports found")}</Text>
            <Text textStyle="400">{t("Try changing your search or filters.")}</Text>
          </Box>
        )
      ) : (
        <div className="space-y-4">
          {sections.map(section => (
            <AdditionalReportsEntitySection
              key={`${section.type}-${section.id}`}
              section={section}
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
