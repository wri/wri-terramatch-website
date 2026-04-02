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
 * NOTE: RND=Math.random() is a cache-bust workaround; switch to deterministic
 * invalidation (e.g. a version token from the upload event) when possible.
 */
export const getGeoserverURL = (layerName: string, isDashboard?: string | undefined): string => {
  const workspace = isDashboard != null ? `${geoserverWorkspace}_db` : geoserverWorkspace;
  return (
    `${geoserverUrl}/geoserver/gwc/service/wmts?REQUEST=GetTile&SERVICE=WMTS` +
    `&VERSION=1.0.0&LAYER=${workspace}:${layerName}&STYLE=&TILEMATRIX=EPSG:900913:{z}` +
    `&TILEMATRIXSET=EPSG:900913&FORMAT=application/vnd.mapbox-vector-tile` +
    `&TILECOL={x}&TILEROW={y}&RND=${Math.random()}`
  );
};
