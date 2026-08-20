import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useCreateDisturbanceReport } from "@/connections/Entity";
import { getReportStatusOptions } from "@/constants/options/status";
import { useReportsContext } from "@/context/reports.provider";
import { useDate } from "@/hooks/useDate";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import PageHeader from "@/redesignComponents/content/headers/PageHeaders/PageHeader";
import HighLevelSelector from "@/redesignComponents/Forms/Inputs/HighLevelSelector/HighLevelSelector";
import type { HighLevelSelectorItem } from "@/redesignComponents/Forms/Inputs/HighLevelSelector/HighLevelSelector.types";
import { PlusIcon, ReportsIcon } from "@/redesignComponents/foundations/Icons";
import TabBar from "@/redesignComponents/navigation/TabBar/TabBar";
import Toolbar from "@/redesignComponents/navigation/Toolbar/Toolbar";
import { SelectedFilter } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
import ToolbarObject from "@/redesignComponents/navigation/Toolbar/ToolbarObject";
import ToolbarTable from "@/redesignComponents/navigation/Toolbar/ToolbarTable/ToolbarTable";

import { ALL_PROJECTS_VIEW_VALUE, getReportsIndexUrl } from "../reportIndex.utils";
import { ReportPeriodOptions } from "../reportPeriodFilter";
import {
  clearReportPeriodFilters,
  EMPTY_REPORT_FILTERS,
  formatReportPeriodLabel,
  getDefaultProgressFiltersForSource,
  getReportPeriodControl,
  REPORT_TYPE_LABELS,
  ReportFilterState
} from "./reportFilter.constants";
import ReportsFilterDrawer from "./ReportsFilterDrawer";

type ReportsIndexHeaderProps = {
  activeTab: string;
  source: "project" | "site" | "nursery";
  sourceUuid: string;
  projectUuid: string;
  reportCount: number;
  viewValue: string;
  viewItems: HighLevelSelectorItem[];
  periodOptions: ReportPeriodOptions;
  onTabChange: (tab: string) => void;
  onViewChange: (value: string) => void;
  onQueryChange: (query: string) => void;
  indexHref: string;
};

