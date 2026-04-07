import MapboxDraw from "@mapbox/mapbox-gl-draw";
import mapboxgl, { FillLayer, LineLayer } from "mapbox-gl";
import { MutableRefObject, RefObject } from "react";

import { MapStyle } from "./MapControls/types";

type LayerStyle = Pick<mapboxgl.Style, "metadata"> & (FillLayer | LineLayer | CircleLayer);

export type LayerWithStyle = LayerStyle;

export interface LayerType {
  name: string;
  styles: LayerWithStyle[];
  geoserverLayerName: string;
  hover?: boolean;
}

export type ControlType = Control | IControl;

export type TooltipType = "edit" | "goTo" | "view";

export type DashboardGetProjectsData = {
  uuid?: string;
  name?: string;
  lat?: number;
  long?: number;
};

/**
 * The object returned by useMap() and passed as the `mapFunctions` prop to Map.tsx.
 * Typed here so all 9 consumer files get IDE autocomplete and compile-time safety.
 */
export interface MapFunctions {
  map: MutableRefObject<mapboxgl.Map | null>;
  mapContainer: RefObject<HTMLDivElement>;
  draw: MutableRefObject<MapboxDraw | null>;
  styleLoaded: boolean;
  onCancel: (parsedPolygonData: Record<string, string[]> | undefined) => void;
  initMap: (isDashboard?: boolean, initialStyle?: MapStyle) => void;
  setStyleLoaded: (value: boolean) => void;
  handleTrashDelete: () => void;
}
