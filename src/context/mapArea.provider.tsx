import type { Map as MapboxMap } from "mapbox-gl";
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";

import { closeAllPopups } from "@/components/elements/Map-mapbox/interactions/popupCoordinator";
import { removePopups } from "@/components/elements/Map-mapbox/interactions/popups";
import { EditPolygonState } from "@/components/elements/Map-mapbox/Map.d";
import { MediaDto, SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { Entity } from "@/types/common";

import {
  type PolygonSubmitConfirmationRequest,
  registerMapAreaPopupActions,
  unregisterMapAreaPopupActions
} from "./mapArea.utils";

export type MapAreaSiteData = Entity | SiteFullDto;

export function isMapAreaSiteFullDto(siteData: MapAreaSiteData | undefined): siteData is SiteFullDto {
  return siteData != null && "lightResource" in siteData;
}

export type SelectedPolygonVersionState = SitePolygonLightDto;

export type PolygonGeometryEditState = {
  polygonUuid: string;
  originalGeometry?: GeoJSON.Geometry | null;
  currentGeometry?: GeoJSON.Geometry | null;
  isDirty: boolean;
};

export type PolygonSubmitConfirmationState = PolygonSubmitConfirmationRequest | null;

type MapAreaType = {
  isUserDrawingEnabled: boolean;
  setIsUserDrawingEnabled: (arg0: boolean) => void;
  editPolygon: EditPolygonState;
  setEditPolygon: (value: EditPolygonState) => void;
  siteData: MapAreaSiteData | undefined;
  setSiteData: (value: MapAreaSiteData | undefined) => void;
  shouldRefetchPolygonData: boolean;
  setShouldRefetchPolygonData: (value: boolean) => void;
  shouldRefetchMediaData: boolean;
  setShouldRefetchMediaData: (value: boolean) => void;
  shouldRefetchValidation: boolean;
  setShouldRefetchValidation: (value: boolean) => void;
  shouldRefetchPolygonVersions: boolean;
  setShouldRefetchPolygonVersions: (value: boolean) => void;
  hasOverlaps: boolean;
  setHasOverlaps: (value: boolean) => void;
  selectedPolygonsInCheckbox: string[];
  setSelectedPolygonsInCheckbox: (value: string[]) => void;
  setSelectedPolyVersion: (value: SelectedPolygonVersionState | undefined) => void;
  selectedPolyVersion: SelectedPolygonVersionState | undefined;
  openModalConfirmation: boolean;
  setOpenModalConfirmation: (value: boolean) => void;
  previewVersion: boolean;
  setPreviewVersion: (value: boolean) => void;
  statusSelectedPolygon: string;
  setStatusSelectedPolygon: (value: string) => void;
  polygonCriteriaMap: Record<string, unknown>;
  setPolygonCriteriaMap: (value: Record<string, unknown>) => void;
  polygonData: SitePolygonLightDto[];
  setPolygonData: (value: SitePolygonLightDto[]) => void;
  polygonGeometryEdit: PolygonGeometryEditState | undefined;
  setPolygonGeometryEdit: (value: PolygonGeometryEditState | undefined) => void;
  draftPolygonGeometry: GeoJSON.Geometry | undefined;
  setDraftPolygonGeometry: (value: GeoJSON.Geometry | undefined) => void;
  polygonMapTileNonce: number;
  invalidatePolygonMapTiles: () => void;
  validFilter: string;
  setValidFilter: (value: string) => void;
  registerMapboxMap: (map: MapboxMap | null) => void;
  closeMapPopups: () => void;
  polygonSubmitConfirmation: PolygonSubmitConfirmationState;
  setPolygonSubmitConfirmation: (value: PolygonSubmitConfirmationState) => void;
  polygonApproveConfirmation: string | null;
  setPolygonApproveConfirmation: (value: string | null) => void;
  polygonRequestInformationConfirmation: string | null;
  setPolygonRequestInformationConfirmation: (value: string | null) => void;
  editPhotoDetailsMedia: MediaDto | null;
  setEditPhotoDetailsMedia: (value: MediaDto | null) => void;
  showPhotosOnMap: boolean;
  setShowPhotosOnMap: (value: boolean) => void;
  geotaggedPhotosMapVisible: boolean;
  setGeotaggedPhotosMapVisible: (value: boolean) => void;
  mediaFiles: MediaDto[];
  setMediaFiles: (value: MediaDto[]) => void;
  resetSiteMapInteractionState: () => void;
};

const defaultValue: MapAreaType = {
  isUserDrawingEnabled: false,
  setIsUserDrawingEnabled: () => {},
  editPolygon: { isOpen: false, uuid: "" },
  setEditPolygon: () => {},
  siteData: undefined,
  setSiteData: () => {},
  shouldRefetchPolygonData: false,
  setShouldRefetchPolygonData: () => {},
  shouldRefetchMediaData: false,
  setShouldRefetchMediaData: () => {},
  shouldRefetchValidation: false,
  setShouldRefetchValidation: () => {},
  shouldRefetchPolygonVersions: false,
  setShouldRefetchPolygonVersions: () => {},
  hasOverlaps: false,
  setHasOverlaps: () => {},
  selectedPolygonsInCheckbox: [],
  setSelectedPolygonsInCheckbox: () => {},
  setSelectedPolyVersion: () => {},
  selectedPolyVersion: undefined,
  openModalConfirmation: false,
  setOpenModalConfirmation: () => {},
  previewVersion: false,
  setPreviewVersion: () => {},
  statusSelectedPolygon: "",
  setStatusSelectedPolygon: () => {},
  polygonCriteriaMap: {},
  setPolygonCriteriaMap: () => {},
  polygonData: [],
  setPolygonData: () => {},
  polygonGeometryEdit: undefined,
  setPolygonGeometryEdit: () => {},
  draftPolygonGeometry: undefined,
  setDraftPolygonGeometry: () => {},
  polygonMapTileNonce: 0,
  invalidatePolygonMapTiles: () => {},
  validFilter: "all",
  setValidFilter: () => {},
  registerMapboxMap: () => {},
  closeMapPopups: () => {},
  polygonSubmitConfirmation: null,
  setPolygonSubmitConfirmation: () => {},
  polygonApproveConfirmation: null,
  setPolygonApproveConfirmation: () => {},
  polygonRequestInformationConfirmation: null,
  setPolygonRequestInformationConfirmation: () => {},
  editPhotoDetailsMedia: null,
  setEditPhotoDetailsMedia: () => {},
  showPhotosOnMap: false,
  setShowPhotosOnMap: () => {},
  geotaggedPhotosMapVisible: false,
  setGeotaggedPhotosMapVisible: () => {},
  mediaFiles: [],
  setMediaFiles: () => {},
  resetSiteMapInteractionState: () => {}
};

const MapAreaContext = createContext<MapAreaType>(defaultValue);

export const MapAreaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isUserDrawingEnabled, setIsUserDrawingEnabled] = useState<boolean>(false);
  const [siteData, setSiteData] = useState<MapAreaSiteData | undefined>(undefined);
  const [shouldRefetchPolygonData, setShouldRefetchPolygonData] = useState<boolean>(false);
  const [shouldRefetchMediaData, setShouldRefetchMediaData] = useState<boolean>(false);
  const [shouldRefetchValidation, setShouldRefetchValidation] = useState<boolean>(false);
  const [shouldRefetchPolygonVersions, setShouldRefetchPolygonVersions] = useState<boolean>(false);
  const [hasOverlaps, setHasOverlaps] = useState<boolean>(false);
  const [selectedPolyVersion, setSelectedPolyVersion] = useState<SelectedPolygonVersionState | undefined>();
  const [openModalConfirmation, setOpenModalConfirmation] = useState<boolean>(false);
  const [previewVersion, setPreviewVersion] = useState<boolean>(false);
  const [statusSelectedPolygon, setStatusSelectedPolygon] = useState<string>("");
  const [selectedPolygonsInCheckbox, setSelectedPolygonsInCheckbox] = useState<string[]>([]);
  const [polygonCriteriaMap, setPolygonCriteriaMap] = useState<Record<string, unknown>>({});
  const [polygonData, setPolygonData] = useState<SitePolygonLightDto[]>([]);
  const [polygonGeometryEdit, setPolygonGeometryEdit] = useState<PolygonGeometryEditState | undefined>();
  const [draftPolygonGeometry, setDraftPolygonGeometry] = useState<GeoJSON.Geometry | undefined>();
  const [polygonMapTileNonce, setPolygonMapTileNonce] = useState(0);
  const [validFilter, setValidFilter] = useState<string>("all");
  const [editPolygon, setEditPolygonInternal] = useState<EditPolygonState>({
    isOpen: false,
    uuid: ""
  });
  const [polygonSubmitConfirmation, setPolygonSubmitConfirmation] = useState<PolygonSubmitConfirmationState>(null);
  const [polygonApproveConfirmation, setPolygonApproveConfirmation] = useState<string | null>(null);
  const [polygonRequestInformationConfirmation, setPolygonRequestInformationConfirmation] = useState<string | null>(
    null
  );
  const [editPhotoDetailsMedia, setEditPhotoDetailsMedia] = useState<MediaDto | null>(null);
  const [showPhotosOnMap, setShowPhotosOnMap] = useState(false);
  const [geotaggedPhotosMapVisible, setGeotaggedPhotosMapVisible] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaDto[]>([]);

  const setEditPolygon = useCallback((value: EditPolygonState) => {
    setEditPolygonInternal(value);
  }, []);

  const invalidatePolygonMapTiles = useCallback(() => {
    setPolygonMapTileNonce(value => value + 1);
  }, []);

  const mapboxMapRef = useRef<MapboxMap | null>(null);

  const registerMapboxMap = useCallback((map: MapboxMap | null) => {
    mapboxMapRef.current = map;
  }, []);

  const closeMapPopups = useCallback(() => {
    const map = mapboxMapRef.current;
    if (map == null) return;
    closeAllPopups(map);
    removePopups(map, "POLYGON");
    removePopups(map, "MEDIA");
  }, []);

  const openEditPhotoDetails = useCallback(
    (media: MediaDto) => {
      closeMapPopups();
      setEditPhotoDetailsMedia(media);
    },
    [closeMapPopups]
  );

  useEffect(() => {
    registerMapAreaPopupActions({
      openPolygonSubmitConfirmation: setPolygonSubmitConfirmation,
      openEditPhotoDetails,
      closeMapPopups,
      openPolygonApproveConfirmation: setPolygonApproveConfirmation,
      openPolygonRequestInformationConfirmation: setPolygonRequestInformationConfirmation
    });
    return unregisterMapAreaPopupActions;
  }, [closeMapPopups, openEditPhotoDetails]);

  const resetSiteMapInteractionState = useCallback(() => {
    closeMapPopups();
    setIsUserDrawingEnabled(false);
    setEditPolygonInternal({ isOpen: false, uuid: "" });
    setShouldRefetchPolygonData(false);
    setSelectedPolyVersion(undefined);
    setOpenModalConfirmation(false);
    setPreviewVersion(false);
    setStatusSelectedPolygon("");
    setSelectedPolygonsInCheckbox([]);
    setHasOverlaps(false);
    setPolygonGeometryEdit(undefined);
    setDraftPolygonGeometry(undefined);
    setPolygonMapTileNonce(0);
    setPolygonSubmitConfirmation(null);
    setEditPhotoDetailsMedia(null);
    setShowPhotosOnMap(false);
    setGeotaggedPhotosMapVisible(false);
    setMediaFiles([]);
  }, [closeMapPopups]);

  const contextValue: MapAreaType = {
    isUserDrawingEnabled,
    setIsUserDrawingEnabled,
    editPolygon,
    setEditPolygon,
    siteData,
    setSiteData,
    shouldRefetchPolygonData,
    setShouldRefetchPolygonData,
    shouldRefetchMediaData,
    setShouldRefetchMediaData,
    shouldRefetchValidation,
    setShouldRefetchValidation,
    shouldRefetchPolygonVersions,
    setShouldRefetchPolygonVersions,
    hasOverlaps,
    setHasOverlaps,
    selectedPolygonsInCheckbox,
    setSelectedPolygonsInCheckbox,
    setSelectedPolyVersion,
    selectedPolyVersion,
    setOpenModalConfirmation,
    openModalConfirmation,
    previewVersion,
    setPreviewVersion,
    setStatusSelectedPolygon,
    statusSelectedPolygon,
    polygonCriteriaMap,
    setPolygonCriteriaMap,
    polygonData,
    setPolygonData,
    polygonGeometryEdit,
    setPolygonGeometryEdit,
    draftPolygonGeometry,
    setDraftPolygonGeometry,
    polygonMapTileNonce,
    invalidatePolygonMapTiles,
    validFilter,
    setValidFilter,
    registerMapboxMap,
    closeMapPopups,
    polygonSubmitConfirmation,
    setPolygonSubmitConfirmation,
    polygonApproveConfirmation,
    setPolygonApproveConfirmation,
    polygonRequestInformationConfirmation,
    setPolygonRequestInformationConfirmation,
    editPhotoDetailsMedia,
    setEditPhotoDetailsMedia,
    showPhotosOnMap,
    setShowPhotosOnMap,
    geotaggedPhotosMapVisible,
    setGeotaggedPhotosMapVisible,
    mediaFiles,
    setMediaFiles,
    resetSiteMapInteractionState
  };

  return <MapAreaContext.Provider value={contextValue}>{children}</MapAreaContext.Provider>;
};

export const useMapAreaContext = () => {
  const context = useContext(MapAreaContext);
  if (!context) {
    throw new Error("useMapAreaContext must be used within a MapAreaProvider");
  }
  return context;
};
