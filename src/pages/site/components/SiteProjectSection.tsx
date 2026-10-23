import { Box, TableCell, TableRow, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { type FC, type MouseEvent, memo, ReactNode, useCallback, useMemo, useState } from "react";

import EntityUpdateStatus from "@/components/extensive/EntityIndex/EntityUpdateStatus";
import IndexLoadingRow from "@/components/extensive/EntityIndex/IndexLoadingRow";
import { Framework, isTerrafund, toFramework } from "@/context/framework.provider";
import type { ProjectSitesMetaDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { useDate } from "@/hooks/useDate";
import { useIndexAccordionOpen } from "@/hooks/useIndexAccordionOpen";
import { InfiniteScrollSentinel } from "@/hooks/useInfiniteScrollSentinel";
import { useKeyIndicatorsTooltipContent } from "@/pages/project/[uuid]/tabs/constants/keyIndicatorsTooltipContent";
import FeedbackTag from "@/redesignComponents/actions/Tags/FeedbackTag/FeedbackTag";
import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import ListSectionHeader from "@/redesignComponents/containers/Accordion/ListSectionHeader";
import IndexMetricCardRow, {
  type IndexMetricCardItem
} from "@/redesignComponents/dataDisplay/Metrics/IndexMetricCardRow";
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
  JobsIcon,
  RegenerationIcon,
  SeedlingsIcon,
  TreeIcon
} from "@/redesignComponents/foundations/Icons";
import TextBadge from "@/redesignComponents/status/Badge/TextBadge";

import type { SiteIndexProject, SiteIndexSite } from "./siteIndex.types";
import { getSiteDetailUrl, isSiteApproved, SITE_INDEX_ATTENTION_STATUSES } from "./siteIndex.utils";
import { useSiteTableSelection } from "./SiteIndexSelection.provider";
import { isSiteEditable } from "./siteIndexSubmit";
import { type SiteProjectFilters, useSiteProjectRows } from "./useSiteProjectRows";

const keyIndicatorTooltip = (title?: string, content?: string): ReactNode => {
  if (title == null || title === "" || content == null || content === "") return undefined;

  return (
    <Box>
      <Text textStyle="300-bold">{title}</Text>
      <Text textStyle="300">{content}</Text>
    </Box>
  );
};

const stopRowClick = (event: MouseEvent) => {
  event.stopPropagation();
};

type SiteProjectMetricsProps = {
  frameworkKey: Framework;
  metrics: SiteIndexProject["metrics"];
  /** Totals of the sites that match the filters (approved sites only, as the index has always shown). */
  filtered: { treesPlanted: number; hectaresRestored: number; workdays: number; treesRegenerated: number } | null;
  /** Totals of the selected approved sites, shown while some rows are selected. */
  selection: { treesPlanted: number; hectaresRestored: number; workdays: number; treesRegenerated: number } | null;
};

const SiteProjectMetrics: FC<SiteProjectMetricsProps> = ({ frameworkKey, metrics, filtered, selection }) => {
  const t = useT();
  const isHbf = frameworkKey === Framework.HBF;
  const isTerraFund = isTerrafund(frameworkKey);
  const primaryMetric = isHbf ? metrics.saplingsGrowing : isTerraFund ? metrics.treesPlanted : metrics.treesGrowing;
  const primaryMetricIcon = isHbf ? <SeedlingsIcon /> : <TreeIcon />;
  const keyIndicatorsTooltipContent = useKeyIndicatorsTooltipContent();
  const keyIndicatorsTooltipContentItem = useMemo(
    () => keyIndicatorsTooltipContent.find(content => content.frameworks.includes(frameworkKey)),
    [frameworkKey, keyIndicatorsTooltipContent]
  );
  const primaryMetricTitle =
    keyIndicatorsTooltipContentItem?.treesRestored.title ??
    (isHbf ? "Saplings Growing" : isTerraFund ? "Trees Planted" : "Trees Growing");
  const areaTitle = keyIndicatorsTooltipContentItem?.hectaresRestored.title ?? t("Area restored (Ha)");
  const workdaysTitle = keyIndicatorsTooltipContentItem?.jobsCreated.title ?? t("Workdays");
  const progressBarCard = {
    progressSuffix: "",
    variant: "progressBar" as const,
    widthProgressBar: "5rem"
  };
  const cards: IndexMetricCardItem[] = [
    ...(primaryMetric == null
      ? []
      : [
          {
            ...progressBarCard,
            key: "primary",
            title: t(primaryMetricTitle),
            progress: primaryMetric.progress,
            goal: primaryMetric.goal,
            icon: primaryMetricIcon,
            color: "secondary.600",
            tooltipContent: keyIndicatorTooltip(
              keyIndicatorsTooltipContentItem?.treesRestored.title,
              keyIndicatorsTooltipContentItem?.treesRestored.content
            ),
            filtered: filtered?.treesPlanted,
            selection: selection?.treesPlanted
          }
        ]),
    ...(isTerraFund && metrics.treesRegenerated != null
      ? [
          {
            ...progressBarCard,
            key: "trees-regenerated",
            title: t(keyIndicatorsTooltipContentItem?.treesRegenerated.title ?? "Trees Regenerated"),
            progress: metrics.treesRegenerated.progress,
            goal: metrics.treesRegenerated.goal,
            icon: <RegenerationIcon />,
            color: "secondary.600",
            tooltipContent: keyIndicatorTooltip(
              keyIndicatorsTooltipContentItem?.treesRegenerated.title ?? t("Trees Regenerated"),
              keyIndicatorsTooltipContentItem?.treesRegenerated.content
            ),
            filtered: filtered?.treesRegenerated,
            selection: selection?.treesRegenerated
          }
        ]
      : []),
    {
      ...progressBarCard,
      key: "area-restored",
      title: t(areaTitle),
      progress: metrics.areaRestored.progress,
      goal: metrics.areaRestored.goal,
      color: "secondary.700",
      icon: <AreaHectaresIcon />,
      tooltipContent: keyIndicatorTooltip(
        keyIndicatorsTooltipContentItem?.hectaresRestored.title,
        keyIndicatorsTooltipContentItem?.hectaresRestored.content
      ),
      filtered: filtered?.hectaresRestored,
      selection: selection?.hectaresRestored
    },
    ...(!isHbf && !isTerraFund && metrics.workdays != null
      ? [
          {
            ...progressBarCard,
            key: "workdays",
            title: t(workdaysTitle),
            progress: metrics.workdays.progress,
            goal: metrics.workdays.goal,
            hideGoal: metrics.workdays.goal <= 0,
            icon: <JobsIcon />,
            color: "primary.600",
            tooltipContent: keyIndicatorTooltip(
              keyIndicatorsTooltipContentItem?.jobsCreated.title,
              keyIndicatorsTooltipContentItem?.jobsCreated.content
            ),
            filtered: filtered?.workdays,
            selection: selection?.workdays
          }
        ]
      : [])
  ];

  return <IndexMetricCardRow cards={cards} />;
};

type SiteProjectRowProps = {
  site: SiteIndexSite;
  context?: TableRenderRowContext;
  embeddedInProject: boolean;
  isSelected: boolean;
  onRowSelected: (site: SiteIndexSite, selected: boolean) => void;
};

const SiteProjectRow: FC<SiteProjectRowProps> = ({ site, context, embeddedInProject, isSelected, onRowSelected }) => {
  const t = useT();
  const router = useRouter();
  const { format } = useDate();
  const { handleEdit, EditModals } = useGetEditEntityHandler({
    entityName: "sites",
    entityUUID: site.id,
    entityStatus: site.status ?? "draft",
    updateRequestStatus: site.updateRequestStatus,
    useInformationRequiredModal: true
  });

  return (
    <TableRow
      className={`${context?.className ?? ""} group cursor-pointer`}
      aria-selected={isSelected}
      onClick={() => void router.push(getSiteDetailUrl(site.id, !embeddedInProject))}
    >
      <TableCell {...context?.getCellProps(CHECKBOX_COLUMN_KEY)} onClick={stopRowClick}>
        <Checkbox
          name={`site-${site.id}`}
          aria-label={t("Select {siteName}", { siteName: site.name })}
          checked={isSelected}
          onCheckedChange={({ checked }) => onRowSelected(site, checked === true)}
        />
      </TableCell>
      <TableCell {...context?.getCellProps("name")}>
        <Link href={getSiteDetailUrl(site.id, !embeddedInProject)} className="block max-w-full truncate">
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
        <TagSubmission state={site.status} size="small" />
      </TableCell>
      <TableCell {...context?.getCellProps("update")}>
        <EntityUpdateStatus status={site.update === "complete" ? "approved" : site.update} />
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
        {EditModals}
        <Box className="flex justify-end pr-2">
          <ActionCell
            button={
              isSiteEditable(site)
                ? {
                    children: t("Edit"),
                    leftIcon: <EditIcon boxSize={2.5} />,
                    "aria-label": t("Edit {siteName}", { siteName: site.name }),
                    onClick: () => handleEdit()
                  }
                : undefined
            }
          />
        </Box>
      </TableCell>
    </TableRow>
  );
};

const SiteProjectTable: FC<{
  sites: SiteIndexSite[];
  embeddedInProject: boolean;
}> = ({ sites, embeddedInProject }) => {
  const t = useT();
  const { selectedRows, isSiteSelected, handleRowSelected, handleAllItemsSelected } = useSiteTableSelection(sites);

  const columns = useMemo<TableColumn[]>(
    () => [
      { key: "name", label: t("Site Name"), sortable: true },
      { key: "status", label: t("Status"), sortable: true },
      { key: "update", label: t("Updates"), sortable: true },
      { key: "updatedAt", label: t("Latest Update"), sortable: true },
      { key: "createdAt", label: t("Date Created"), sortable: true },
      { key: "actions", label: "" }
    ],
    [t]
  );

  const renderRow = useCallback(
    (site: SiteIndexSite, context?: TableRenderRowContext) => (
      <SiteProjectRow
        key={site.id}
        site={site}
        context={context}
        embeddedInProject={embeddedInProject}
        isSelected={isSiteSelected(site)}
        onRowSelected={handleRowSelected}
      />
    ),
    [embeddedInProject, handleRowSelected, isSiteSelected]
  );

  return (
    <Table<SiteIndexSite>
      data={sites}
      css={{
        "& table tbody tr:hover": {
          borderBottomColor: "primary.700",
          borderBottomWidth: "0.0625rem"
        }
      }}
      columns={columns}
      selectable
      pageSize={10}
      showPagination
      selectedRows={selectedRows}
      onRowSelected={handleRowSelected}
      onAllItemsSelected={handleAllItemsSelected}
      renderRow={renderRow}
    />
  );
};

type SiteProjectBodyProps = {
  frameworkKey: Framework;
  meta: ProjectSitesMetaDto;
  sites: ReturnType<typeof useSiteProjectRows>;
  isFiltered: boolean;
  embeddedInProject: boolean;
};

/** Metrics and site table for one project. The data comes from the parent's rows hook. */
export const SiteProjectBody: FC<SiteProjectBodyProps> = ({
  frameworkKey,
  meta,
  sites,
  isFiltered,
  embeddedInProject
}) => {
  const t = useT();
  const { selectedRows } = useSiteTableSelection(sites.rows);
  const selectedApproved = selectedRows.filter(isSiteApproved);
  const regeneratedProgress = sites.metrics.treesRegenerated?.progress ?? 0;
  const regeneratedShare = (siteCount: number) =>
    meta.sitesTotal === 0 ? 0 : Math.round((regeneratedProgress * siteCount) / meta.sitesTotal);
  const filtered = isFiltered
    ? {
        treesPlanted: meta.treesPlantedMatching,
        hectaresRestored: meta.hectaresRestoredMatching,
        workdays: meta.workdaysMatching,
        treesRegenerated: regeneratedShare(meta.sitesMatching)
      }
    : null;
  const selection =
    selectedRows.length > 0
      ? {
          treesPlanted: selectedApproved.reduce((total, site) => total + site.treesPlantedCount, 0),
          hectaresRestored: selectedApproved.reduce((total, site) => total + site.totalHectaresRestoredSum, 0),
          workdays: selectedApproved.reduce((total, site) => total + site.combinedWorkdayCount, 0),
          treesRegenerated: regeneratedShare(selectedRows.length)
        }
      : null;

  return (
    <Box className="bg-theme-neutral-100 p-4" minW={0} data-table-scroll-anchor>
      {!sites.loaded || !sites.metricsLoaded ? (
        <IndexLoadingRow label={t("Loading sites...")} minHeight="10rem" />
      ) : (
        <>
          <SiteProjectMetrics
            frameworkKey={frameworkKey}
            metrics={sites.metrics}
            filtered={filtered}
            selection={selection}
          />
          <SiteProjectTable sites={sites.rows} embeddedInProject={embeddedInProject} />
          <InfiniteScrollSentinel
            hasMore={sites.hasMore}
            loading={!sites.loaded}
            loadingMore={sites.loadingMore}
            label={t("Loading sites...")}
            resetKey={sites.rows.length}
            onLoadMore={sites.loadMore}
          />
        </>
      )}
    </Box>
  );
};

interface SiteProjectSectionProps {
  meta: ProjectSitesMetaDto;
  filters: SiteProjectFilters;
  isFiltered: boolean;
  defaultOpen?: boolean;
  openResetKey?: string;
}

/**
 * One project in the sites index. Its sites load the first time the section opens, the same way the reports
 * index loads each project's reports.
 */
const SiteProjectSection: FC<SiteProjectSectionProps> = ({
  meta,
  filters,
  isFiltered,
  defaultOpen = false,
  openResetKey
}) => {
  const t = useT();
  const [open, setOpen] = useIndexAccordionOpen({ defaultOpen, resetKey: openResetKey });
  const [loadRequested, setLoadRequested] = useState(defaultOpen);
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) setLoadRequested(true);
      setOpen(nextOpen);
    },
    [setOpen]
  );

  const sites = useSiteProjectRows(meta, filters, loadRequested);
  const attentionCount = useMemo(
    () => sites.rows.filter(site => SITE_INDEX_ATTENTION_STATUSES.has(site.status)).length,
    [sites.rows]
  );
  const frameworkKey = toFramework(meta.frameworkKey);

  return (
    <Accordion
      variant="tertiary"
      open={open}
      onOpenChange={handleOpenChange}
      isScrollable={false}
      className="w-full overflow-hidden rounded bg-theme-neutral-100"
      classNameHeader="!mb-0"
      header={
        <ListSectionHeader
          level="top-level"
          title={meta.name ?? t("Project")}
          open={open}
          titleHref={`/project/${meta.uuid}`}
          caption={meta.organisationName ?? ""}
          statusLabels={
            attentionCount > 0 ? (
              <TextBadge>{t("{count} Require Attention", { count: attentionCount })}</TextBadge>
            ) : null
          }
        />
      }
    >
      {open ? (
        <SiteProjectBody
          frameworkKey={frameworkKey}
          meta={meta}
          sites={sites}
          isFiltered={isFiltered}
          embeddedInProject={false}
        />
      ) : null}
    </Accordion>
  );
};

export default memo(SiteProjectSection);
