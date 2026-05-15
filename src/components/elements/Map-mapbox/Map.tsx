import "mapbox-gl/dist/mapbox-gl.css";

import { useMediaQuery } from "@mui/material";
import { useT } from "@transifex/react";
import { Map as MapboxMap, Marker } from "mapbox-gl";
import { useRouter } from "next/router";
import React, { createContext, DetailedHTMLProps, FC, HTMLAttributes, useEffect, useRef, useState } from "react";
import { ValidationError } from "yup";

import ControlGroup, { ControlMapPosition } from "@/components/elements/Map-mapbox/components/ControlGroup";
import { AdditionalPolygonProperties } from "@/components/elements/Map-mapbox/MapLayers/ShapePropertiesModal";
import { useAnrPlotGeometry } from "@/connections/AnrPlotGeometry";
import { useBoundingBox } from "@/connections/BoundingBox";
import { useAnrMapOverlayOptional } from "@/context/anrMapOverlay.provider";
import { useDashboardContext } from "@/context/dashboard.provider";
import { useLoading } from "@/context/loaderAdmin.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { useOnMount } from "@/hooks/useOnMount";

import { addOrUpdateMarkerAndZoom } from "./adapters/camera";
import { ChampionsMapProvider } from "./championsMap.context";
import MapCanvas from "./components/MapCanvas";
import MapControlsOverlay from "./components/MapControlsOverlay";
import { PopupMobile } from "./components/PopupMobile";
import { useMapReadiness } from "./core/useMapReadiness";
import { BBox } from "./GeoJSON";
import { useGoogleSatellite } from "./hooks/useGoogleSatellite";
import { useMapCamera } from "./hooks/useMapCamera";
import { useMapDownload } from "./hooks/useMapDownload";
import { useMapDraw } from "./hooks/useMapDraw";
import { useMapFullscreen } from "./hooks/useMapFullscreen";
import { useMapLayers } from "./hooks/useMapLayers";
import { useMapMedia } from "./hooks/useMapMedia";
import { useMapOverlays } from "./hooks/useMapOverlays";
import { useMapPopups } from "./hooks/useMapPopups";
import { useMapStyle } from "./hooks/useMapStyle";
import {
  usePolygonSelectionZoom,
  usePolygonTableHighlightPointer,
  usePolygonTableHighlightStyle
} from "./hooks/usePolygonTableHighlight";
import { addGeojsonToDraw } from "./interactions/draw";
import type {
  DashboardGetProjectsData,
  DashboardPopupContext,
  EntityData,
  MapFunctions,
  MobilePopupData,
  PolygonCentroid,
  PolygonFromMapState,
  SetPolygonFromMap,
  TooltipType
} from "./Map.d";
import EmptyStateDisplay from "./MapControls/EmptyStateDisplay";
import FilterControl from "./MapControls/FilterControl";
import PolygonCheck from "./MapControls/PolygonCheck";
import { MapStyle } from "./MapControls/types";

export type { DashboardGetProjectsData, PolygonCentroid };

export interface BaseMapProps {
  mapFunctions?: MapFunctions;
  polygonsData?: Record<string, string[]>;
  bbox?: BBox;
  center?: [number, number];
  zoom?: number;
  mapStyle?: MapStyle;
  onStyleChange?: (style: MapStyle) => void;
  showPopups?: boolean;
  showLegend?: boolean;
  hasControls?: boolean;
  entityData?: EntityData;
  mediaFiles?: MediaDto[];
  tooltipType?: TooltipType;
  sitePolygonData?: SitePolygonLightDto[];
  className?: string;
  legendPosition?: ControlMapPosition;
  polygonsExists?: boolean;
  shouldBboxZoom?: boolean;
  /** Tile cache key from another map; modal can reuse the same Geoserver RND. */
  initialTileVersion?: string;
  /** When it matches current polygon data, skip bumping the tile cache on mount. */
  initialPolygonFingerprint?: string;
  /** Champions (non-admin) map layout and controls; omit or false for the default map. */
  championsMap?: boolean;
  polygonTableHighlight?: {
    hoveredPolygonUuid: string | null;
    selectedPolygonUuids: string[];
    onHoveredPolygonFromMap?: (uuid: string | null) => void;
    onPolygonClickedFromMap?: (uuid: string) => void;
  };
}

export interface DashboardMapExtras {
  dashboardMode: "dashboard" | "modal";
  dashboardContext?: DashboardPopupContext;
  centroids?: DashboardGetProjectsData[];
  polygonsCentroids?: PolygonCentroid[];
  selectedLandscapes?: string[];
  projectUUID?: string;
  hasAccess?: boolean;
  setLoader?: (value: boolean) => void;
}

