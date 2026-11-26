import { useT } from "@transifex/react";
import { FC, useCallback, useMemo, useState } from "react";

import { PolygonEntityScopeProps } from "@/connections/SitePolygons";
import { SelectedFilter } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
import ToolbarTable from "@/redesignComponents/navigation/Toolbar/ToolbarTable/ToolbarTable";

import { CalcAreaBounds, PolygonFilterState } from "../../site/[uuid]/components/polygonFilter.constants";
import PolygonFilterDrawer from "../../site/[uuid]/components/PolygonFilterDrawer";

type PolygonReviewToolbarProps = {
  projectUuid?: string;
  matchingPolygonCount?: number;
  projectPolygonCount?: number;
  calcAreaBounds?: CalcAreaBounds;
  polygonFilters: PolygonFilterState;
  activeFilterLabels: SelectedFilter[];
  search?: string;
  searchResetKey: number;
  isLocked: boolean;
  onSearchChange: (search: string) => void;
  onApplyFilters: (filters: PolygonFilterState) => void;
  onClearFilters: () => void;
};

const PolygonReviewToolbar: FC<PolygonReviewToolbarProps> = ({
  projectUuid,
  matchingPolygonCount,
  projectPolygonCount,
  calcAreaBounds,
  polygonFilters,
  activeFilterLabels,
  search,
  searchResetKey,
  isLocked,
  onSearchChange,
  onApplyFilters,
  onClearFilters
}) => {
  const t = useT();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const openFilterDrawer = useCallback(() => setIsFilterDrawerOpen(true), []);
  const facetCountScope = useMemo<PolygonEntityScopeProps>(
    () => ({ entityName: "projects", entityUuid: projectUuid }),
    [projectUuid]
  );

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
        lockedMessage={
          projectUuid == null
            ? t("Select a project to search and filter polygons")
            : isLocked
            ? t("Search and filters are unavailable while polygons are processing")
            : undefined
        }
        showClearFilters={activeFilterLabels.length > 0}
        onClearFilters={onClearFilters}
        onClickFilterButton={openFilterDrawer}
      />
      <PolygonFilterDrawer
        open={isFilterDrawerOpen}
        filters={polygonFilters}
        isAdminReview
        siteFilterProjectUuid={projectUuid}
        calcAreaBounds={calcAreaBounds}
        facetCountScope={facetCountScope}
        search={search}
        onApplyFilters={onApplyFilters}
        onClearFilters={onClearFilters}
        onOpenChange={setIsFilterDrawerOpen}
      />
    </>
  );
};

export default PolygonReviewToolbar;
