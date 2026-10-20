import { Box, TableCell, TableRow, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { type FC, type MouseEvent, memo, ReactNode, useCallback, useEffect, useMemo } from "react";

import EntityUpdateStatus from "@/components/extensive/EntityIndex/EntityUpdateStatus";
import IndexLoadingRow from "@/components/extensive/EntityIndex/IndexLoadingRow";
import { Framework, isTerrafund } from "@/context/framework.provider";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { useDate } from "@/hooks/useDate";
import { useIndexAccordionOpen } from "@/hooks/useIndexAccordionOpen";
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

import type { SiteIndexProject, SiteIndexSite, SiteIndexStatus, SiteIndexUpdate } from "./siteIndex.types";
import { filterSiteIndexSites, getSiteDetailUrl, isSiteApproved } from "./siteIndex.utils";
import { useSiteTableSelection } from "./SiteIndexSelection.provider";
import { isSiteEditable } from "./siteIndexSubmit";

const keyIndicatorTooltip = (title?: string, content?: string): ReactNode => {
  if (title == null || title === "" || content == null || content === "") return undefined;

  return (
    <Box>
      <Text textStyle="300-bold">{title}</Text>
      <Text textStyle="300">{content}</Text>
    </Box>
  );
};

interface SiteProjectSectionProps {
  project: SiteIndexProject;
  sites: SiteIndexSite[];
  totalSiteCount: number;
  isFiltered: boolean;
  searchQuery?: string;
  statusFilters?: SiteIndexStatus[];
  updateFilter?: SiteIndexUpdate | null;
  defaultOpen?: boolean;
  openResetKey?: string;
  onProjectOpened: (projectId: string) => void;
  embeddedInProject?: boolean;
}

const stopRowClick = (event: MouseEvent) => {
  event.stopPropagation();
};

const SiteProjectMetrics: FC<{
  project: SiteIndexProject;
  sites: SiteIndexSite[];
  totalSiteCount: number;
  isFiltered: boolean;
}> = ({ project, sites, isFiltered }) => {
  const t = useT();
  const { selectedRows: selectedSites } = useSiteTableSelection(sites);
  const approvedSites = sites.filter(isSiteApproved);
  const approvedSelectedSites = selectedSites.filter(isSiteApproved);
  const approvedTotalCount = project.sites.filter(isSiteApproved).length;
  const filteredMetric = (progress: number) =>
    approvedTotalCount === 0 ? 0 : Math.round(progress * (approvedSites.length / approvedTotalCount));
  const selectedMetric = (progress: number) =>
    approvedTotalCount === 0 ? 0 : Math.round(progress * (approvedSelectedSites.length / approvedTotalCount));
  const filteredTrees = approvedSites.reduce((total, site) => total + site.treesPlantedCount, 0);
  const selectedTrees = approvedSelectedSites.reduce((total, site) => total + site.treesPlantedCount, 0);
  const filteredArea = approvedSites.reduce((total, site) => total + site.totalHectaresRestoredSum, 0);
  const selectedArea = approvedSelectedSites.reduce((total, site) => total + site.totalHectaresRestoredSum, 0);
  const isHbf = project.frameworkKey === Framework.HBF;
  const isTerraFund = isTerrafund(project.frameworkKey);
  const primaryMetric = isHbf
    ? project.metrics.saplingsGrowing
    : isTerraFund
    ? project.metrics.treesPlanted
    : project.metrics.treesGrowing;
  const primaryMetricIcon = isHbf ? <SeedlingsIcon /> : <TreeIcon />;
  const keyIndicatorsTooltipContent = useKeyIndicatorsTooltipContent();
  const keyIndicatorsTooltipContentItem = useMemo(
    () => keyIndicatorsTooltipContent.find(content => content.frameworks.includes(project.frameworkKey)),
    [keyIndicatorsTooltipContent, project.frameworkKey]
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
            filtered: isFiltered ? filteredTrees : undefined,
            selection: selectedSites.length > 0 ? selectedTrees : undefined
          }
        ]),
    ...(isTerraFund && project.metrics.treesRegenerated != null
      ? [
          {
            ...progressBarCard,
            key: "trees-regenerated",
            title: t(keyIndicatorsTooltipContentItem?.treesRegenerated.title ?? "Trees Regenerated"),
            progress: project.metrics.treesRegenerated.progress,
            goal: project.metrics.treesRegenerated.goal,
            icon: <RegenerationIcon />,
            color: "secondary.600",
            tooltipContent: keyIndicatorTooltip(
              keyIndicatorsTooltipContentItem?.treesRegenerated.title ?? t("Trees Regenerated"),
              keyIndicatorsTooltipContentItem?.treesRegenerated.content
            ),
            filtered: isFiltered ? filteredMetric(project.metrics.treesRegenerated.progress) : undefined,
            selection: selectedSites.length > 0 ? selectedMetric(project.metrics.treesRegenerated.progress) : undefined
          }
        ]
      : []),
    {
      ...progressBarCard,
      key: "area-restored",
      title: t(areaTitle),
      progress: project.metrics.areaRestored.progress,
      goal: project.metrics.areaRestored.goal,
      color: "secondary.700",
      icon: <AreaHectaresIcon />,
      tooltipContent: keyIndicatorTooltip(
        keyIndicatorsTooltipContentItem?.hectaresRestored.title,
        keyIndicatorsTooltipContentItem?.hectaresRestored.content
      ),
      filtered: isFiltered ? filteredArea : undefined,
      selection: selectedSites.length > 0 ? selectedArea : undefined
    },
    ...(!isHbf && !isTerraFund && project.metrics.workdays != null
      ? [
          {
            ...progressBarCard,
            key: "workdays",
            title: t(workdaysTitle),
            progress: project.metrics.workdays.progress,
            goal: project.metrics.workdays.goal,
            icon: <JobsIcon />,
            color: "primary.600",
            tooltipContent: keyIndicatorTooltip(
              keyIndicatorsTooltipContentItem?.jobsCreated.title,
              keyIndicatorsTooltipContentItem?.jobsCreated.content
            ),
            filtered: isFiltered ? filteredMetric(project.metrics.workdays.progress) : undefined,
            selection: selectedSites.length > 0 ? selectedMetric(project.metrics.workdays.progress) : undefined
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
      {EditModals}
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

const SiteProjectSection: FC<SiteProjectSectionProps> = ({
  project,
  sites,
  totalSiteCount,
  isFiltered,
  searchQuery = "",
  statusFilters = [],
  updateFilter = null,
  defaultOpen = false,
  openResetKey,
  onProjectOpened,
  embeddedInProject = false
}) => {
  const t = useT();
  const [open, setOpen] = useIndexAccordionOpen({ defaultOpen, resetKey: openResetKey });
  const showSitesLoading = (embeddedInProject || open) && (project.sitesLoading || !project.sitesLoaded);
  const visibleSites = useMemo(
    () =>
      filterSiteIndexSites(sites, {
        search: searchQuery,
        statusFilters,
        updateFilter
      }),
    [searchQuery, sites, statusFilters, updateFilter]
  );

  useEffect(() => {
    if (embeddedInProject) {
      if (project.sitesLoaded || project.sitesLoading) return;
      onProjectOpened(project.id);
      return;
    }
    if (!open || project.sitesLoaded || project.sitesLoading) return;
    onProjectOpened(project.id);
  }, [embeddedInProject, onProjectOpened, open, project.id, project.sitesLoaded, project.sitesLoading]);

  const sectionBody = (
    <Box className="bg-theme-neutral-100 p-4" minW={0}>
      {showSitesLoading ? (
        <IndexLoadingRow label={t("Loading sites...")} minHeight="10rem" />
      ) : (
        <>
          <SiteProjectMetrics
            project={project}
            sites={visibleSites}
            totalSiteCount={totalSiteCount}
            isFiltered={isFiltered}
          />
          <SiteProjectTable sites={visibleSites} embeddedInProject={embeddedInProject} />
        </>
      )}
    </Box>
  );

  if (embeddedInProject) {
    return <Box className="bg-theme-neutral-100 overflow-hidden rounded">{sectionBody}</Box>;
  }

  return (
    <Accordion
      variant="tertiary"
      open={open}
      onOpenChange={setOpen}
      isScrollable={false}
      className="bg-theme-neutral-100 w-full overflow-hidden rounded"
      classNameHeader="!mb-0"
      header={
        <ListSectionHeader
          level="top-level"
          title={project.name}
          open={open}
          titleHref={`/project/${project.id}`}
          caption={project.organisationName}
          statusLabels={
            project.attentionCount > 0 ? (
              <TextBadge>{t("{count} Require Attention", { count: project.attentionCount })}</TextBadge>
            ) : null
          }
        />
      }
    >
      {sectionBody}
    </Accordion>
  );
};

export default memo(SiteProjectSection);
