import mapboxgl, { FillLayer, LineLayer } from "mapbox-gl";

type LayerStyle = Pick<mapboxgl.Style, "metadata"> & (FillLayer | LineLayer);

export type LayerWithStyle = LayerStyle;

export interface LayerType {
  name: string;
  styles: LayerWithStyle[];
  geoserverLayerName: string;
}

export type ControlType = Control | IControl;

export type TooltipType = "edit" | "goTo" | "view";
