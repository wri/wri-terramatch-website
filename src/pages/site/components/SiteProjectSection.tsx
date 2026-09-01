import { Box, TableCell, TableRow, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import Link from "next/link";
import { type FC, useMemo } from "react";

import ActionStatusTag from "@/redesignComponents/actions/Tags/ActionStatusTag/ActionStatusTag";
import MappedTag, { type MappedTagState } from "@/redesignComponents/actions/Tags/MappedTag/MappedTag";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import ListSectionHeader from "@/redesignComponents/containers/Accordion/ListSectionHeader";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import Table, { type TableRenderRowContext, CHECKBOX_COLUMN_KEY } from "@/redesignComponents/dataDisplay/Table/Table";
import Checkbox from "@/redesignComponents/Forms/Actions/Checkbox/Checkbox";
import {
  AreaHectaresIcon,
  CalendarIcon,
  DueIcon,
  FolderOpenIcon,
  JobsIcon,
  NothingReportedIcon,
  TreeIcon
} from "@/redesignComponents/foundations/Icons";

import type { SiteIndexProject, SiteIndexSite, SiteIndexStatus } from "./siteIndexMockData";

interface SiteProjectSectionProps {
  project: SiteIndexProject;
  sites: SiteIndexSite[];
  selectedSiteIds: Set<string>;
  onRowSelected: (site: SiteIndexSite, checked: boolean) => void;
  onAllItemsSelected: (checked: boolean, visibleSites: SiteIndexSite[]) => void;
  defaultOpen?: boolean;
}

const mappedStatuses: MappedTagState[] = ["draft", "pending-approval", "information-required", "approved", "deleted"];

const SiteStatusTag: FC<{ status: SiteIndexStatus }> = ({ status }) => {
  const t = useT();

  if (mappedStatuses.includes(status as MappedTagState)) {
    return <MappedTag state={status as MappedTagState} size="small" />;
  }

  if (status === "due") {
    return <ActionStatusTag state="warning" size="small" label={t("Due")} icon={<DueIcon boxSize={2.5} />} />;
  }

  return (
    <ActionStatusTag
      state="neutral-dark"
      size="small"
      label={t("Not Started")}
      icon={<NothingReportedIcon boxSize={2.5} />}
    />
  );
};

const SiteProjectSection: FC<SiteProjectSectionProps> = ({
  project,
  sites,
  selectedSiteIds,
  onRowSelected,
  onAllItemsSelected,
  defaultOpen = false
}) => {
  const t = useT();
  const selectedSites = useMemo(() => sites.filter(site => selectedSiteIds.has(site.id)), [selectedSiteIds, sites]);

  return (
    <Accordion
      variant="tertiary"
      defaultOpen={defaultOpen}
      className="w-full"
      classNameHeader="!mb-0"
      header={
        <ListSectionHeader
          title={project.name}
          titleHref={`/project/${project.id}`}
          caption={project.organisationName}
          icon={<FolderOpenIcon boxSize={5} color="primary.600" />}
        />
      }
      actions={
        project.attentionCount > 0 ? (
          <ActionStatusTag
            label={t("{count} Require Attention", { count: project.attentionCount })}
            size="small"
            className="!border-theme-primary-900 !bg-theme-primary-900 !text-theme-primary-100"
          />
        ) : undefined
      }
    >
      <Box paddingX={4} paddingBottom={7} paddingTop={4}>
        <Box className="mb-5 grid max-w-[800px] grid-cols-3 gap-4 mobile:grid-cols-1">
          <MetricCard
            title={t("Trees Growing")}
            progress={project.metrics.treesGrowing.progress}
            goal={project.metrics.treesGrowing.goal}
            progressSuffix=""
            variant="progressBar"
            widthProgressBar="5rem"
            icon={<TreeIcon />}
          />
          <MetricCard
            title={t("Area restored (Ha)")}
            progress={project.metrics.areaRestored.progress}
            goal={project.metrics.areaRestored.goal}
            variant="progressBar"
            widthProgressBar="5rem"
            icon={<AreaHectaresIcon />}
          />
          <MetricCard
            title={t("Workdays")}
            progress={project.metrics.workdays.progress}
            goal={project.metrics.workdays.goal}
            variant="progressBar"
            widthProgressBar="5rem"
            icon={<JobsIcon />}
          />
        </Box>

        <Table<SiteIndexSite>
          data={sites}
          columns={[
            { key: "name", label: t("Site Name"), sortable: true, width: "44%" },
            { key: "changeRequest", label: t("Change Request"), sortable: true, width: "18%" },
            { key: "status", label: t("Status"), sortable: true, width: "18%" },
            { key: "dateCreated", label: t("Date Created"), sortable: true, width: "20%" }
          ]}
          selectable
          pageSize={10}
          showPagination
          showItemCount={false}
          selectedRows={selectedSites}
          onRowSelected={onRowSelected}
          onAllItemsSelected={onAllItemsSelected}
          renderRow={(site, context?: TableRenderRowContext) => (
            <TableRow className={context?.className} aria-selected={selectedSiteIds.has(site.id)}>
              <TableCell {...context?.getCellProps(CHECKBOX_COLUMN_KEY)}>
                <Checkbox
                  name={`site-${site.id}`}
                  aria-label={t("Select {siteName}", { siteName: site.name })}
                  checked={selectedSiteIds.has(site.id)}
                  onCheckedChange={({ checked }) => onRowSelected(site, checked === true)}
                />
              </TableCell>
              <TableCell {...context?.getCellProps("name")}>
                <Link href={`/site/${site.id}`} className="block max-w-full truncate">
                  <Text
                    as="span"
                    textStyle="400-bold"
                    className="text-theme-neutral-800 underline decoration-dotted underline-offset-4"
                  >
                    {site.name}
                  </Text>
                </Link>
              </TableCell>
              <TableCell {...context?.getCellProps("changeRequest")}>
                <SiteStatusTag status={site.changeRequest} />
              </TableCell>
              <TableCell {...context?.getCellProps("status")}>
                <SiteStatusTag status={site.status} />
              </TableCell>
              <TableCell {...context?.getCellProps("dateCreated")}>
                {site.dateCreated != null ? (
                  <ActionStatusTag
                    state="neutral-dark"
                    size="small"
                    label={site.dateCreated}
                    icon={<CalendarIcon boxSize={2.5} />}
                  />
                ) : (
                  <Text textStyle="300" color="neutral.800">
                    –
                  </Text>
                )}
              </TableCell>
            </TableRow>
          )}
        />
      </Box>
    </Accordion>
  );
};

export default SiteProjectSection;