export interface AdminMapExtras {
  status?: boolean;
  validationType?: string;
  polygonChecks?: boolean;
  siteData?: boolean;
  record?: { uuid?: string; organisation?: { name?: string } };
  showDownloadPolygons?: boolean;
  setIsLoadingDelayedJob?: (value: boolean) => void;
  isLoadingDelayedJob?: boolean;
  setAlertTitle?: (value: string) => void;
  disabledPolygonPanel?: boolean;
  setPolygonFromMap?: SetPolygonFromMap;
  polygonFromMap?: PolygonFromMapState;
  imageGalleryRef?: React.RefObject<HTMLDivElement>;
  showViewGallery?: boolean;
}

export interface FormMapExtras {
  formMap?: boolean;
  editable?: boolean;
  geojson?: GeoJSON.FeatureCollection | GeoJSON.Feature | null;
  onGeojsonChange?: (featuresCollection?: GeoJSON.FeatureCollection | null) => void;
  onError?: (hasError: boolean, errors: { [index: string | number]: ValidationError | undefined }) => void;
  onDeleteImage?: (uuid: string) => void;
  additionalPolygonProperties?: AdditionalPolygonProperties;
  captureAdditionalPolygonProperties?: boolean;
  setPolygonFromMap?: SetPolygonFromMap;
  polygonFromMap?: PolygonFromMapState;
}

export interface ReadOnlyMapExtras {
  location?: { lat: number; lng: number } | null;
}

interface MapProps
  extends Omit<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "onError">,
    BaseMapProps,
    Partial<DashboardMapExtras>,
    AdminMapExtras,
    FormMapExtras,
    ReadOnlyMapExtras {}

export const MapEditingContext = createContext({
  isEditing: false,
  setIsEditing: (_value: boolean) => {}
});

type MapContainerInnerProps = Omit<MapProps, "championsMap"> & {
  mapFunctions: NonNullable<MapProps["mapFunctions"]>;
};

