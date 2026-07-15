import { useT } from "@transifex/react";
import Link from "next/link";
import { FC } from "react";

import { useBoundingBox } from "@/connections/BoundingBox";

import ExplorerFilterPanel from "./components/ExplorerFilterPanel";
import ExplorerMap from "./components/ExplorerMap";
import ExplorerStatusBar from "./components/ExplorerStatusBar";
import { usePolygonExplorerData } from "./hooks/usePolygonExplorerData";
import { usePolygonExplorerFilters } from "./hooks/usePolygonExplorerFilters";

const PolygonExplorerPage: FC = () => {
  const t = useT();
  const { search, setSearch, filters, setFilters, apiFilter, clearFilters, activeFilterCount } =
    usePolygonExplorerFilters();
  const { polygons, loadedCount, total, isLoading, error } = usePolygonExplorerData(apiFilter);

  // Zoom the camera to the landscape extent when a landscape scope is selected.
  const landscapeBbox = useBoundingBox(filters.landscape !== "" ? { landscapes: [filters.landscape] } : {});

  return (
    <div className="flex h-screen flex-col bg-neutral-50">
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-semibold text-neutral-900">{t("Polygon Explorer")}</h1>
          <span className="bg-amber-100 text-amber-800 rounded-full px-2 py-0.5 text-xs font-medium">
            {t("Temporary — internal")}
          </span>
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
            {t("Read-only")}
          </span>
        </div>
        <Link href="/admin" className="text-blue-600 text-sm font-medium hover:underline">
          {t("Back to admin")}
        </Link>
      </header>

      <ExplorerStatusBar
        polygons={polygons}
        loadedCount={loadedCount}
        total={total}
        isLoading={isLoading}
        error={error}
      />

      <div className="flex min-h-0 flex-1">
        <ExplorerFilterPanel
          search={search}
          onSearchChange={setSearch}
          filters={filters}
          setFilters={setFilters}
          onClear={clearFilters}
          activeFilterCount={activeFilterCount}
        />
        <main className="min-w-0 flex-1">
          <ExplorerMap polygons={polygons} bbox={landscapeBbox} isLoading={isLoading} />
        </main>
      </div>
    </div>
  );
};

export default PolygonExplorerPage;
