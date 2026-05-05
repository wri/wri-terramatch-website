import type { Map as MapboxMap } from "mapbox-gl";
import type { Dispatch, RefObject, SetStateAction } from "react";

import type { BBox } from "../GeoJSON";
import type { PolygonFromMapState } from "../Map.d";
import type { MapStyle } from "../MapControls/types";

export type DrawControlsProps = {
  handleEditPolygon: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  isEditing: boolean;
  handleTrashDelete: () => void;
};

export type StyleControlsProps = {
  map: MapboxMap | null;
  currentStyle: MapStyle;
  handleStyleChange: (style: MapStyle) => void;
  styleReady: boolean;
};

export type AdminControlsProps = {
  record?: { uuid?: string; organisation?: { name?: string } };
  siteData?: boolean;
  validationType?: string;
  status?: boolean;
  isFullscreen: boolean;
  setIsLoadingDelayedJob?: (value: boolean) => void;
  isLoadingDelayedJob?: boolean;
  setAlertTitle?: (value: string) => void;
  disabledPolygonPanel?: boolean;
  selectedPolygonsInCheckbox: string[];
};

export type FormControlsProps = {
  formMap?: boolean;
  editable?: boolean;
  polygonFromMap?: PolygonFromMapState;
  viewImages: boolean;
  setViewImages: Dispatch<SetStateAction<boolean>>;
};

export type CameraResetProps = {
  map: MapboxMap | null;
  center?: [number, number];
  zoom?: number;
  bbox?: BBox;
  hasControls?: boolean;
};

export type GalleryProps = {
  dashboardMode?: "dashboard" | "modal";
  showViewGallery?: boolean;
  imageGalleryRef?: RefObject<HTMLDivElement>;
};

export type DownloadProps = {
  showDownloadPolygons?: boolean;
  isDownloadingPolygons: boolean;
  downloadGeoJsonPolygon: () => void;
};

export type FullscreenProps = {
  dashboardMode?: "dashboard" | "modal";
  isFullscreen: boolean;
  toggleFullscreen: () => void;
};

export interface MapControlsOverlayProps {
  hasControls: boolean;
  draw: DrawControlsProps;
  style: StyleControlsProps;
  admin: AdminControlsProps;
  form: FormControlsProps;
  camera: CameraResetProps;
  gallery: GalleryProps;
  download: DownloadProps;
  fullscreen: FullscreenProps;
}
