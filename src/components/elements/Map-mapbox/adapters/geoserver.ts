import { geoserverUrl, geoserverWorkspace } from "@/constants/environment";
import { LAYERS_NAMES } from "@/constants/layers";

export const ANR_PLOT_SOURCE_ID = "anr_plot_geometry-source";
export const ANR_PLOT_FILL_LAYER_ID = "anr_plot_geometry-fill";
export const ANR_PLOT_LINE_LAYER_ID = "anr_plot_geometry-line";
export const ANR_PLOT_LAYER_PREFIX = "anr_plot_geometry";

const POLYGON_EXPLORER_PATH = "/admin/polygon-explorer";
const POLYGON_EXPLORER_WORKSPACE = "wri_prod";
const POLYGON_EXPLORER_LAYER = "polygon_geometry_explorer";

export type GeoserverLayerOptions = {
  workspaceOverride?: string;
  layerNameOverride?: string;
};

export const resolveGeoserverLayer = (
  layerName: string,
  dashboardMode?: string | undefined,
  options?: GeoserverLayerOptions
): { workspace: string; layerName: string } => {
  const isPolygonGeometryLayer = layerName === LAYERS_NAMES.POLYGON_GEOMETRY;
  const isExplorerRoute = typeof window !== "undefined" && window.location.pathname.includes(POLYGON_EXPLORER_PATH);

  if (isExplorerRoute && isPolygonGeometryLayer) {
    return {
      workspace: options?.workspaceOverride ?? POLYGON_EXPLORER_WORKSPACE,
      layerName: options?.layerNameOverride ?? POLYGON_EXPLORER_LAYER
    };
  }

  if (options?.workspaceOverride != null && options?.layerNameOverride != null) {
    return {
      workspace: options.workspaceOverride,
      layerName: options.layerNameOverride
    };
  }

  const workspace = dashboardMode != null ? `${geoserverWorkspace}_db` : geoserverWorkspace;
  return { workspace, layerName };
};

export const getGeoserverURL = (
  layerName: string,
  dashboardMode?: string | undefined,
  cacheKey: string = "0",
  options?: GeoserverLayerOptions
): string => {
  const { workspace, layerName: resolvedLayerName } = resolveGeoserverLayer(layerName, dashboardMode, options);
  return (
    `${geoserverUrl}/geoserver/gwc/service/wmts?REQUEST=GetTile&SERVICE=WMTS` +
    `&VERSION=1.0.0&LAYER=${workspace}:${resolvedLayerName}&STYLE=&TILEMATRIX=EPSG:900913:{z}` +
    `&TILEMATRIXSET=EPSG:900913&FORMAT=application/vnd.mapbox-vector-tile` +
    `&TILECOL={x}&TILEROW={y}&RND=${cacheKey}`
  );
};
