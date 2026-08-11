import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

import { getReportStatusOptions } from "@/constants/options/status";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import PageHeader from "@/redesignComponents/content/headers/PageHeaders/PageHeader";
import HighLevelSelector from "@/redesignComponents/Forms/Inputs/HighLevelSelector/HighLevelSelector";
import { PlusIcon, ReportsIcon } from "@/redesignComponents/foundations/Icons";
import TabBar from "@/redesignComponents/navigation/TabBar/TabBar";
import Toolbar from "@/redesignComponents/navigation/Toolbar/Toolbar";
import { SelectedFilter } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
import ToolbarObject from "@/redesignComponents/navigation/Toolbar/ToolbarObject";
import ToolbarTable from "@/redesignComponents/navigation/Toolbar/ToolbarTable/ToolbarTable";

import { EMPTY_REPORT_FILTERS, REPORT_TYPE_LABELS, ReportFilterState } from "./reportFilter.constants";
import ReportsFilterDrawer from "./ReportsFilterDrawer";

type ReportsIndexHeaderProps = {
  activeTab: string;
  reportCount: number;
  selectedViewLabel: string;
  onTabChange: (tab: string) => void;
  onQueryChange: (query: string) => void;
};

const ReportsIndexHeader = ({
  activeTab,
  reportCount,
  selectedViewLabel,
  onTabChange,
  onQueryChange
}: ReportsIndexHeaderProps) => {
  const t = useT();
  const router = useRouter();

  const [filtersByTab, setFiltersByTab] = useState<Record<string, ReportFilterState>>({
    "progress-reports": EMPTY_REPORT_FILTERS,
    "additional-reports": EMPTY_REPORT_FILTERS
  });
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const selectedFilters = filtersByTab[activeTab] ?? EMPTY_REPORT_FILTERS;
  const statusOptions = useMemo(() => getReportStatusOptions(t), [t]);

  const activeFilterLabels = useMemo<SelectedFilter[]>(() => {
    const labels: SelectedFilter[] = [];

    if (selectedFilters.reportTypes.length > 0) {
      labels.push({
        label: selectedFilters.reportTypes.map(type => t(REPORT_TYPE_LABELS[type])),
        category: t("Report Type"),
        onRemove: () => {
          setFiltersByTab(current => ({
            ...current,
            [activeTab]: { ...(current[activeTab] ?? EMPTY_REPORT_FILTERS), reportTypes: [] }
          }));
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
          setFiltersByTab(current => ({
            ...current,
            [activeTab]: { ...(current[activeTab] ?? EMPTY_REPORT_FILTERS), statuses: [] }
          }));
        }
      });
    }

    if (selectedFilters.dueDateFrom !== "" || selectedFilters.dueDateTo !== "") {
      const fromLabel = selectedFilters.dueDateFrom !== "" ? selectedFilters.dueDateFrom : t("Any date");
      const toLabel = selectedFilters.dueDateTo !== "" ? selectedFilters.dueDateTo : t("Any date");
      labels.push({
        label: `${fromLabel} - ${toLabel}`,
        category: t("Due Date"),
        onRemove: () => {
          setFiltersByTab(current => ({
            ...current,
            [activeTab]: { ...(current[activeTab] ?? EMPTY_REPORT_FILTERS), dueDateFrom: "", dueDateTo: "" }
          }));
        }
      });
    }

    return labels;
  }, [activeTab, selectedFilters, statusOptions, t]);

  const applyFilters = (filters: ReportFilterState) => {
    setFiltersByTab(current => ({ ...current, [activeTab]: filters }));
  };

  const clearFilters = () => {
    setFiltersByTab(current => ({ ...current, [activeTab]: EMPTY_REPORT_FILTERS }));
  };

  return (
    <div className="bg-white">
      <ToolbarObject
        className="border-b border-theme-neutral-300 !px-6"
        breadcrumbs={{
          links: [
            {
              label: t("Reports"),
              link: router.asPath,
              icon: <ReportsIcon className="text-theme-primary-900" />
            }
          ],
          linkRouter: router,
          size: "small"
        }}
      />
      <PageHeader
        className="!bg-theme-neutral-100"
        title={t("Reports")}
        actions={
          <Button size="small" leftIcon={<PlusIcon boxSize="10px" />}>
            {t("Add Disturbance Report")}
          </Button>
        }
      />
      <Toolbar
        className="items-end border-b border-theme-neutral-200 !px-3 mobile:flex-col mobile:!items-stretch mobile:gap-3"
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
            items={[{ label: selectedViewLabel, value: "current-view" }]}
            value="current-view"
            width="400px"
            className="mobile:!w-full"
          />
        }
      />
      <ToolbarTable
        className="!bg-theme-neutral-200 !px-6 !pb-6 !pt-5"
        classNameContentLeft="w-full"
        search={{
          placeholder: t("Search projects, sites, nurseries"),
          options: [],
          displayResults: "none",
          count: reportCount,
          label: t("Reports"),
          onQueryChange
        }}
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