const ReportsIndexHeader = ({
  activeTab,
  source,
  sourceUuid,
  projectUuid,
  reportCount,
  viewValue,
  viewItems,
  periodOptions,
  onTabChange,
  onViewChange,
  onQueryChange,
  indexHref
}: ReportsIndexHeaderProps) => {
  const t = useT();
  const router = useRouter();
  const { format } = useDate();
  const { setFilters } = useReportsContext();

  const [filtersByTab, setFiltersByTab] = useState<Record<string, ReportFilterState>>(() => ({
    "progress-reports": getDefaultProgressFiltersForSource(source),
    "additional-reports": EMPTY_REPORT_FILTERS
  }));
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const selectedFilters = filtersByTab[activeTab] ?? EMPTY_REPORT_FILTERS;
  const statusOptions = useMemo(() => getReportStatusOptions(t), [t]);

  const updateActiveFilters = useCallback(
    (next: ReportFilterState) => {
      setFiltersByTab(current => ({ ...current, [activeTab]: next }));
      setFilters(next);
    },
    [activeTab, setFilters]
  );

  useEffect(() => {
    setFiltersByTab({
      "progress-reports": getDefaultProgressFiltersForSource(source),
      "additional-reports": EMPTY_REPORT_FILTERS
    });
  }, [source, sourceUuid]);

  useEffect(() => {
    setFilters(selectedFilters);
  }, [activeTab, selectedFilters, setFilters]);

  const { create: createDisturbanceReport, isCreating: disturbanceReportCreating } = useCreateDisturbanceReport(
    {},
    useCallback(
      ({ uuid }) =>
        router.replace(
          `/entity/disturbance-reports/create/framework?entity_uuid=${uuid}&from=${encodeURIComponent(indexHref)}`
        ),
      [indexHref, router]
    ),
    "Failed to create disturbance report"
  );

  const activeFilterLabels = useMemo<SelectedFilter[]>(() => {
    const labels: SelectedFilter[] = [];

    if (selectedFilters.reportTypes.length > 0) {
      labels.push({
        label: selectedFilters.reportTypes.map(type => t(REPORT_TYPE_LABELS[type])),
        category: t("Report Type"),
        onRemove: () => {
          updateActiveFilters({ ...selectedFilters, reportTypes: [] });
        }
      });
    }

    if (selectedFilters.statuses.length > 0) {
      labels.push({
        label: selectedFilters.statuses.map(status => {
          const option = statusOptions.find(item => item.value === status);
          return option?.title ?? status;
        }),
        category: t("Status"),
        onRemove: () => {
          updateActiveFilters({ ...selectedFilters, statuses: [] });
        }
      });
    }

    const periodLabel = formatReportPeriodLabel(selectedFilters, format);
    if (periodLabel != null) {
      const isDateRange = getReportPeriodControl(activeTab, selectedFilters.reportTypes) === "date-range";
      labels.push({
        label: periodLabel,
        category: isDateRange ? t("Due Date") : t("Time Period"),
        onRemove: () => {
          updateActiveFilters(clearReportPeriodFilters(selectedFilters));
        }
      });
    }

    return labels;
  }, [activeTab, format, selectedFilters, statusOptions, t, updateActiveFilters]);

  const applyFilters = useCallback(
    (filters: ReportFilterState) => {
      updateActiveFilters(filters);
    },
    [updateActiveFilters]
  );

  const clearFilters = useCallback(() => {
    updateActiveFilters(EMPTY_REPORT_FILTERS);
    if (source === "project") return;

    void router.replace(
      getReportsIndexUrl("project", projectUuid, {
        tab: activeTab === "additional-reports" ? "additional-reports" : undefined,
        view: viewValue === ALL_PROJECTS_VIEW_VALUE ? ALL_PROJECTS_VIEW_VALUE : undefined
      })
    );
  }, [activeTab, projectUuid, router, source, updateActiveFilters, viewValue]);

  return (
    <>
      <ToolbarObject
        className="sticky top-0 z-20"
        breadcrumbs={{
          linkRouter: router,
          links: [
            {
              icon: <ReportsIcon />,
              label: t("Reports"),
              link: "#"
            }
          ]
        }}
      />
      <PageHeader
        className="!bg-theme-neutral-100 !px-5"
        title={t("Reports")}
        actions={
          <Button
            size="small"
            leftIcon={<PlusIcon boxSize="0.625rem" />}
            disabled={disturbanceReportCreating}
            onClick={() => createDisturbanceReport({ parentUuid: projectUuid })}
          >
            {t("Add Disturbance Report")}
          </Button>
        }
      />
      <Toolbar
        className="sticky top-10 z-10 items-end border-b border-theme-neutral-200 bg-theme-neutral-100 !px-1.5 pt-3"
        classNameContentLeft="min-w-0"
        classNameContentRight="mt-[-1.25rem]"
        contentLeft={
          <TabBar
            key={activeTab}
            variant="transparent"
            defaultValue={activeTab}
            tabs={[
              { value: "progress-reports", label: t("Progress Reports") },
              { value: "additional-reports", label: t("Additional Reports") }
            ]}
            onTabClick={onTabChange}
          />
        }
        contentRight={
          <HighLevelSelector
            autocomplete
            label={t("View:")}
            items={viewItems}
            value={viewValue}
            emptyMessage={t("No results found")}
            width="25rem"
            className="mobile:!w-full"
            onChange={onViewChange}
          />
        }
      />
      <ToolbarTable
        className="!bg-theme-neutral-200 !px-5 !pb-6 !pt-5"
        classNameContentLeft="w-full"
        search={{
          placeholder: activeTab === "progress-reports" ? t("Search projects, sites, nurseries") : t("Search"),
          options: [],
          displayResults: "none",
          count: reportCount,
          label: t("Reports"),
          onQueryChange
        }}
        classNameContentSearch="w-[19rem]"
        selectedFilters={activeFilterLabels}
        showClearFilters={activeFilterLabels.length > 0}
        onClickFilterButton={() => setIsFilterDrawerOpen(true)}
        onClearFilters={clearFilters}
      />
      <ReportsFilterDrawer
        open={isFilterDrawerOpen}
        activeTab={activeTab}
        filters={selectedFilters}
        periodOptions={periodOptions}
        onApplyFilters={applyFilters}
        onOpenChange={setIsFilterDrawerOpen}
      />
    </>
  );
};

export default ReportsIndexHeader;
