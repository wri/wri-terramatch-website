import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useMemo, useState } from "react";

import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import ListSectionHeader from "@/redesignComponents/containers/Accordion/ListSectionHeader";
import { CheckApprovedIcon, FolderIcon, FolderOpenIcon, LoadingIcon } from "@/redesignComponents/foundations/Icons";
import TextBadge from "@/redesignComponents/status/Badge/TextBadge";

import {
  AdditionalReport,
  AdditionalReportGroup,
  AdditionalReportsEntitySection as AdditionalReportsEntitySectionData,
  AdditionalReportType
} from "../reportIndex.types";
import { getReportsRequiringAttention, getReportStatusCounts } from "../reportIndex.utils";
import AdditionalReportsTable from "./AdditionalReportsTable";

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

const GroupStatusLabels = ({ reports }: { reports: AdditionalReport[] }) => {
  const counts = useMemo(() => getReportStatusCounts(reports), [reports]);
  const hasAttention = counts.due + counts.draft + counts.informationRequired > 0;

  if (!hasAttention) return <CheckApprovedIcon boxSize={4} color="success.500" />;

  return (
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
  );
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
          statusLabels={<GroupStatusLabels reports={group.reports} />}
        />
      }
    >
      {open ? (
        <div className="bg-theme-neutral-100 px-4 pt-4 pb-5">
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
      className="bg-theme-neutral-100 overflow-hidden rounded"
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
      <div className="bg-theme-neutral-200 space-y-1 pt-0.5">
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
    <PageContent className="px-2 py-0">
      {loading ? (
        <Flex minHeight="240px" alignItems="center" justifyContent="center" gap={3}>
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
        <Box background="neutral.100" h="full" p={4}>
          <Text textStyle="400-bold">{t("No results found")}</Text>
          <Text textStyle="400">{t("Try changing your search or filters.")}</Text>
        </Box>
      ) : (
        <div className="space-y-4">
          {sections.map(section => (
            <AdditionalReportsEntitySection key={`${section.type}-${section.id}`} section={section} />
          ))}
        </div>
      )}
    </PageContent>
  );
};

export default AdditionalReportsContent;
