import { useT } from "@transifex/react";
import { FC, useState } from "react";

import { SelectedFilter } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
import ToolbarTable from "@/redesignComponents/navigation/Toolbar/ToolbarTable/ToolbarTable";
import {
  resolveActivePolygonFilterTypes,
  trackPolygonFilterApplied,
  trackPolygonSearchUsed
} from "@/utils/polygonAnalytics";

import { PolygonFilterState } from "./polygonFilter.constants";
import PolygonFilterDrawer from "./PolygonFilterDrawer";

interface PolygonToolbarProps {
  siteUuid: string;
  resultCount: number;
  polygonSearch: string;
  polygonFilters: PolygonFilterState;
  activeFilterLabels: SelectedFilter[];
  onSearchChange: (value: string) => void;
  onApplyFilters: (filters: PolygonFilterState) => void;
  onClearFilters: () => void;
}

const PolygonToolbar: FC<PolygonToolbarProps> = ({
  siteUuid,
  resultCount,
  polygonSearch,
  polygonFilters,
  activeFilterLabels,
  onSearchChange,
  onApplyFilters,
  onClearFilters
}) => {
  const t = useT();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [searchResetKey, setSearchResetKey] = useState(0);

  const handleOnClickFilterButton = () => {
    setIsFilterDrawerOpen(true);
  };

  const handleOnSearchSubmit = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue === "") {
      return;
    }
    trackPolygonSearchUsed({ siteUuid });
    onSearchChange(trimmedValue);
  };

  const handleApplyFilters = (filters: PolygonFilterState) => {
    trackPolygonFilterApplied({
      siteUuid,
      filterTypes: resolveActivePolygonFilterTypes(filters)
    });
    onApplyFilters(filters);
  };

  const handleOnClearFilters = () => {
    onClearFilters();
    setSearchResetKey(current => current + 1);
  };

  return (
    <>
      <ToolbarTable
        className="!px-0"
        onClickFilterButton={handleOnClickFilterButton}
        onClearFilters={handleOnClearFilters}
        showClearFilters={activeFilterLabels.length > 0 || polygonSearch.trim().length > 0}
        selectedFilters={activeFilterLabels}
        classNameContentLeft="w-full"
        search={{
          label: t(resultCount === 1 ? "Result" : "Results"),
          placeholder: t("Search"),
          options: [],
          resetKey: searchResetKey,
          displayResults: "none",
          onSearchSubmit: handleOnSearchSubmit,
          count: resultCount
        }}
      />
      <PolygonFilterDrawer
        open={isFilterDrawerOpen}
        filters={polygonFilters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleOnClearFilters}
        onOpenChange={setIsFilterDrawerOpen}
      />
    </>
  );
};

export default PolygonToolbar;
