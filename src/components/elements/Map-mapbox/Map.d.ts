import MapboxDraw from "@mapbox/mapbox-gl-draw";
import mapboxgl from "mapbox-gl";
import { MutableRefObject, RefObject } from "react";

import { MapStyle } from "./MapControls/types";

type LayerStyle = { [key: string]: unknown; metadata?: mapboxgl.Style["metadata"] };

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
export interface MapFunctions {
  map: MutableRefObject<mapboxgl.Map | null>;
  mapContainer: RefObject<HTMLDivElement>;
  draw: MutableRefObject<MapboxDraw | null>;
  styleLoaded: boolean;
  onCancel: (parsedPolygonData: Record<string, string[]> | undefined) => void;
  initMap: (useDashboardStyle?: boolean, initialStyle?: MapStyle) => void;
  setStyleLoaded: (value: boolean) => void;
  handleTrashDelete: () => void;
}
