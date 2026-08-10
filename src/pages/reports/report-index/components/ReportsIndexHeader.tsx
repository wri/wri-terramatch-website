import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useState } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import PageHeader from "@/redesignComponents/content/headers/PageHeaders/PageHeader";
import HighLevelSelector from "@/redesignComponents/Forms/Inputs/HighLevelSelector/HighLevelSelector";
import { PlusIcon, ReportsIcon } from "@/redesignComponents/foundations/Icons";
import TabBar from "@/redesignComponents/navigation/TabBar/TabBar";
import Toolbar from "@/redesignComponents/navigation/Toolbar/Toolbar";
import ToolbarObject from "@/redesignComponents/navigation/Toolbar/ToolbarObject";
import ToolbarTable from "@/redesignComponents/navigation/Toolbar/ToolbarTable/ToolbarTable";

type ReportsIndexHeaderProps = {
  activeTab: string;
  selectedViewLabel: string;
  onTabChange: (tab: string) => void;
};

const DEFAULT_FILTERS = ["Site Reports", "Draft", "31/08/2026"];

const ReportsIndexHeader = ({ activeTab, selectedViewLabel, onTabChange }: ReportsIndexHeaderProps) => {
  const t = useT();
  const router = useRouter();
  const [filtersByTab, setFiltersByTab] = useState<Record<string, string[]>>({
    "progress-reports": DEFAULT_FILTERS,
    "additional-reports": DEFAULT_FILTERS
  });
  const selectedFilters = filtersByTab[activeTab] ?? DEFAULT_FILTERS;

  const removeFilter = (filterToRemove: string) => {
    setFiltersByTab(current => ({
      ...current,
      [activeTab]: (current[activeTab] ?? DEFAULT_FILTERS).filter(filter => filter !== filterToRemove)
    }));
  };

  const clearFilters = () => {
    setFiltersByTab(current => ({ ...current, [activeTab]: [] }));
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
          count: 5,
          label: t("Reports")
        }}
        selectedFilters={selectedFilters.map(label => ({
          label,
          onRemove: () => removeFilter(label)
        }))}
        onClearFilters={clearFilters}
      />
    </div>
  );
};

export default ReportsIndexHeader;
