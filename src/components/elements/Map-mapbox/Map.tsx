import "mapbox-gl/dist/mapbox-gl.css";

import { useMediaQuery } from "@mui/material";
import { useT } from "@transifex/react";
import _ from "lodash";
import { LngLat } from "mapbox-gl";
import { useRouter } from "next/router";
import React, { createContext, DetailedHTMLProps, HTMLAttributes, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { ValidationError } from "yup";

import ControlGroup, { ControlMapPosition } from "@/components/elements/Map-mapbox/components/ControlGroup";
import { AdditionalPolygonProperties } from "@/components/elements/Map-mapbox/MapLayers/ShapePropertiesModal";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
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
import Log from "@/utils/log";

import { PopupMobile } from "./components/PopupMobile";
import { useMapReadiness } from "./core/useMapReadiness";
import { BBox } from "./GeoJSON";
import { useGoogleSatellite } from "./hooks/useGoogleSatellite";
import { useMapCamera } from "./hooks/useMapCamera";
import { useMapDraw } from "./hooks/useMapDraw";
import { useMapFullscreen } from "./hooks/useMapFullscreen";
import { useMapLayers } from "./hooks/useMapLayers";
import { useMapMedia } from "./hooks/useMapMedia";
import { useMapOverlays } from "./hooks/useMapOverlays";
import { useMapPopups } from "./hooks/useMapPopups";
import type { DashboardGetProjectsData, MapFunctions, TooltipType } from "./Map.d";
export type { DashboardGetProjectsData };
import CheckIndividualPolygonControl from "./MapControls/CheckIndividualPolygonControl";
import CheckPolygonControl from "./MapControls/CheckPolygonControl";
import EditControl from "./MapControls/EditControl";
import EmptyStateDisplay from "./MapControls/EmptyStateDisplay";
import { FilterControl } from "./MapControls/FilterControl";
import ImageControl from "./MapControls/ImageControl";
import PolygonCheck from "./MapControls/PolygonCheck";
import { PolygonHandler } from "./MapControls/PolygonHandler";
import PolygonModifier from "./MapControls/PolygonModifier";
import ProcessBulkPolygonsControl from "./MapControls/ProcessBulkPolygonsControl";
import { StyleControl } from "./MapControls/StyleControl";
import TrashButton from "./MapControls/TrashButton";
import { MapStyle } from "./MapControls/types";
import ViewImageGalleryButton from "./MapControls/ViewImageGalleryButton";
import { ZoomControl } from "./MapControls/ZoomControl";
import {
  addGeojsonToDraw,
  addMarkerAndZoom,
  downloadMultiplePolygonsGeoJson,
  downloadProjectPolygonsGeoJson,
  getCurrentMapStyle,
  setMapStyle,
  zoomToBbox,
  zoomToCenter
} from "./utils";

interface LegendItem {
  color: string;
  text: string;
  uuid: string;
}

interface MapProps extends Omit<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "onError"> {
  geojson?: any;
  editable?: boolean;

  onGeojsonChange?: (featuresCollection?: GeoJSON.FeatureCollection | null) => void;
  onError?: (hasError: boolean, errors: { [index: string | number]: ValidationError | undefined }) => void;
  onDeleteImage?: (uuid: string) => void;
  additionalPolygonProperties?: AdditionalPolygonProperties;
  captureAdditionalPolygonProperties?: boolean;
  hasControls?: boolean;
  siteData?: boolean;
  status?: boolean;
  validationType?: string;
  editPolygon?: boolean;
  polygonChecks?: boolean;
  legend?: LegendItem[];
  centroids?: DashboardGetProjectsData[];
  polygonsData?: Record<string, string[]>;
  polygonsCentroids?: any[];
  bbox?: BBox;
  center?: [number, number];
  zoom?: number;
  mapStyle?: MapStyle;
  onStyleChange?: (style: MapStyle) => void;
  setPolygonFromMap?: React.Dispatch<
    React.SetStateAction<{ uuid: string; isOpen: boolean; entityName?: string; projectPitchUuid?: string }>
  >;
  polygonFromMap?: { uuid: string; isOpen: boolean; entityName?: string; projectPitchUuid?: string };
  record?: any;
  showPopups?: boolean;
  showLegend?: boolean;
  showDownloadPolygons?: boolean;
  mapFunctions?: MapFunctions;
  tooltipType?: TooltipType;
  sitePolygonData?: SitePolygonLightDto[];
  polygonsExists?: boolean;
  shouldBboxZoom?: boolean;
  modelFilesData?: MediaDto[];
  formMap?: boolean;
  pdView?: boolean;
  location?: LngLat;
  isDashboard?: "dashboard" | "modal" | undefined;
  entityData?: any;
  imageGalleryRef?: React.RefObject<HTMLDivElement>;
  listViewProjects?: any;
  role?: any;
  selectedCountry?: string | null;
  selectedLandscapes?: string[];
  projectUUID?: string | undefined;
  setLoader?: (value: boolean) => void;
  setIsLoadingDelayedJob?: (value: boolean) => void;
  isLoadingDelayedJob?: boolean;
  setAlertTitle?: (value: string) => void;
  showViewGallery?: boolean;
  legendPosition?: ControlMapPosition;
  hasAccess?: boolean;
  dashboardContext?: {
    setFilters: (fn: (prev: any) => any) => void;
    dashboardCountries?: any[];
    isDashboard?: string;
  };
  disabledPolygonPanel?: boolean;
}

export const MapEditingContext = createContext({
  isEditing: false,
  setIsEditing: (value: boolean) => {}
});

export const MapContainer = ({
  onError: _onError,
  editable,
  geojson,
  onGeojsonChange,
  className,
  onDeleteImage,
  hasControls = true,
  additionalPolygonProperties,
  captureAdditionalPolygonProperties,
  siteData = false,
  status = false,
  validationType = "bulkValidation",
  editPolygon = false,
  polygonChecks = false,
  record,
  showPopups = false,
  showLegend = false,
  showDownloadPolygons = false,
  mapFunctions,
  tooltipType = "view",
  polygonsExists = true,
  shouldBboxZoom = true,
  isDashboard = undefined,
  formMap,
  pdView = false,
  location,
  entityData,
  imageGalleryRef,
  centroids,
  listViewProjects,
  setIsLoadingDelayedJob,
  isLoadingDelayedJob,
  setAlertTitle,
  showViewGallery = true,
  legendPosition,
  hasAccess,
  dashboardContext,
  disabledPolygonPanel = false,
  ...props
}: MapProps) => {
  const [viewImages, setViewImages] = useState(false);
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
    selectedCountry,
    selectedLandscapes,
    projectUUID,
    setLoader
  } = props;
  const [currentStyle, setCurrentStyle] = useState<MapStyle>(() => {
    return mapStyleProp !== undefined ? mapStyleProp : isDashboard ? MapStyle.Street : MapStyle.Satellite;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isDownloadingPolygons, setIsDownloadingPolygons] = useState(false);
  const [userChangedStyle, setUserChangedStyle] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1200px)");

  const [mobilePopupData, setMobilePopupData] = useState<any>(null);
  const context = useSitePolygonData();
  const contextMapArea = useMapAreaContext();
  const dashboardContextFromHook = useDashboardContext();
  const { setFilters, dashboardCountries } = dashboardContextFromHook ?? {};
  const { reloadSiteData } = context ?? {};
  const t = useT();
  const { showLoader, hideLoader } = useLoading();
  const router = useRouter();
  const { openModal, closeModal } = useModalContext();
  const { openNotification } = useNotificationContext();
  const {
    isUserDrawingEnabled,
    selectedPolyVersion,
    editPolygon: editPolygonSelected,
    setEditPolygon,
    setShouldRefetchPolygonData,
    setShouldRefetchMediaData,
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

  const handleStyleChange = (newStyle: MapStyle) => {
    setCurrentStyle(newStyle);
    setUserChangedStyle(true);
    onStyleChange?.(newStyle);
  };
  if (!mapFunctions) {
    return null;
  }
  const { map, mapContainer, draw, onCancel, initMap, setStyleLoaded } = mapFunctions;

  const polygonBbox = useBoundingBox(
    entityData?.entityName == "project-pitch"
      ? { projectPitchUuid: entityData?.entityUUID }
      : { polygonUuid: polygonFromMap?.uuid }
  );

  useOnMount(() => {
    const initialStyle = mapStyleProp !== undefined ? mapStyleProp : isDashboard ? MapStyle.Street : MapStyle.Satellite;
    initMap(!!isDashboard, initialStyle);
    return () => {
      if (map.current) {
        setStyleLoaded(false);
        map.current.remove();
        map.current = null;
      }
    };
  });

  // Single source of truth for style readiness — wires core/useMapReadiness.
  // styleVersion increments on every style.load so hooks always re-run after style switches.
  const { styleReady, styleVersion } = useMapReadiness(map?.current);

  useEffect(() => {
    if (map.current == null || location == null || location.lat === 0 || location.lng === 0) return;
    addMarkerAndZoom(map.current, location);
  }, [map, location]);

  // ── Domain hooks ─────────────────────────────────────────────────────────────
  // All hooks use styleReady from useMapReadiness as their single gate.
  const { sourcesAdded } = useMapLayers({
    map,
    draw,
    styleReady,
    styleVersion,
    polygonsData,
    centroids,
    polygonsCentroids,
    isDashboard,
    projectUUID,
    hasAccess,
    selectedPolygonsInCheckbox
  });

  // Popup registration is gated on sourcesAdded (separate from layer lifecycle).
  useMapPopups({
    map,
    draw,
    sourcesAdded,
    showPopups,
    sitePolygonData,
    tooltipType,
    isDashboard,
    selectedCountry,
    isMobile,
    dashboardCountries,
    setLoader,
    setPolygonFromMap,
    setEditPolygon,
    editPolygonSelected,
    setFilters,
    setMobilePopupData,
    dashboardContext
  });

  useMapCamera({ map, bbox, center, zoom, hasControls, shouldBboxZoom, polygonFromMap, polygonBbox });

  useMapOverlays({
    map,
    selectedCountry,
    selectedLandscapes,
    anrMapOverlay,
    anrPlotGeometryDto,
    styleReady,
    styleVersion,
    sourcesAdded
  });

  useMapMedia({
    map,
    modelFilesData: props.modelFilesData,
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
    formMap,
    pdView,
    polygonFromMap,
    polygonsData,
    centroids,
    sitePolygonData,
    selectedPolyVersion,
    onCancel,
    setPolygonFromMap,
    reloadSiteData,
    setShouldRefetchPolygonData,
    setStatusSelectedPolygon,
    t,
    showLoader,
    hideLoader,
    openNotification
  });

  const { isFullscreen, toggleFullscreen } = useMapFullscreen({ mapContainer, map });

  useGoogleSatellite(currentStyle, styleReady, styleVersion, map, mapContainer);

  // Style sync: parent prop → local style state
  useEffect(() => {
    if (map.current == null || !styleReady) return;
    if (mapStyleProp != null && mapStyleProp !== currentStyle) {
      const actualStyle = getCurrentMapStyle(map.current);
      if (actualStyle !== mapStyleProp) {
        setMapStyle(mapStyleProp, map.current, setCurrentStyle, currentStyle);
      } else {
        setCurrentStyle(mapStyleProp);
      }
    }
  }, [mapStyleProp, map, currentStyle, styleReady, styleVersion]);

  // Auto-satellite when a project is loaded (reset on project change)
  useEffect(() => {
    setUserChangedStyle(false);
  }, [projectUUID]);

  useEffect(() => {
    if (map.current == null || !projectUUID || userChangedStyle || !styleReady) return;
    setMapStyle(MapStyle.Satellite, map.current, setCurrentStyle, currentStyle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectUUID, userChangedStyle, styleReady]);

  useOnMount(() => {
    if (geojson != null && map.current != null && draw.current != null) {
      addGeojsonToDraw(geojson, "", () => {}, draw.current, map.current);
    }
  });

  const downloadGeoJsonPolygon = async () => {
    setIsDownloadingPolygons(true);
    try {
      const isProjectContext = entityData?.entityName == "project-pitches";
      const projectPitchUuid = entityData?.entityUUID;

      if (isProjectContext && projectPitchUuid != null) {
        const projectName = record?.organisation?.name ?? "project";
        const filename = `${_.replace(projectName, /\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}`;
        await downloadProjectPolygonsGeoJson(projectPitchUuid, filename);
        openNotification("success", t("Success"), t("Successfully downloaded project polygons."));
      } else {
        let polygonsToDownload: string[] = [];
        if (polygonsData) {
          const allPolygons: string[] = [];
          Object.values(polygonsData).forEach(statusPolygons => {
            if (Array.isArray(statusPolygons)) {
              allPolygons.push(...statusPolygons);
            }
          });
          polygonsToDownload = allPolygons;
        }

        if (polygonsToDownload.length === 0) {
          openNotification("error", t("Error"), t("No polygons found to download."));
          return;
        }

        const nameFile = record?.organisation?.name ?? "polygons";
        const filename = `${_.replace(nameFile, /\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}`;
        await downloadMultiplePolygonsGeoJson(polygonsToDownload, filename);
        openNotification(
          "success",
          t("Success"),
          t(`Successfully downloaded ${polygonsToDownload.length} polygon(s).`)
        );
      }
    } catch (error: any) {
      Log.error("Download error:", error);
      // Show more specific error message
      const errorMessage = error?.message ?? t("Failed to download polygons. Please try again.");
      openNotification("error", t("Error"), errorMessage);
    } finally {
      setIsDownloadingPolygons(false);
    }
  };

  return (
    <MapEditingContext.Provider value={{ isEditing, setIsEditing }}>
      <div ref={mapContainer} className={twMerge("relative h-[500px] wide:h-[700px]", className)} id="map-container">
        {showDownloadPolygons ? (
          <ControlGroup position="top-right">
            <button
              type="button"
              className="shadow-lg z-10 flex h-10 w-56 items-center justify-center gap-2 rounded border border-neutral-175 bg-white p-2.5 text-darkCustom-100 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={downloadGeoJsonPolygon}
              disabled={isDownloadingPolygons}
            >
              {isDownloadingPolygons ? (
                <Icon name={IconNames.SPINNER} className="h-5 w-5 animate-spin lg:h-6 lg:w-6" />
              ) : (
                <Icon name={IconNames.DOWNLOAD} className="h-5 w-5 lg:h-6 lg:w-6" />
              )}
              <span>{isDownloadingPolygons ? "Downloading..." : "Download Polygons"}</span>
            </button>
          </ControlGroup>
        ) : null}
        {hasControls ? (
          <>
            {polygonFromMap?.isOpen && !formMap && !disabledPolygonPanel ? (
              <ControlGroup position={siteData ? "top-centerSite" : "top-center"}>
                <EditControl onClick={handleEditPolygon} onSave={onSaveEdit} onCancel={onCancelEdit} />
              </ControlGroup>
            ) : null}
            {selectedPolygonsInCheckbox.length > 0 && !disabledPolygonPanel ? (
              <ControlGroup position={siteData ? "top-centerSite" : "top-centerPolygonsInCheckbox"}>
                <ProcessBulkPolygonsControl
                  entityData={record}
                  setIsLoadingDelayedJob={setIsLoadingDelayedJob!}
                  isLoadingDelayedJob={isLoadingDelayedJob!}
                  setAlertTitle={setAlertTitle!}
                />
              </ControlGroup>
            ) : null}
            {isDashboard !== "dashboard" && styleReady && map.current != null ? (
              <ControlGroup position="top-right">
                <StyleControl map={map.current} currentStyle={currentStyle} setCurrentStyle={handleStyleChange} />
              </ControlGroup>
            ) : null}
            <ControlGroup position="top-right" className="top-[4.5rem]">
              <ZoomControl map={map.current} />
            </ControlGroup>

            {record?.uuid != null && validationType === "bulkValidation" && !disabledPolygonPanel ? (
              <ControlGroup position={siteData ? "top-left-site" : "top-left"} isFullscreen={isFullscreen}>
                <CheckPolygonControl
                  siteRecord={record}
                  polygonCheck={!siteData}
                  setIsLoadingDelayedJob={setIsLoadingDelayedJob!}
                  isLoadingDelayedJob={isLoadingDelayedJob!}
                  setAlertTitle={setAlertTitle!}
                />
              </ControlGroup>
            ) : null}
            {formMap ? (
              <>
                <ControlGroup position="top-left">
                  <PolygonHandler />
                </ControlGroup>
                <ControlGroup position="top-right" className="top-[17rem]">
                  <PolygonModifier
                    polygonFromMap={polygonFromMap}
                    onClick={handleEditPolygon}
                    onSave={onSaveEdit}
                    onCancel={onCancelEdit}
                  />
                </ControlGroup>
              </>
            ) : null}
            {status && validationType === "individualValidation" && !disabledPolygonPanel ? (
              <ControlGroup position={siteData ? "top-left-site" : "top-left"}>
                <CheckIndividualPolygonControl viewRequestSuport={!siteData} entityData={record} />
              </ControlGroup>
            ) : null}
            {viewImages ? (
              <ControlGroup position={siteData ? "bottom-left-site" : "bottom-left"}>
                <ImageControl viewImages={viewImages} setViewImages={setViewImages} />
              </ControlGroup>
            ) : null}
            {editPolygon ? (
              <ControlGroup position="top-right" className="top-64">
                <button type="button" className="rounded-lg bg-white p-2.5 text-primary hover:text-primary ">
                  <Icon name={IconNames.EDIT} className="h-5 w-5 lg:h-6 lg:w-6" />
                </button>
              </ControlGroup>
            ) : null}
            {!editable && !viewImages ? (
              <ControlGroup position={siteData ? "bottom-left-site" : "bottom-left"}></ControlGroup>
            ) : null}
            <ControlGroup position="top-right" className="top-[10.5rem]">
              <button
                type="button"
                className="h-10 w-10 rounded-sm border border-neutral-175 bg-white p-2 text-darkCustom-100 hover:bg-neutral-200 "
                onClick={() => {
                  if (center && zoom !== undefined && map.current) {
                    zoomToCenter(center, zoom, map.current);
                  } else if (bbox && map.current) {
                    zoomToBbox(bbox, map.current, hasControls);
                  }
                }}
              >
                <Icon name={IconNames.IC_EARTH_MAP} className="h-6 w-6" />
              </button>
            </ControlGroup>
            {isDashboard == null ? (
              <ControlGroup position="top-right" className="top-[13.75rem]">
                <button
                  type="button"
                  className="h-10 w-10 rounded-sm border border-neutral-175 bg-white p-2 text-darkCustom-100 hover:bg-neutral-200 "
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  <Icon name={isFullscreen ? IconNames.IC_SHINK : IconNames.IC_EXPAND} className="h-6 w-6" />
                </button>
              </ControlGroup>
            ) : null}
            {isEditing ? (
              <ControlGroup position="top-right" className="top-[272px]">
                <TrashButton onClick={mapFunctions?.handleTrashDelete} />
              </ControlGroup>
            ) : null}
            {!formMap && showViewGallery ? (
              <ControlGroup position="bottom-right" className="bottom-8 flex flex-row gap-2 mobile:hidden">
                {isDashboard === "dashboard" && styleReady && map.current != null && (
                  <StyleControl map={map.current} currentStyle={currentStyle} setCurrentStyle={handleStyleChange} />
                )}
                {isDashboard !== "dashboard" && isDashboard !== "modal" && !disabledPolygonPanel && (
                  <ViewImageGalleryButton imageGalleryRef={imageGalleryRef} />
                )}
              </ControlGroup>
            ) : null}
          </>
        ) : null}
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
        {(isMobile || isDashboard) && mobilePopupData !== null ? (
          <PopupMobile
            event={mobilePopupData}
            onClose={() => setMobilePopupData(null)}
            variant={isMobile ? "mobile" : "desktop"}
          />
        ) : null}
      </div>
    </MapEditingContext.Provider>
  );
};

export default MapContainer;
