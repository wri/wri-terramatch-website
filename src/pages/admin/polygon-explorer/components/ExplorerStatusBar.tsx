import { useT } from "@transifex/react";
import { FC, useMemo } from "react";

import { countStatusesV3 } from "@/components/elements/Map-mapbox/layers/polygonLayers";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

import { POLYGON_STATUS_COLORS } from "../constants";

type ExplorerStatusBarProps = {
  polygons: SitePolygonLightDto[];
  loadedCount: number;
  total: number;
  isLoading: boolean;
  error: Error | null;
};

const ExplorerStatusBar: FC<ExplorerStatusBarProps> = ({ polygons, loadedCount, total, isLoading, error }) => {
  const t = useT();
  const statusCounts = useMemo(() => countStatusesV3(polygons), [polygons]);
  const percent = total > 0 ? Math.min(100, Math.round((loadedCount / total) * 100)) : 0;

  return (
    <div className="border-b border-neutral-200 bg-white px-4 py-2">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <p className="text-sm text-neutral-800">
          {total > 0 ? (
            <>
              <span className="font-semibold">{loadedCount.toLocaleString()}</span>
              {" / "}
              <span className="font-semibold">{total.toLocaleString()}</span> {t("polygons loaded")}
              {isLoading ? ` (${percent}%)` : null}
            </>
          ) : isLoading ? (
            t("Loading polygons…")
          ) : (
            t("No polygons loaded")
          )}
        </p>

        {statusCounts.map(({ status, status_key, count }) => (
          <span key={status_key} className="flex items-center gap-1.5 text-xs text-neutral-600">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: POLYGON_STATUS_COLORS[status_key] ?? "#9CA3AF" }}
            />
            {status}: <span className="font-medium">{count.toLocaleString()}</span>
          </span>
        ))}

        {isLoading ? (
          <span className="text-blue-600 flex items-center gap-2 text-xs">
            <span className="border-blue-600 h-3 w-3 animate-spin rounded-full border-2 border-t-transparent" />
            {t("Loading in background…")}
          </span>
        ) : null}
      </div>

      {isLoading && total > 0 ? (
        <div className="mt-1.5 h-1 w-full overflow-hidden rounded bg-neutral-200">
          <div className="bg-blue-600 h-full rounded transition-all duration-300" style={{ width: `${percent}%` }} />
        </div>
      ) : null}

      {error != null ? (
        <p className="text-red-600 mt-1 text-xs">
          {t("Loading stopped after {count} polygons: {message}", {
            count: loadedCount.toLocaleString(),
            message: error.message ?? t("unknown error")
          })}
        </p>
      ) : null}
    </div>
  );
};

export default ExplorerStatusBar;
