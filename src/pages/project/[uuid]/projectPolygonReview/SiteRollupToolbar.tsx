import { useT } from "@transifex/react";
import { FC, ReactNode, useState } from "react";

import { SelectedFilter } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
import ToolbarTable from "@/redesignComponents/navigation/Toolbar/ToolbarTable/ToolbarTable";

import SiteRollupFilterDrawer from "./SiteRollupFilterDrawer";
import { SiteRollupFilterState } from "./siteRollupFilter.constants";

interface SiteRollupToolbarProps {
  resultCount: number;
  siteSearch: string;
  siteFilters: SiteRollupFilterState;
  activeFilterLabels: SelectedFilter[];
  // Optional right-slot content (e.g. compact KPI boxes) rendered right-aligned in the toolbar.
  rightContent?: ReactNode;
  onSearchChange: (value: string) => void;
  onApplyFilters: (filters: SiteRollupFilterState) => void;
  onClearFilters: () => void;
}

/**
 * Left-justified search + filter toolbar for the rollup view. The site analog of `PolygonToolbar`
 * (`src/pages/site/[uuid]/components/PolygonToolbar.tsx`): the same `ToolbarTable` (contentLeft
 * search + a "Filter (n)" button) wired to a right-side filter drawer, so the two views feel
 * identical. Search submits on Enter and matches the site name; Clear All resets the search box too.
 */
const SiteRollupToolbar: FC<SiteRollupToolbarProps> = ({
  resultCount,
  siteSearch,
  siteFilters,
  activeFilterLabels,
  rightContent,
  onSearchChange,
  onApplyFilters,
  onClearFilters
}) => {
  const t = useT();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [searchResetKey, setSearchResetKey] = useState(0);

  const handleOnSearchSubmit = (value: string) => {
    onSearchChange(value.trim());
  };

  const handleOnClearFilters = () => {
    onClearFilters();
    setSearchResetKey(current => current + 1);
  };

  return (
    <>
      <ToolbarTable
        className="!px-0"
        onClickFilterButton={() => setIsFilterDrawerOpen(true)}
        onClearFilters={handleOnClearFilters}
        showClearFilters={activeFilterLabels.length > 0 || siteSearch.trim().length > 0}
        selectedFilters={activeFilterLabels}
        rightContent={rightContent}
        // With right-slot content present, the left group sizes to its content so the KPIs sit at the
        // right edge (justify-between); otherwise it keeps its full-width behavior.
        classNameContentLeft={rightContent != null ? undefined : "w-full"}
        search={{
          label: t(resultCount === 1 ? t("Site") : t("Sites")),
          placeholder: t("Search sites"),
          options: [],
          resetKey: searchResetKey,
          displayResults: "none",
          onSearchSubmit: handleOnSearchSubmit,
          count: resultCount
        }}
      />
      <SiteRollupFilterDrawer
        open={isFilterDrawerOpen}
        filters={siteFilters}
        onApplyFilters={onApplyFilters}
        onClearFilters={handleOnClearFilters}
        onOpenChange={setIsFilterDrawerOpen}
      />
    </>
  );
};

export default SiteRollupToolbar;