const MapContainerInner: FC<MapContainerInnerProps> = ({
  onError: _onError,
  editable,
  geojson,
  onGeojsonChange: _onGeojsonChange,
  className,
  onDeleteImage: _onDeleteImage,
  hasControls = true,
  additionalPolygonProperties: _additionalPolygonProperties,
  captureAdditionalPolygonProperties: _captureAdditionalPolygonProperties,
  siteData = false,
  status = false,
  validationType = "bulkValidation",
  polygonChecks = false,
  record,
  showPopups = false,
  showLegend = false,
  showDownloadPolygons = false,
  mapFunctions,
  tooltipType = "view",
  polygonsExists = true,
  shouldBboxZoom = true,
  dashboardMode = undefined,
  formMap: isFormMap,
  location,
  entityData,
  imageGalleryRef,
  centroids,
  setIsLoadingDelayedJob,
  isLoadingDelayedJob,
  setAlertTitle,
  showViewGallery = true,
  legendPosition,
  hasAccess,
  dashboardContext,
  disabledPolygonPanel = false,
  ...props
}) => {
  const resizeDebounceTimeoutRef = useRef<number | null>(null);
  const { map, mapContainer, draw, onCancel, initMap } = mapFunctions;

  const {
    polygonsData,
    polygonsCentroids,
    bbox,
    center,
    zoom,
    mapStyle: mapStyleProp,
    onStyleChange,
    setPolygonFromMap,
    polygonFromMap,
    sitePolygonData,
    selectedLandscapes,
    projectUUID,
    setLoader,
    initialTileVersion,
    initialPolygonFingerprint,
    polygonTableHighlight
  } = props;

  const [isViewingImages, setIsViewingImages] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [mobilePopupData, setMobilePopupData] = useState<MobilePopupData | null>(null);
  const mapMarkerRef = useRef<Marker | null>(null);
  const isMobile = useMediaQuery("(max-width: 1200px)");

  const context = useSitePolygonData();
  const contextMapArea = useMapAreaContext();
  const dashboardContextFromHook = useDashboardContext();
  const { setFilters, dashboardCountries } = dashboardContextFromHook ?? {};

  const resolvedDashboardContext: DashboardPopupContext | undefined =
    dashboardMode != null
      ? {
          dashboardMode,
          setFilters: dashboardContext?.setFilters ?? setFilters,
          dashboardCountries: dashboardContext?.dashboardCountries ?? dashboardCountries
        }
      : undefined;

  const { reloadSiteData } = context ?? {};
  const t = useT();
  const { showLoader, hideLoader } = useLoading();
  const router = useRouter();
  const { openModal, closeModal } = useModalContext();
  const { openNotification } = useNotificationContext();
  const {
    isUserDrawingEnabled,
    selectedPolyVersion,
    editPolygon,
    setEditPolygon,
    setShouldRefetchPolygonData,
    setShouldRefetchMediaData,
    statusSelectedPolygon,
    setStatusSelectedPolygon,
    selectedPolygonsInCheckbox
  } = contextMapArea;

  const anrMapOverlay = useAnrMapOverlayOptional();
  const anrPlotGeometryFetchEnabled =
    anrMapOverlay != null &&
    anrMapOverlay.drawerOpen &&
    anrMapOverlay.anrTabActive &&
    anrMapOverlay.showPlotsOnMap &&
    anrMapOverlay.sitePolygonUuidForApi != null &&
    anrMapOverlay.sitePolygonUuidForApi !== "";

  const [, { data: anrPlotGeometryDto }] = useAnrPlotGeometry({
    sitePolygonUuid: anrMapOverlay?.sitePolygonUuidForApi ?? "",
    enabled: anrPlotGeometryFetchEnabled
  });

  const polygonBbox = useBoundingBox(
    entityData?.entityName === "project-pitch"
      ? { projectPitchUuid: entityData?.entityUUID }
      : { polygonUuid: polygonFromMap?.uuid }
  );

  useOnMount(() => {
    const initialStyle =
      mapStyleProp !== undefined ? mapStyleProp : dashboardMode ? MapStyle.Street : MapStyle.Satellite;
    initMap(!!dashboardMode, initialStyle);
    return () => {
      if (mapMarkerRef.current != null) {
        mapMarkerRef.current.remove();
        mapMarkerRef.current = null;
      }
      if (map.current != null) {
        map.current.remove();
        map.current = null;
      }
    };
  });

  useOnMount(() => {
    if (geojson != null && map.current != null && draw.current != null) {
      addGeojsonToDraw(geojson, "", () => {}, draw.current, map.current);
    }
  });

  useOnMount(() => {
    const el = mapContainer.current;
    if (el == null) return;
    const resizeNow = () => {
      map.current?.resize();
    };
    const scheduleResize = () => {
      if (resizeDebounceTimeoutRef.current != null) {
        clearTimeout(resizeDebounceTimeoutRef.current);
      }
      resizeDebounceTimeoutRef.current = window.setTimeout(() => {
        resizeDebounceTimeoutRef.current = null;
        resizeNow();
      }, 22);
    };
    const handleMouseUp = () => {
      if (resizeDebounceTimeoutRef.current != null) {
        clearTimeout(resizeDebounceTimeoutRef.current);
        resizeDebounceTimeoutRef.current = null;
      }
      resizeNow();
    };
    const ro = new ResizeObserver(() => {
      scheduleResize();
    });
    ro.observe(el);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      ro.disconnect();
      window.removeEventListener("mouseup", handleMouseUp);
      if (resizeDebounceTimeoutRef.current != null) {
        clearTimeout(resizeDebounceTimeoutRef.current);
        resizeDebounceTimeoutRef.current = null;
      }
    };
  });

  const [mapInstanceForReadiness, setMapInstanceForReadiness] = useState<MapboxMap | null>(null);
  useEffect(() => {
    if (map == null) return;
    const t = window.setInterval(() => {
      setMapInstanceForReadiness(prev => {
        const c = map.current;
        return c === prev ? prev : c;
      });
    }, 100);
    return () => {
      clearInterval(t);
    };
  }, [map]);

  const { styleReady, styleVersion } = useMapReadiness(mapInstanceForReadiness);

  const { currentStyle, handleStyleChange } = useMapStyle({
    map,
    mapStyleProp,
    styleReady,
    projectUUID,
    dashboardMode,
    onStyleChange
  });

  const { sourcesAdded } = useMapLayers({
    map,
    draw,
    styleReady,
    styleVersion,
    polygonsData,
    centroids,
    polygonsCentroids,
    dashboardMode,
    projectUUID,
    hasAccess,
    selectedPolygonsInCheckbox,
    initialTileVersion,
    initialPolygonFingerprint
  });

  usePolygonTableHighlightStyle({
    map,
    styleReady,
    styleVersion,
    sourcesAdded,
    highlight: polygonTableHighlight
  });

  usePolygonSelectionZoom({
    map,
    styleReady,
    sourcesAdded,
    selectedPolygonUuids: polygonTableHighlight?.selectedPolygonUuids,
    sitePolygonData
  });

  usePolygonTableHighlightPointer({
    map,
    draw,
    styleReady,
    styleVersion,
    sourcesAdded,
    highlight: polygonTableHighlight
  });

  useMapPopups({
    map,
    draw,
    sourcesAdded,
    showPopups,
    sitePolygonData,
    tooltipType,
    isMobile,
    setLoader,
    setPolygonFromMap,
    setShouldRefetchPolygonData,
    setEditPolygon,
    editPolygon,
    setMobilePopupData,
    dashboardContext: resolvedDashboardContext
  });

  useMapCamera({
    map,
    bbox,
    center,
    zoom,
    hasControls,
    shouldBboxZoom,
    polygonFromMap,
    polygonBbox,
    isUserDrawingEnabled,
    isEditing
  });

  useMapOverlays({
    map,
    selectedLandscapes,
    anrMapOverlay,
    anrPlotGeometryDto,
    styleReady,
    styleVersion,
    sourcesAdded
  });

  useMapMedia({
    map,
    mediaFiles: props.mediaFiles,
    styleReady,
    styleVersion,
    entityData,
    t,
    showLoader,
    hideLoader,
    openNotification,
    openModal,
    closeModal,
    setShouldRefetchMediaData,
    router
  });

  const { handleEditPolygon, onSaveEdit, onCancelEdit } = useMapDraw({
    map,
    draw,
    isUserDrawingEnabled,
    formMap: isFormMap,
    polygonFromMap,
    polygonsData,
    centroids,
    sitePolygonData,
    selectedPolyVersion,
    onCancel,
    setPolygonFromMap,
    reloadSiteData,
    setShouldRefetchPolygonData,
    statusSelectedPolygon,
    setStatusSelectedPolygon,
    t,
    showLoader,
    hideLoader,
    openNotification
  });

  const { isFullscreen, toggleFullscreen } = useMapFullscreen({ mapContainer, map });

  const { isDownloadingPolygons, downloadGeoJsonPolygon } = useMapDownload({
    polygonsData,
    entityData,
    record,
    t,
    openNotification
  });

  useGoogleSatellite(currentStyle, styleReady, styleVersion, map, mapContainer);

  useEffect(() => {
    if (map.current == null || location == null || location.lat === 0 || location.lng === 0) return;
    mapMarkerRef.current = addOrUpdateMarkerAndZoom(map.current, location, mapMarkerRef.current);
  }, [map, location]);

  return (
    <MapEditingContext.Provider value={{ isEditing, setIsEditing }}>
      <MapCanvas mapContainer={mapContainer} className={className}>
        <MapControlsOverlay
          hasControls={hasControls}
          draw={{
            handleEditPolygon,
            onSaveEdit,
            onCancelEdit,
            isEditing,
            handleTrashDelete: mapFunctions.handleTrashDelete
          }}
          style={{ map: map.current, currentStyle, handleStyleChange, styleReady }}
          admin={{
            record,
            siteData,
            validationType,
            status,
            isFullscreen,
            setIsLoadingDelayedJob,
            isLoadingDelayedJob,
            setAlertTitle,
            disabledPolygonPanel,
            selectedPolygonsInCheckbox
          }}
          form={{
            formMap: isFormMap,
            editable,
            polygonFromMap,
            viewImages: isViewingImages,
            setViewImages: setIsViewingImages
          }}
          camera={{ map: map.current, center, zoom, bbox, hasControls }}
          gallery={{ dashboardMode, showViewGallery, imageGalleryRef }}
          download={{ showDownloadPolygons, isDownloadingPolygons, downloadGeoJsonPolygon }}
          fullscreen={{ dashboardMode, isFullscreen, toggleFullscreen }}
        />

        {showLegend ? (
          <ControlGroup
            position={
              disabledPolygonPanel ? "bottom-left" : siteData ? "bottom-left-site" : legendPosition ?? "bottom-left"
            }
            isFullscreen={isFullscreen}
          >
            <FilterControl />
          </ControlGroup>
        ) : null}

        {polygonChecks ? (
          <ControlGroup position="bottom-left" className="bottom-13">
            <PolygonCheck />
          </ControlGroup>
        ) : null}

        {!polygonsExists && !disabledPolygonPanel ? <EmptyStateDisplay /> : null}

        {(isMobile || dashboardMode != null) && mobilePopupData != null ? (
          <PopupMobile
            event={mobilePopupData}
            onClose={() => setMobilePopupData(null)}
            variant={isMobile ? "mobile" : "desktop"}
          />
        ) : null}
      </MapCanvas>
    </MapEditingContext.Provider>
  );
};

export const MapContainer: FC<MapProps> = ({ mapFunctions, championsMap = false, ...rest }) => {
  if (mapFunctions == null) return null;
  return (
    <ChampionsMapProvider championsMap={championsMap}>
      <MapContainerInner mapFunctions={mapFunctions} {...rest} />
    </ChampionsMapProvider>
  );
};

export default MapContainer;
