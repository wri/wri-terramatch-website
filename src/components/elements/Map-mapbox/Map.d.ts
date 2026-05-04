import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { GeoJSONFeature, Map as MapboxMap, Popup } from "mapbox-gl";
import { MutableRefObject, RefObject } from "react";

import { CountriesProps, DashboardFilters } from "@/context/dashboard.provider";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

import { MapStyle } from "./MapControls/types";

type LayerStyle = { [key: string]: unknown; metadata?: unknown };

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
  type?: string;
  centroid?: { lat?: number; long?: number };
};

export type PolygonCentroid = {
  uuid: string;
  lat: number;
  long: number;
};

/** Shape used when entityData carries project/polygon routing context. */
export type EntityData = {
  entityName?: string;
  entityUUID?: string;
  [key: string]: unknown;
};

export type PolygonFromMapState = {
  uuid: string;
  isOpen: boolean;
  entityName?: string;
  projectPitchUuid?: string;
};

export type SetPolygonFromMap = React.Dispatch<React.SetStateAction<PolygonFromMapState>>;

export type EditPolygonState = {
  isOpen: boolean;
  uuid: string;
  primaryUuid?: string;
};

/** Groups the three dashboard-specific props that always travel together. */
export type DashboardPopupContext = {
  setFilters: DashboardFilters;
  dashboardCountries?: CountriesProps[];
  dashboardMode?: string;
};

/** Props received by every popup component (AdminPopup, DashboardPopup). */
export type PopupComponentProps = {
  feature: GeoJSONFeature;
  popup: Popup;
  layerName?: string;
  setPolygonFromMap?: SetPolygonFromMap;
  sitePolygonData?: SitePolygonLightDto[];
  type: TooltipType;
  editPolygon: EditPolygonState;
  setEditPolygon: (value: EditPolygonState) => void;
  // Dashboard-specific (undefined in admin mode)
  setFilters?: DashboardFilters;
  dashboardCountries?: CountriesProps[];
  dashboardMode?: string;
  /** When true, map uses the champions (non-admin) layout and controls. */
  championsMap?: boolean;
};

/** Data shape passed to setMobilePopupData; mirrors PopupComponentProps minus the live Popup instance. */
export type MobilePopupData = Omit<PopupComponentProps, "popup"> & {
  setLoader?: (value: boolean) => void;
};

export interface MapFunctions {
  map: MutableRefObject<MapboxMap | null>;
  mapContainer: RefObject<HTMLDivElement>;
  draw: MutableRefObject<MapboxDraw | null>;
  onCancel: (parsedPolygonData: Record<string, string[]> | undefined) => void;
  initMap: (useDashboardStyle?: boolean, initialStyle?: MapStyle) => void;
  /** @deprecated */
  setStyleLoaded: (value: boolean) => void;
  handleTrashDelete: () => void;
}
