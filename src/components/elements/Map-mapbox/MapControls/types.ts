/* eslint-disable no-unused-vars */

export enum MapStyle {
  Street = "mapbox://styles/terramatch/clve3yxzq01w101pefkkg3rci",
  Satellite = "mapbox://styles/terramatch/clv3bkxut01y301pk317z5afu",
  GoogleSatellite = "google-satellite"
}

export interface BasemapConfig {
  style: MapStyle;
  requiresRasterLayer: boolean;
  rasterUrl?: string;
  projection?: "mercator" | "globe";
}

export const BASEMAP_CONFIGS: Record<MapStyle, BasemapConfig> = {
  [MapStyle.Street]: {
    style: MapStyle.Street,
    requiresRasterLayer: false,
    projection: "mercator"
  },
  [MapStyle.Satellite]: {
    style: MapStyle.Satellite,
    requiresRasterLayer: false,
    projection: "globe"
  },
  [MapStyle.GoogleSatellite]: {
    style: MapStyle.Street,
    requiresRasterLayer: true,
    rasterUrl: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    projection: "mercator"
  }
};
