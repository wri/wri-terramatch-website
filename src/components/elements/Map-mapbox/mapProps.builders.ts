import { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

import { BBox } from "./GeoJSON";
import { AdminMapExtras, BaseMapProps, DashboardMapExtras, ReadOnlyMapExtras } from "./Map";
import type {
  DashboardGetProjectsData,
  DashboardPopupContext,
  EntityData,
  MapFunctions,
  PolygonCentroid,
  TooltipType
} from "./Map.d";
import { MapStyle } from "./MapControls/types";

type ReadOnlyMapBuilderOpts = {
  mapFunctions: MapFunctions;
  bbox?: BBox;
  polygonsData?: Record<string, string[]>;
  className?: string;
} & ReadOnlyMapExtras;

export function buildReadOnlyMapProps(opts: ReadOnlyMapBuilderOpts): BaseMapProps & ReadOnlyMapExtras {
  const { mapFunctions, bbox, polygonsData, className, location } = opts;
  return {
    mapFunctions,
    bbox,
    polygonsData,
    className,
    location,
    hasControls: false,
    showPopups: false,
    showLegend: false
  };
}

type DashboardMapBuilderOpts = {
  mode: "dashboard" | "modal";
  mapFunctions: MapFunctions;
  centroids?: DashboardGetProjectsData[];
  polygonsData?: Record<string, string[]>;
  polygonsCentroids?: PolygonCentroid[];
  bbox?: BBox;
  center?: [number, number];
  zoom?: number;
  mapStyle?: MapStyle;
  onStyleChange?: (style: MapStyle) => void;
  selectedLandscapes?: string[];
  projectUUID?: string;
  hasAccess?: boolean;
  setLoader?: (value: boolean) => void;
  dashboardContext?: DashboardPopupContext;
  className?: string;
  initialTileVersion?: string;
  initialPolygonFingerprint?: string;
};

export function buildDashboardMapProps(opts: DashboardMapBuilderOpts): BaseMapProps & DashboardMapExtras {
  const {
    mode,
    mapFunctions,
    centroids,
    polygonsData,
    polygonsCentroids,
    bbox,
    center,
    zoom,
    mapStyle,
    onStyleChange,
    selectedLandscapes,
    projectUUID,
    hasAccess,
    setLoader,
    dashboardContext,
    className,
    initialTileVersion,
    initialPolygonFingerprint
  } = opts;

  return {
    mapFunctions,
    centroids,
    polygonsData,
    polygonsCentroids,
    bbox,
    center,
    zoom,
    mapStyle,
    onStyleChange,
    selectedLandscapes,
    projectUUID,
    hasAccess,
    setLoader,
    dashboardContext,
    className,
    dashboardMode: mode,
    showLegend: false,
    showPopups: true,
    initialTileVersion,
    initialPolygonFingerprint
  };
}

type AdminEntityMapBuilderOpts = {
  mapFunctions: MapFunctions;
  polygonsData?: Record<string, string[]>;
  bbox?: BBox;
  mediaFiles?: MediaDto[];
  entityData?: EntityData;
  record?: AdminMapExtras["record"];
  sitePolygonData?: SitePolygonLightDto[];
  tooltipType?: TooltipType;
  showPopups?: boolean;
  showLegend?: boolean;
  className?: string;
};

export function buildAdminEntityMapProps(opts: AdminEntityMapBuilderOpts): BaseMapProps & AdminMapExtras {
  const {
    mapFunctions,
    polygonsData,
    bbox,
    mediaFiles,
    entityData,
    record,
    sitePolygonData,
    tooltipType = "edit",
    showPopups = true,
    showLegend = true,
    className
  } = opts;

  return {
    mapFunctions,
    polygonsData,
    bbox,
    mediaFiles,
    entityData,
    record,
    sitePolygonData,
    tooltipType,
    showPopups,
    showLegend,
    className
  };
}
