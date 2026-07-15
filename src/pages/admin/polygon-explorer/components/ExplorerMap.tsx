import { useT } from "@transifex/react";
import { FC } from "react";

import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import { useBaseMap } from "@/components/elements/Map-mapbox/hooks/useBaseMap";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

import { GEOMETRY_MIN_ZOOM, MAX_VISIBLE_GEOMETRIES } from "../constants";
import {
  useExplorerCentroidLayers,
  useExplorerMapInstance,
  useExplorerViewportPolygons
} from "../hooks/useExplorerMap";

type ExplorerMapProps = {
  polygons: SitePolygonLightDto[];
  bbox?: BBox;
  isLoading: boolean;
};

const ExplorerMap: FC<ExplorerMapProps> = ({ polygons, bbox, isLoading }) => {
  const t = useT();
  const mapFunctions = useBaseMap();
  const mapInstance = useExplorerMapInstance(mapFunctions.map);
  const viewport = useExplorerViewportPolygons(mapInstance, polygons);
  useExplorerCentroidLayers(mapInstance, polygons);

  const hasPolygons = polygons.length > 0;
  const showZoomHint = hasPolygons && viewport.belowMinZoom;
  const showTruncatedHint = !viewport.belowMinZoom && viewport.truncated;
  const showEmptyState = !isLoading && !hasPolygons;

  return (
    <div className="relative h-full w-full">
      <MapContainer
        championsMap
        mapFunctions={mapFunctions}
        polygonsData={viewport.polygonsData}
        sitePolygonData={polygons}
        bbox={bbox}
        showPopups
        showLegend
        showViewGallery={false}
        tooltipType="view"
        overviewPolygonPopup
        className="h-full w-full"
      />

      {showZoomHint ? (
        <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-white/95 px-4 py-2 text-xs font-medium text-neutral-700 shadow">
          {t("Showing clustered centroids — zoom in (level {min}+) to view polygon shapes", {
            min: GEOMETRY_MIN_ZOOM
          })}
        </div>
      ) : null}

      {showTruncatedHint ? (
        <div className="text-amber-700 absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-white/95 px-4 py-2 text-xs font-medium shadow">
          {t("Showing {shown} of {total} polygons in view — zoom in further to see the rest", {
            shown: MAX_VISIBLE_GEOMETRIES.toLocaleString(),
            total: viewport.totalInViewport.toLocaleString()
          })}
        </div>
      ) : null}

      {showEmptyState ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
          <div className="rounded-lg bg-white px-6 py-4 text-center shadow">
            <p className="text-sm font-semibold text-neutral-800">{t("No polygons found")}</p>
            <p className="mt-1 text-xs text-neutral-600">{t("Try adjusting the filters or search terms.")}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ExplorerMap;
