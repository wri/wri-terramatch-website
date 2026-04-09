import { geoserverUrl, geoserverWorkspace } from "@/constants/environment";

export const ANR_PLOT_SOURCE_ID = "anr_plot_geometry-source";
export const ANR_PLOT_FILL_LAYER_ID = "anr_plot_geometry-fill";
export const ANR_PLOT_LINE_LAYER_ID = "anr_plot_geometry-line";
export const ANR_PLOT_LAYER_PREFIX = "anr_plot_geometry";

export const getGeoserverURL = (
  layerName: string,
  dashboardMode?: string | undefined,
  cacheKey: string = "0"
): string => {
  const workspace = dashboardMode != null ? `${geoserverWorkspace}_db` : geoserverWorkspace;
  return (
    `${geoserverUrl}/geoserver/gwc/service/wmts?REQUEST=GetTile&SERVICE=WMTS` +
    `&VERSION=1.0.0&LAYER=${workspace}:${layerName}&STYLE=&TILEMATRIX=EPSG:900913:{z}` +
    `&TILEMATRIXSET=EPSG:900913&FORMAT=application/vnd.mapbox-vector-tile` +
    `&TILECOL={x}&TILEROW={y}&RND=${cacheKey}`
  );
};
