import { Box, TableCell, TableRow, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import Link from "next/link";
import { type FC, useMemo } from "react";

import { Framework, isTerrafund } from "@/context/framework.provider";
import ActionStatusTag from "@/redesignComponents/actions/Tags/ActionStatusTag/ActionStatusTag";
import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import Accordion from "@/redesignComponents/containers/Accordion/Accordion";
import ListSectionHeader from "@/redesignComponents/containers/Accordion/ListSectionHeader";
import Carousel from "@/redesignComponents/containers/Carousel/Carousel";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import ActionCell from "@/redesignComponents/dataDisplay/Table/components/ActionCell";
import Table, { type TableRenderRowContext, CHECKBOX_COLUMN_KEY } from "@/redesignComponents/dataDisplay/Table/Table";
import Checkbox from "@/redesignComponents/Forms/Actions/Checkbox/Checkbox";
import {
  AreaHectaresIcon,
  CalendarIcon,
  EditIcon,
  FolderOpenIcon,
  JobsIcon,
  RegenerationIcon,
  SeedlingsIcon,
  TreeIcon
} from "@/redesignComponents/foundations/Icons";

import type { SiteIndexProject, SiteIndexSite, SiteIndexStatus } from "./siteIndexMockData";

interface SiteProjectSectionProps {
  project: SiteIndexProject;
  sites: SiteIndexSite[];
  totalSiteCount: number;
  selectedSiteIds: Set<string>;
  onRowSelected: (site: SiteIndexSite, checked: boolean) => void;
  onAllItemsSelected: (checked: boolean, visibleSites: SiteIndexSite[]) => void;
  isFiltered: boolean;
  defaultOpen?: boolean;
}

const SiteStatusTag: FC<{ status: SiteIndexStatus }> = ({ status }) => <TagSubmission state={status} size="small" />;

const SiteProjectSection: FC<SiteProjectSectionProps> = ({
  project,
  sites,
  totalSiteCount,
  selectedSiteIds,
  onRowSelected,
  onAllItemsSelected,
  isFiltered,
  defaultOpen = false
}) => {
  const t = useT();
  const selectedSites = useMemo(() => sites.filter(site => selectedSiteIds.has(site.id)), [selectedSiteIds, sites]);
  const filteredMetric = (progress: number) =>
    totalSiteCount === 0 ? 0 : Math.round(progress * (sites.length / totalSiteCount));
  const selectedMetric = (progress: number) =>
    totalSiteCount === 0 ? 0 : Math.round(progress * (selectedSites.length / totalSiteCount));
  const metricCardClassName = "min-w-fit shrink-0 flex-1";
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
      <Box paddingX={4} paddingBottom={7} paddingTop={4} minW={0}>
        <Carousel className="mb-5" gap={4} scrollAmount={400}>
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
              filtered={isFiltered ? filteredMetric(primaryMetric.progress) : undefined}
              selection={selectedSites.length > 0 ? selectedMetric(primaryMetric.progress) : undefined}
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
              selection={
                selectedSites.length > 0 ? selectedMetric(project.metrics.treesRegenerated.progress) : undefined
              }
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
            filtered={isFiltered ? filteredMetric(project.metrics.areaRestored.progress) : undefined}
            selection={selectedSites.length > 0 ? selectedMetric(project.metrics.areaRestored.progress) : undefined}
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
        </Carousel>

        <Table<SiteIndexSite>
          data={sites}
          css={{
            "& table tbody tr:hover": {
              borderBottomColor: "primary.700",
              borderBottomWidth: "0.0625rem"
            }
          }}
          columns={[
            { key: "name", label: t("Site Name"), sortable: true, width: "44%" },
            { key: "changeRequest", label: t("Change Request"), sortable: true, width: "18%" },
            { key: "status", label: t("Status"), sortable: true, width: "18%" },
            { key: "dateCreated", label: t("Date Created"), sortable: true, width: "calc(20% - 130px)" },
            { key: "actions", label: "", width: "130px" }
          ]}
          selectable
          pageSize={10}
          showPagination
          showItemCount={false}
          selectedRows={selectedSites}
          onRowSelected={onRowSelected}
          onAllItemsSelected={onAllItemsSelected}
          renderRow={(site, context?: TableRenderRowContext) => (
            <TableRow className={`${context?.className ?? ""} group`} aria-selected={selectedSiteIds.has(site.id)}>
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
              <TableCell {...context?.getCellProps("actions")}>
                <Box className="flex justify-center">
                  <ActionCell
                    button={{
                      children: t("Edit"),
                      leftIcon: <EditIcon boxSize={2.5} />,
                      "aria-label": t("Edit {siteName}", { siteName: site.name }),
                      onClick: () => {}
                    }}
                  />
                </Box>
              </TableCell>
            </TableRow>
          )}
        />
      </Box>
    </Accordion>
  );
};

export default SiteProjectSection;
