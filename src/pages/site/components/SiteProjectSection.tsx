import { Box, Flex, TableCell, TableRow, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { type FC, type MouseEvent, useCallback, useMemo, useState } from "react";

import { Framework, isTerrafund } from "@/context/framework.provider";
import { getEntityEditPageLink } from "@/helpers/entity";
import { useDate } from "@/hooks/useDate";
import FeedbackTag from "@/redesignComponents/actions/Tags/FeedbackTag/FeedbackTag";
import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import ListSectionHeader from "@/redesignComponents/containers/Accordion/ListSectionHeader";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import ActionCell from "@/redesignComponents/dataDisplay/Table/components/ActionCell";
import Table, {
  type TableColumn,
  type TableRenderRowContext,
  CHECKBOX_COLUMN_KEY
} from "@/redesignComponents/dataDisplay/Table/Table";
import Checkbox from "@/redesignComponents/Forms/Actions/Checkbox/Checkbox";
import {
  AreaHectaresIcon,
  CalendarIcon,
  EditIcon,
  FolderIcon,
  FolderOpenIcon,
  JobsIcon,
  RegenerationIcon,
  SeedlingsIcon,
  TreeIcon
} from "@/redesignComponents/foundations/Icons";
import TextBadge from "@/redesignComponents/status/Badge/TextBadge";

import type { SiteIndexProject, SiteIndexSite, SiteIndexStatus, SiteIndexUpdate } from "./siteIndex.types";
import { useSiteTableSelection } from "./SiteIndexSelection.provider";

interface SiteProjectSectionProps {
  project: SiteIndexProject;
  sites: SiteIndexSite[];
  totalSiteCount: number;
  isFiltered: boolean;
  defaultOpen?: boolean;
}

const stopRowClick = (event: MouseEvent) => {
  event.stopPropagation();
};

const SiteStatusTag: FC<{ status: SiteIndexStatus }> = ({ status }) => <TagSubmission state={status} size="small" />;

const SiteUpdate: FC<{ update: SiteIndexUpdate | null }> = ({ update }) => {
  const t = useT();

  if (update == null) {
    return (
      <Text textStyle="300" color="neutral.800">
        –
      </Text>
    );
  }

  const updateLabel = {
    draft: t("Draft"),
    "pending-approval": t("Pending Approval"),
    "information-required": t("Information Required"),
    complete: t("Complete")
  }[update];

  return (
    <Box className="text-theme-neutral-800 flex items-center gap-1">
      <EditIcon boxSize={2.5} />
      <Text as="span" textStyle="200">
        {t("Editing:")}
      </Text>
      <Text as="span" textStyle="200-bold">
        {updateLabel}
      </Text>
    </Box>
  );
};

const SiteProjectMetrics: FC<{
  project: SiteIndexProject;
  sites: SiteIndexSite[];
  totalSiteCount: number;
  isFiltered: boolean;
}> = ({ project, sites, totalSiteCount, isFiltered }) => {
  const t = useT();
  const { selectedRows: selectedSites } = useSiteTableSelection(sites);
  const filteredMetric = (progress: number) =>
    totalSiteCount === 0 ? 0 : Math.round(progress * (sites.length / totalSiteCount));
  const selectedMetric = (progress: number) =>
    totalSiteCount === 0 ? 0 : Math.round(progress * (selectedSites.length / totalSiteCount));
  const filteredTrees = sites.reduce((total, site) => total + site.treesPlantedCount, 0);
  const selectedTrees = selectedSites.reduce((total, site) => total + site.treesPlantedCount, 0);
  const filteredArea = sites.reduce((total, site) => total + site.totalHectaresRestoredSum, 0);
  const selectedArea = selectedSites.reduce((total, site) => total + site.totalHectaresRestoredSum, 0);
  const metricCardClassName = "w-auto min-w-[12.5rem] border-[0.125rem] bg-theme-neutral-100";
  const isHbf = project.frameworkKey === Framework.HBF;
  const isTerraFund = isTerrafund(project.frameworkKey);
  const primaryMetric = isHbf
    ? project.metrics.saplingsGrowing
    : isTerraFund
    ? project.metrics.treesPlanted
    : project.metrics.treesGrowing;
  const primaryMetricTitle = isHbf ? "Saplings Growing" : isTerraFund ? "Trees Planted" : "Trees Growing";
  const primaryMetricIcon = isHbf ? <SeedlingsIcon /> : <TreeIcon />;

  return (
    <div className="mb-5 flex flex-wrap gap-4">
      {primaryMetric != null && (
        <MetricCard
          title={t(primaryMetricTitle)}
          progress={primaryMetric.progress}
          goal={primaryMetric.goal}
          progressSuffix=""
          variant="progressBar"
          widthProgressBar="5rem"
          icon={primaryMetricIcon}
          color="secondary.600"
          className={metricCardClassName}
          filtered={isFiltered ? filteredTrees : undefined}
          selection={selectedSites.length > 0 ? selectedTrees : undefined}
        />
      )}
      {isTerraFund && project.metrics.treesRegenerated != null && (
        <MetricCard
          title={t("Trees Regenerated")}
          progress={project.metrics.treesRegenerated.progress}
          goal={project.metrics.treesRegenerated.goal}
          progressSuffix=""
          variant="progressBar"
          widthProgressBar="5rem"
          icon={<RegenerationIcon />}
          color="secondary.600"
          className={metricCardClassName}
          filtered={isFiltered ? filteredMetric(project.metrics.treesRegenerated.progress) : undefined}
          selection={selectedSites.length > 0 ? selectedMetric(project.metrics.treesRegenerated.progress) : undefined}
        />
      )}
      <MetricCard
        title={t("Area restored (Ha)")}
        progress={project.metrics.areaRestored.progress}
        goal={project.metrics.areaRestored.goal}
        variant="progressBar"
        widthProgressBar="5rem"
        color="secondary.700"
        icon={<AreaHectaresIcon />}
        className={metricCardClassName}
        filtered={isFiltered ? filteredArea : undefined}
        selection={selectedSites.length > 0 ? selectedArea : undefined}
      />
      {!isHbf && !isTerraFund && project.metrics.workdays != null && (
        <MetricCard
          title={t("Workdays")}
          progress={project.metrics.workdays.progress}
          goal={project.metrics.workdays.goal}
          variant="progressBar"
          widthProgressBar="5rem"
          icon={<JobsIcon />}
          color="primary.600"
          className={metricCardClassName}
          filtered={isFiltered ? filteredMetric(project.metrics.workdays.progress) : undefined}
          selection={selectedSites.length > 0 ? selectedMetric(project.metrics.workdays.progress) : undefined}
        />
      )}
    </div>
  );
};

const SiteProjectTable: FC<{
  sites: SiteIndexSite[];
}> = ({ sites }) => {
  const t = useT();
  const router = useRouter();
  const { format } = useDate();
  const { selectedRows, isSiteSelected, handleRowSelected, handleAllItemsSelected } = useSiteTableSelection(sites);

  const columns = useMemo<TableColumn[]>(
    () => [
      { key: "name", label: t("Site Name"), sortable: true, width: "calc(30% - 1.125rem)" },
      { key: "status", label: t("Status"), sortable: true, width: "calc(15% - 0.5625rem)" },
      { key: "update", label: t("Updates"), sortable: true, width: "calc(19% - 0.7125rem)" },
      { key: "updatedAt", label: t("Latest Update"), sortable: true, width: "calc(14% - 0.525rem)" },
      { key: "createdAt", label: t("Date Created"), sortable: true, width: "calc(12% - 0.45rem)" },
      { key: "actions", label: "", width: "calc(10% - 0.375rem)" }
    ],
    [t]
  );

  const renderRow = useCallback(
    (site: SiteIndexSite, context?: TableRenderRowContext) => {
      const isSelected = isSiteSelected(site);

      return (
        <TableRow
          className={`${context?.className ?? ""} group cursor-pointer`}
          aria-selected={isSelected}
          onClick={() => void router.push(`/site/${site.id}`)}
        >
          <TableCell {...context?.getCellProps(CHECKBOX_COLUMN_KEY)} onClick={stopRowClick}>
            <Checkbox
              name={`site-${site.id}`}
              aria-label={t("Select {siteName}", { siteName: site.name })}
              checked={isSelected}
              onCheckedChange={({ checked }) => handleRowSelected(site, checked === true)}
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
          <TableCell {...context?.getCellProps("status")}>
            <SiteStatusTag status={site.status} />
          </TableCell>
          <TableCell {...context?.getCellProps("update")}>
            <SiteUpdate update={site.update} />
          </TableCell>
          <TableCell {...context?.getCellProps("updatedAt")}>
            {site.updatedAt !== "" ? (
              <Box w="min-content">
                <FeedbackTag
                  type="info-white"
                  size="default"
                  label={format(site.updatedAt)}
                  icon={<CalendarIcon boxSize={2.5} />}
                />
              </Box>
            ) : (
              <Text textStyle="300" color="neutral.800">
                –
              </Text>
            )}
          </TableCell>
          <TableCell {...context?.getCellProps("createdAt")}>
            {site.createdAt !== "" ? (
              <Box w="min-content">
                <FeedbackTag
                  type="info-grey"
                  size="default"
                  label={format(site.createdAt)}
                  icon={<CalendarIcon boxSize={2.5} />}
                />
              </Box>
            ) : (
              <Text textStyle="300" color="neutral.800">
                –
              </Text>
            )}
          </TableCell>
          <TableCell {...context?.getCellProps("actions")} onClick={stopRowClick}>
            <Box className="flex justify-center">
              <ActionCell
                button={{
                  children: t("Edit"),
                  leftIcon: <EditIcon boxSize={2.5} />,
                  "aria-label": t("Edit {siteName}", { siteName: site.name }),
                  onClick: () => void router.push(getEntityEditPageLink("sites", site.id))
                }}
              />
            </Box>
          </TableCell>
        </TableRow>
      );
    },
    [format, handleRowSelected, isSiteSelected, router, t]
  );

  return (
    <Table<SiteIndexSite>
      data={sites}
      css={{
        "& > div > div": {
          overflowX: "hidden"
        },
        "& table": {
          tableLayout: "fixed",
          minWidth: "0 !important",
          width: "100%"
        },
        "& table thead th:first-of-type, & table tbody td:first-of-type": {
          width: "3.75rem !important",
          minWidth: "3.75rem !important",
          maxWidth: "3.75rem !important"
        },
        "& table tbody tr:hover": {
          borderBottomColor: "primary.700",
          borderBottomWidth: "0.0625rem"
        }
      }}
      columns={columns}
      selectable
      pageSize={10}
      showPagination
      showItemCount={false}
      selectedRows={selectedRows}
      onRowSelected={handleRowSelected}
      onAllItemsSelected={handleAllItemsSelected}
      renderRow={renderRow}
    />
  );
};

const SiteProjectSection: FC<SiteProjectSectionProps> = ({
  project,
  sites,
  totalSiteCount,
  isFiltered,
  defaultOpen = false
}) => {
  const t = useT();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Flex direction="column" gap="0.5rem">
      <Accordion
        variant="tertiary"
        open={open}
        onOpenChange={setOpen}
        className="bg-theme-neutral-100 w-full overflow-hidden rounded"
        classNameHeader="!mb-0"
        header={
          <ListSectionHeader
            level="top-level"
            title={project.name}
            titleHref={`/project/${project.id}`}
            caption={project.organisationName}
            icon={
              open ? (
                <FolderOpenIcon minWidth={5} width={5} height="auto" color="primary.600" />
              ) : (
                <FolderIcon minWidth={5} width={5} height="auto" color="primary.600" />
              )
            }
            statusLabels={
              project.attentionCount > 0 ? (
                <TextBadge>{t("{count} Require Attention", { count: project.attentionCount })}</TextBadge>
              ) : null
            }
          />
        }
      >
        <Box className="bg-theme-neutral-100 p-4" minW={0}>
          <SiteProjectMetrics project={project} sites={sites} totalSiteCount={totalSiteCount} isFiltered={isFiltered} />
          <SiteProjectTable sites={sites} />
        </Box>
      </Accordion>
    </Flex>
  );
};

export default SiteProjectSection;
