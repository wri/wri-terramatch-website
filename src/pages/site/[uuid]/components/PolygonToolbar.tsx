import { useT } from "@transifex/react";
import { FC, useState } from "react";

import { SelectedFilter } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
import ToolbarTable from "@/redesignComponents/navigation/Toolbar/ToolbarTable/ToolbarTable";

import { PolygonFilterState } from "./polygonFilter.constants";
import PolygonFilterDrawer from "./PolygonFilterDrawer";

interface PolygonToolbarProps {
  resultCount: number;
  polygonSearch: string;
  polygonFilters: PolygonFilterState;
  activeFilterLabels: SelectedFilter[];
  onSearchChange: (value: string) => void;
  onApplyFilters: (filters: PolygonFilterState) => void;
  onClearFilters: () => void;
}

const PolygonToolbar: FC<PolygonToolbarProps> = ({
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

  const handleOnSearch = (value: string) => {
    onSearchChange(value);
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
        search={{
          label: t(resultCount === 1 ? "Result" : "Results"),
          placeholder: t("Search"),
          options: [],
          resetKey: searchResetKey,
          displayResults: "none",
          onQueryChange: handleOnSearch,
          count: resultCount
        }}
      />
      <PolygonFilterDrawer
        open={isFilterDrawerOpen}
        filters={polygonFilters}
        onApplyFilters={onApplyFilters}
        onClearFilters={handleOnClearFilters}
        onOpenChange={setIsFilterDrawerOpen}
      />
    </>
  );
};

export default PolygonToolbar;
