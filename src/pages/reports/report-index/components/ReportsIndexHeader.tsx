import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useCreateDisturbanceReport } from "@/connections/Entity";
import { getReportStatusOptions } from "@/constants/options/status";
import { useReportsContext } from "@/context/reports.provider";
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

import {
  EMPTY_REPORT_FILTERS,
  getDefaultProgressFiltersForSource,
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
  onTabChange: (tab: string) => void;
  onViewChange: (value: string) => void;
  onQueryChange: (query: string) => void;
};

const ReportsIndexHeader = ({
  activeTab,
  source,
  sourceUuid,
  projectUuid,
  reportCount,
  viewValue,
  viewItems,
  onTabChange,
  onViewChange,
  onQueryChange
}: ReportsIndexHeaderProps) => {
  const t = useT();
  const router = useRouter();
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
      ({ uuid }) => router.replace(`/entity/disturbance-reports/create/framework?entity_uuid=${uuid}`),
      [router]
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

    if (selectedFilters.dueDate !== "") {
      labels.push({
        label: selectedFilters.dueDate,
        category: t("Due Date"),
        onRemove: () => {
          updateActiveFilters({ ...selectedFilters, dueDate: "" });
        }
      });
    }

    return labels;
  }, [selectedFilters, statusOptions, t, updateActiveFilters]);

  const applyFilters = useCallback(
    (filters: ReportFilterState) => {
      updateActiveFilters(filters);
    },
    [updateActiveFilters]
  );

  const clearFilters = useCallback(() => {
    updateActiveFilters(EMPTY_REPORT_FILTERS);
  }, [updateActiveFilters]);

  console.log(activeTab, "activeTab");
  return (
    <div className="bg-white">
      <ToolbarObject
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
        className="!bg-theme-neutral-100"
        title={t("Reports")}
        actions={
          <Button
            size="small"
            leftIcon={<PlusIcon boxSize="10px" />}
            disabled={disturbanceReportCreating}
            onClick={() => createDisturbanceReport({ parentUuid: projectUuid })}
          >
            {t("Add Disturbance Report")}
          </Button>
        }
      />
      <Toolbar
        className="mt-3 items-end border-b border-theme-neutral-200 !px-3 mobile:flex-col mobile:!items-stretch mobile:gap-3"
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
            label={t("View:")}
            items={viewItems}
            value={viewValue}
            width="400px"
            className="mobile:!w-full"
            onChange={onViewChange}
          />
        }
      />
      <ToolbarTable
        className="!bg-theme-neutral-200 !px-6 !pb-6 !pt-5"
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
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
        onOpenChange={setIsFilterDrawerOpen}
      />
    </div>
  );
};

export default ReportsIndexHeader;
