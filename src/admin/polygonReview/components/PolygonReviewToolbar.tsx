import { useT } from "@transifex/react";
import { FC, useCallback, useState } from "react";

import { PolygonFilterState } from "@/pages/site/[uuid]/components/polygonFilter.constants";
import PolygonFilterDrawer from "@/pages/site/[uuid]/components/PolygonFilterDrawer";
import { SelectedFilter } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
import ToolbarTable from "@/redesignComponents/navigation/Toolbar/ToolbarTable/ToolbarTable";

type PolygonReviewToolbarProps = {
  projectUuid?: string;
  matchingPolygonCount?: number;
  projectPolygonCount?: number;
  polygonFilters: PolygonFilterState;
  activeFilterLabels: SelectedFilter[];
  searchResetKey: number;
  onSearchChange: (search: string) => void;
  onApplyFilters: (filters: PolygonFilterState) => void;
  onClearFilters: () => void;
};

const PolygonReviewToolbar: FC<PolygonReviewToolbarProps> = ({
  projectUuid,
  matchingPolygonCount,
  projectPolygonCount,
  polygonFilters,
  activeFilterLabels,
  searchResetKey,
  onSearchChange,
  onApplyFilters,
  onClearFilters
}) => {
  const t = useT();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const openFilterDrawer = useCallback(() => setIsFilterDrawerOpen(true), []);

  return (
    <>
      <ToolbarTable
        className="!bg-transparent !px-0"
        search={{
          placeholder: t("Search polygons"),
          options: [],
          displayResults: "none",
          resetKey: searchResetKey,
          onQueryChange: onSearchChange,
          count: matchingPolygonCount,
          label:
            matchingPolygonCount == null
              ? undefined
              : projectPolygonCount == null
              ? t("polygons")
              : t("of {total} polygons", { total: projectPolygonCount.toLocaleString("en-US") })
        }}
        selectedFilters={activeFilterLabels}
        lockedMessage={projectUuid != null ? undefined : t("Pick a project in ‘View’ to search and filter polygons")}
        showClearFilters={activeFilterLabels.length > 0}
        onClearFilters={onClearFilters}
        onClickFilterButton={openFilterDrawer}
      />
      <PolygonFilterDrawer
        open={isFilterDrawerOpen}
        filters={polygonFilters}
        siteFilterProjectUuid={projectUuid}
        onApplyFilters={onApplyFilters}
        onClearFilters={onClearFilters}
        onOpenChange={setIsFilterDrawerOpen}
      />
    </>
  );
};

export default PolygonReviewToolbar;
