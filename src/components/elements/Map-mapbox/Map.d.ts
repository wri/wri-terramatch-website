import mapboxgl from "mapbox-gl";

export type LayerWithStyle = mapboxgl.Style & mapboxgl.anyLayer;

export interface LayerType {
  name: string;
  styles: LayerWithStyle[];
}

export type ControlType = Control | IControl;

export type TooltipType = "edit" | "goTo" | "view";
