import { Box, Flex, TableCell, TableRow, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import Link from "next/link";
import { useRouter } from "next/router";
import { type FC, type MouseEvent, useCallback, useMemo, useState } from "react";

import { deleteSite } from "@/connections/Entity";
import { Framework, isTerrafund } from "@/context/framework.provider";
import { getEntityEditPageLink } from "@/helpers/entity";
import { useDate } from "@/hooks/useDate";
import { getThemedColor } from "@/lib/theme";
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
  DeleteIcon,
  EditIcon,
  FolderIcon,
  FolderOpenIcon,
  JobsIcon,
  RegenerationIcon,
  SeedlingsIcon,
  TreeIcon
} from "@/redesignComponents/foundations/Icons";
import TextBadge from "@/redesignComponents/status/Badge/TextBadge";
import ApiSlice from "@/store/apiSlice";

import DeleteSite from "./Modals/DeleteSite";
import type { SiteIndexProject, SiteIndexSite, SiteIndexStatus, SiteIndexUpdate } from "./siteIndex.types";
import { useSiteIndexSelectionActions, useSiteTableSelection } from "./SiteIndexSelection.provider";
import { isSiteDeletable } from "./siteIndexSubmit";

interface SiteProjectSectionProps {
  project: SiteIndexProject;
  sites: SiteIndexSite[];
  totalSiteCount: number;
  isFiltered: boolean;
  defaultOpen?: boolean;
  onSitesChanged: () => void;
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
    <Box className="flex items-center gap-1 text-theme-neutral-800">
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
  onDeleteSite: (site: SiteIndexSite) => void;
}> = ({ sites, onDeleteSite }) => {
  const t = useT();
  const router = useRouter();
  const { format } = useDate();
  const { selectedRows, isSiteSelected, handleRowSelected, handleAllItemsSelected } = useSiteTableSelection(sites);

  const columns = useMemo<TableColumn[]>(
    () => [
      { key: "name", label: t("Site Name"), sortable: true, width: "384px" },
      { key: "status", label: t("Status"), sortable: true, width: "200px" },
      { key: "update", label: t("Updates"), sortable: true, width: "250px" },
      { key: "updatedAt", label: t("Latest Update"), sortable: true, width: "170px" },
      { key: "createdAt", label: t("Date Created"), sortable: true, width: "150px" },
      { key: "actions", label: "", width: "130px" }
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
                buttonSecondary={
                  isSiteDeletable(site)
                    ? {
                        children: t("Delete"),
                        "aria-label": t("Delete {siteName}", { siteName: site.name }),
                        variant: "secondary",
                        size: "small",
                        className: "!border-theme-error-300 !bg-theme-error-100 !text-theme-error-900",
                        leftIcon: (
                          <DeleteIcon
                            boxSize={2.5}
                            className="!text-theme-error-500"
                            css={{
                              "& svg path": {
                                fill: getThemedColor("error", 500) + " !important",
                                color: getThemedColor("error", 500) + " !important"
                              }
                            }}
                          />
                        ),
                        onClick: () => onDeleteSite(site)
                      }
                    : undefined
                }
              />
            </Box>
          </TableCell>
        </TableRow>
      );
    },
    [format, handleRowSelected, isSiteSelected, onDeleteSite, router, t]
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
  defaultOpen = false,
  onSitesChanged
}) => {
  const t = useT();
  const [open, setOpen] = useState(defaultOpen);
  const [siteToDelete, setSiteToDelete] = useState<SiteIndexSite | null>(null);
  const { setSiteSelected } = useSiteIndexSelectionActions();

  const handleConfirmRowDelete = useCallback(async () => {
    if (siteToDelete == null) {
      return;
    }

    try {
      await deleteSite(siteToDelete.id);
      setSiteSelected(siteToDelete, false);
      ApiSlice.pruneCache("sites", [siteToDelete.id]);
      ApiSlice.pruneIndex("sites", "");
      ApiSlice.pruneIndex("projects", "");
      onSitesChanged();
      showToast({
        label: t("Site Profile(s) deleted"),
        type: "success",
        placement: "bottom",
        duration: 5000
      });
    } catch (error) {
      showToast({
        label: t("Something went wrong!"),
        type: "error",
        placement: "bottom"
      });
      throw error;
    }
  }, [onSitesChanged, setSiteSelected, siteToDelete, t]);

  return (
    <Flex direction="column" gap="0.5rem">
      <Accordion
        variant="tertiary"
        open={open}
        onOpenChange={setOpen}
        className="w-full overflow-hidden rounded bg-theme-neutral-100"
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
                <FolderIcon minWidth={5} width={5} height="auto" color="neutral.400" />
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
          <SiteProjectTable sites={sites} onDeleteSite={setSiteToDelete} />
        </Box>
      </Accordion>
      <DeleteSite
        open={siteToDelete != null}
        onOpenChange={open => {
          if (!open) {
            setSiteToDelete(null);
          }
        }}
        sites={siteToDelete == null ? [] : [siteToDelete]}
        onDelete={handleConfirmRowDelete}
      />
    </Flex>
  );
};

export default SiteProjectSection;
