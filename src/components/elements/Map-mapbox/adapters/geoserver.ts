import { geoserverUrl, geoserverWorkspace } from "@/constants/environment";

/** Layer ID constants shared across overlay and polygon layer modules. */
export const ANR_PLOT_SOURCE_ID = "anr_plot_geometry-source";
export const ANR_PLOT_FILL_LAYER_ID = "anr_plot_geometry-fill";
export const ANR_PLOT_LINE_LAYER_ID = "anr_plot_geometry-line";
export const ANR_PLOT_LAYER_PREFIX = "anr_plot_geometry";

/**
 * Builds a GeoServer WMTS tile URL for a given layer name.
 * Uses the _db workspace suffix in dashboard mode.
 *
 * `cacheKey` is an opaque token used as the RND parameter to bust the browser's
 * HTTP cache. It should be a stable string that only changes when underlying
 * polygon geometry is mutated (upload, edit, delete) — NOT on every render.
 * Callers are responsible for generating and incrementing this value.
 */
export const getGeoserverURL = (
  layerName: string,
  isDashboard?: string | undefined,
  cacheKey: string = "0"
): string => {
  const workspace = isDashboard != null ? `${geoserverWorkspace}_db` : geoserverWorkspace;
  return (
    `${geoserverUrl}/geoserver/gwc/service/wmts?REQUEST=GetTile&SERVICE=WMTS` +
    `&VERSION=1.0.0&LAYER=${workspace}:${layerName}&STYLE=&TILEMATRIX=EPSG:900913:{z}` +
    `&TILEMATRIXSET=EPSG:900913&FORMAT=application/vnd.mapbox-vector-tile` +
    `&TILECOL={x}&TILEROW={y}&RND=${cacheKey}`
  );
};
