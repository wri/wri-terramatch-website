import "mapbox-gl/dist/mapbox-gl.css";

import { useMediaQuery } from "@mui/material";
import { useT } from "@transifex/react";
import _ from "lodash";
import mapboxgl, { LngLat } from "mapbox-gl";
import { useRouter } from "next/router";
import React, { createContext, DetailedHTMLProps, HTMLAttributes, useEffect, useState } from "react";
import { When } from "react-if";
import { twMerge } from "tailwind-merge";
import { ValidationError } from "yup";

import ControlGroup, { ControlMapPosition } from "@/components/elements/Map-mapbox/components/ControlGroup";
import { AdditionalPolygonProperties } from "@/components/elements/Map-mapbox/MapLayers/ShapePropertiesModal";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import ModalImageDetails from "@/components/extensive/Modal/ModalImageDetails";
import { useBoundingBox } from "@/connections/BoundingBox";
import { LAYERS_NAMES, layersList } from "@/constants/layers";
import { DELETED_POLYGONS } from "@/constants/statuses";
import { useDashboardContext } from "@/context/dashboard.provider";
import { useLoading } from "@/context/loaderAdmin.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import {
  fetchGetV2SitePolygonUuidVersions,
  fetchGetV2TerrafundPolygonGeojsonUuid,
  useDeleteV2FilesUUID,
  usePatchV2MediaProjectProjectMediaUuid,
  usePostV2ExportImage,
  usePostV2GeometryUUIDNewVersion,
  usePutV2TerrafundPolygonUuid
} from "@/generated/apiComponents";
import { SitePolygonsDataResponse } from "@/generated/apiSchemas";
import { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useOnMount } from "@/hooks/useOnMount";
import { useValueChanged } from "@/hooks/useValueChanged";
import Log from "@/utils/log";

import { AdminPopup } from "./components/AdminPopup";
import { DashboardPopup } from "./components/DashboardPopup";
import { PopupMobile } from "./components/PopupMobile";
import { BBox } from "./GeoJSON";
import type { TooltipType } from "./Map.d";
import CheckIndividualPolygonControl from "./MapControls/CheckIndividualPolygonControl";
import CheckPolygonControl from "./MapControls/CheckPolygonControl";
import EditControl from "./MapControls/EditControl";
import EmptyStateDisplay from "./MapControls/EmptyStateDisplay";
import { FilterControl } from "./MapControls/FilterControl";
import ImageCheck from "./MapControls/ImageCheck";
import ImageControl from "./MapControls/ImageControl";
import PolygonCheck from "./MapControls/PolygonCheck";
import { PolygonHandler } from "./MapControls/PolygonHandler";
import PolygonModifier from "./MapControls/PolygonModifier";
import ProcessBulkPolygonsControl from "./MapControls/ProcessBulkPolygonsControl";
import { StyleControl } from "./MapControls/StyleControl";
import TrashButton from "./MapControls/TrashButton";
import { MapStyle } from "./MapControls/types";
import ViewImageCarousel from "./MapControls/ViewImageCarousel";
import { ZoomControl } from "./MapControls/ZoomControl";
import {
  addBorderCountry,
  addBorderLandscape,
  addDeleteLayer,
  addFilterOnLayer,
  addGeojsonToDraw,
  addMarkerAndZoom,
  addMediaSourceAndLayer,
  addPopupsToMap,
  addSourcesToLayers,
  drawTemporaryPolygon,
  removeBorderCountry,
  removeBorderLandscape,
  removeMediaLayer,
  removePopups,
  setMapStyle,
  startDrawing,
  stopDrawing,
  zoomToBbox
} from "./utils";

interface LegendItem {
  color: string;
  text: string;
  uuid: string;
}

export type DashboardGetProjectsData = {
  uuid?: string;
  name?: string;
  lat?: number;
  long?: number;
};

interface MapProps extends Omit<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "onError"> {
  geojson?: any;
  imageLayerGeojson?: any;
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
  setPolygonFromMap?: React.Dispatch<React.SetStateAction<{ uuid: string; isOpen: boolean }>>;
  polygonFromMap?: { uuid: string; isOpen: boolean };
  record?: any;
  showPopups?: boolean;
  showLegend?: boolean;
  mapFunctions?: any;
  tooltipType?: TooltipType;
  sitePolygonData?: SitePolygonsDataResponse;
  polygonsExists?: boolean;
  shouldBboxZoom?: boolean;
  modelFilesData?: MediaDto[];
  formMap?: boolean;
  pdView?: boolean;
  location?: LngLat;
  isDashboard?: "dashboard" | "modal" | undefined;
  entityData?: any;
  imageGalleryRef?: React.RefObject<HTMLDivElement>;
  showImagesButton?: boolean;
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
}

export const MapEditingContext = createContext({
  isEditing: false,
  setIsEditing: (value: boolean) => {}
});

export const MapContainer = ({
  onError: _onError,
  editable,
  geojson,
  imageLayerGeojson,
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
  showImagesButton,
  setIsLoadingDelayedJob,
  isLoadingDelayedJob,
  setAlertTitle,
  showViewGallery = true,
  legendPosition,
  ...props
}: MapProps) => {
  const [showMediaPopups, setShowMediaPopups] = useState<boolean>(true);
  const [sourcesAdded, setSourcesAdded] = useState<boolean>(false);
  const [viewImages, setViewImages] = useState(false);
  const [currentStyle, setCurrentStyle] = useState(isDashboard ? MapStyle.Street : MapStyle.Satellite);
  const [isEditing, setIsEditing] = useState(false);
  const [isDownloadingPolygons, setIsDownloadingPolygons] = useState(false);

  const {
    polygonsData,
    polygonsCentroids,
    bbox,
    setPolygonFromMap,
    polygonFromMap,
    sitePolygonData,
    selectedCountry,
    selectedLandscapes,
    projectUUID,
    setLoader
  } = props;
  const isMobile = useMediaQuery("(max-width: 1200px)");

  const [mobilePopupData, setMobilePopupData] = useState<any>(null);
  const context = useSitePolygonData();
  const contextMapArea = useMapAreaContext();
  const dashboardContext = useDashboardContext();
  const { setFilters, dashboardCountries } = dashboardContext ?? {};
  const { updateSingleSitePolygonData } = context ?? {};
  const t = useT();
  const { mutateAsync } = usePostV2ExportImage();
  const { showLoader, hideLoader } = useLoading();
  const router = useRouter();
  const { openModal, closeModal } = useModalContext();
  const { mutateAsync: updateIsCoverAsync } = usePatchV2MediaProjectProjectMediaUuid();
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
  const { mutateAsync: deleteFile } = useDeleteV2FilesUUID({
    onSuccess() {
      setShouldRefetchMediaData(true);
    }
  });
  if (!mapFunctions) {
    return null;
  }
  const { map, mapContainer, draw, onCancel, styleLoaded, initMap, setStyleLoaded, setChangeStyle, changeStyle } =
    mapFunctions;

  const polygonBbox = useBoundingBox(
    entityData?.entityName == "project-pitch"
      ? { projectPitchUuid: entityData?.entityUUID }
      : { polygonUuid: polygonFromMap?.uuid }
  );

  useOnMount(() => {
    initMap(!!isDashboard);
    return () => {
      if (map.current) {
        setStyleLoaded(false);
        map.current.remove();
        map.current = null;
      }
    };
  });

  useEffect(() => {
    if (!map) return;
    if (location && location.lat !== 0 && location.lng !== 0) {
      addMarkerAndZoom(map.current, location);
    }
  }, [map, location]);

  useValueChanged(isUserDrawingEnabled, () => {
    if (map?.current && draw?.current) {
      if (isUserDrawingEnabled) {
        startDrawing(draw.current, map.current);
        if (formMap && polygonFromMap?.uuid) {
          handleAddGeojsonToDraw(polygonFromMap?.uuid);
        }
      } else {
        stopDrawing(draw.current, map.current);
      }
    }
  });

  useEffect(() => {
    if (map?.current && (isDashboard || !_.isEmpty(polygonsData))) {
      const currentMap = map.current as mapboxgl.Map;
      const setupMap = () => {
        const zoomFilter = isDashboard ? 9 : undefined;
        addSourcesToLayers(currentMap, polygonsData, centroids, zoomFilter, isDashboard, polygonsCentroids);
        setChangeStyle(true);
        setSourcesAdded(true);

        if (showPopups) {
          addPopupsToMap(
            currentMap,
            isDashboard ? DashboardPopup : AdminPopup,
            setPolygonFromMap,
            sitePolygonData,
            tooltipType,
            editPolygonSelected,
            setEditPolygon,
            draw.current,
            isDashboard,
            setFilters,
            dashboardCountries,
            setLoader,
            selectedCountry,
            isMobile || isDashboard ? setMobilePopupData : undefined
          );
        }
      };

      setSourcesAdded(false);

      if (currentMap.isStyleLoaded()) {
        setupMap();
      } else {
        currentMap.once("idle", () => {
          setupMap();
        });
      }
    }
  }, [
    sitePolygonData,
    polygonsCentroids,
    polygonsData,
    showPopups,
    centroids,
    styleLoaded,
    dashboardCountries,
    draw,
    editPolygonSelected,
    isDashboard,
    isMobile,
    map,
    selectedCountry,
    setChangeStyle,
    setEditPolygon,
    setFilters,
    setLoader,
    setPolygonFromMap,
    tooltipType
  ]);

  useValueChanged(currentStyle, () => {
    if (currentStyle) {
      setChangeStyle(false);
    }
  });

  useValueChanged(changeStyle, () => {
    if (!changeStyle) {
      setStyleLoaded(false);
    }
  });

  useEffect(() => {
    if (bbox && map.current && shouldBboxZoom) {
      zoomToBbox(bbox, map.current, hasControls);
    }
  }, [bbox, map, hasControls, shouldBboxZoom]);

  useEffect(() => {
    if (!map.current || !sourcesAdded) return;
    const setupBorders = () => {
      if (selectedCountry) {
        addBorderCountry(map.current, selectedCountry);
      } else {
        removeBorderCountry(map.current);
      }
    };
    if (map.current.isStyleLoaded()) {
      setupBorders();
    } else {
      map.current.once("render", () => {
        setupBorders();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry, styleLoaded, sourcesAdded]);
  useEffect(() => {
    if (!map.current || !sourcesAdded) return;
    const setupBorders = () => {
      if (selectedLandscapes && selectedLandscapes.length > 0) {
        addBorderLandscape(map.current, selectedLandscapes);
      } else {
        removeBorderLandscape(map.current);
      }
    };
    if (map.current.isStyleLoaded()) {
      setupBorders();
    } else {
      map.current.once("render", () => {
        setupBorders();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLandscapes, styleLoaded, sourcesAdded]);
  useEffect(() => {
    if (!map.current || !projectUUID) return;
    if (map.current.isStyleLoaded()) {
      setMapStyle(MapStyle.Satellite, map.current, setCurrentStyle, currentStyle);
    } else {
      map.current.once("render", () => {
        setMapStyle(MapStyle.Satellite, map.current, setCurrentStyle, currentStyle);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectUUID, styleLoaded]);

  useEffect(() => {
    const projectUUID = router.query.uuid as string;
    const isProjectPath = router.isReady && router.asPath.includes("project");

    const handleDelete = (id: string) => {
      deleteFile({ pathParams: { uuid: id } });
      closeModal(ModalId.DELETE_IMAGE);
    };

    const openModalImageDetail = (data: MediaDto) => {
      openModal(
        ModalId.MODAL_IMAGE_DETAIL,
        <ModalImageDetails
          title="IMAGE DETAILS"
          data={data}
          entityData={entityData}
          onClose={() => closeModal(ModalId.MODAL_IMAGE_DETAIL)}
          reloadGalleryImages={() => {
            setShouldRefetchMediaData(true);
          }}
          handleDelete={handleDelete}
        />,
        true
      );
    };

    const setImageCover = async (uuid: string) => {
      const result = await updateIsCoverAsync({
        pathParams: { project: projectUUID, mediaUuid: uuid }
      });
      if (result) {
        openNotification("success", t("Success!"), t("Image set as cover successfully"));
        setShouldRefetchMediaData(true);
      } else {
        openNotification("error", t("Error!"), t("Failed to set image as cover"));
      }
    };

    const handleDownload = async (uuid: string, file_name: string): Promise<void> => {
      showLoader();
      try {
        const response = await mutateAsync({
          body: {
            uuid: uuid
          }
        });

        if (!response) {
          Log.error("No response received from the server.");
          openNotification("error", t("Error!"), t("No response received from the server."));
          return;
        }

        const blob = new Blob([response], { type: "image/jpeg" });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = file_name || "image.jpg";
        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);
        hideLoader();
        openNotification("success", t("Success!"), t("Image downloaded successfully"));
      } catch (error) {
        Log.error("Download error:", error);
        hideLoader();
      }
    };

    if (map?.current && styleLoaded && props?.modelFilesData) {
      if (showMediaPopups) {
        addMediaSourceAndLayer(
          map.current,
          props?.modelFilesData,
          setImageCover,
          handleDownload,
          handleDelete,
          openModalImageDetail,
          isProjectPath
        );
      } else {
        removePopups("MEDIA");
        removeMediaLayer(map.current);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.modelFilesData, showMediaPopups, styleLoaded]);

  useValueChanged(showMediaPopups, () => {
    if (geojson && map.current && draw.current) {
      addGeojsonToDraw(geojson, "", () => {}, draw.current, map.current);
    }
  });

  function handleAddGeojsonToDraw(polygonuuid: string) {
    if (polygonsData && map.current && draw.current) {
      const currentMap = map.current;
      const newPolygonData = JSON.parse(JSON.stringify(polygonsData));
      const statuses = ["submitted", "approved", "need-more-info", "draft", "form-polygons"];
      statuses.forEach(status => {
        if (newPolygonData[status]) {
          newPolygonData[status] = newPolygonData[status].filter((feature: string) => feature !== polygonuuid);
        }
      });
      addFilterOnLayer(
        layersList.find(layer => layer.name === LAYERS_NAMES.POLYGON_GEOMETRY),
        newPolygonData,
        currentMap
      );
    }
  }

  useEffect(() => {
    if (selectedPolygonsInCheckbox && map.current && styleLoaded) {
      const newPolygonData = {
        [DELETED_POLYGONS]: selectedPolygonsInCheckbox
      };
      addDeleteLayer(
        layersList.find(layer => layer.name === LAYERS_NAMES.DELETED_GEOMETRIES),
        map.current as mapboxgl.Map,
        newPolygonData
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPolygonsInCheckbox, styleLoaded]);

  const handleEditPolygon = async () => {
    removePopups("POLYGON");
    if (polygonFromMap?.isOpen && polygonFromMap?.uuid !== "") {
      const polygonuuid = polygonFromMap?.uuid as string;
      const polygonGeojson = await fetchGetV2TerrafundPolygonGeojsonUuid({
        pathParams: { uuid: polygonuuid }
      });
      if (map.current && draw.current && polygonGeojson) {
        addGeojsonToDraw(polygonGeojson.geojson, polygonuuid, () => handleAddGeojsonToDraw(polygonuuid), draw.current);
      }
    }
  };

  const downloadGeoJsonPolygon = async () => {
    setIsDownloadingPolygons(true);

    try {
      let polygonsToDownload: string[] = [];

      // Check if any polygons are selected via checkbox
      if (selectedPolygonsInCheckbox && selectedPolygonsInCheckbox.length > 0) {
        polygonsToDownload = selectedPolygonsInCheckbox;
      } else if (polygonsData) {
        // Fallback to all polygons from all statuses in polygonsData
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

      // Fetch all polygon GeoJSON data
      const polygonPromises = polygonsToDownload.map(uuid =>
        fetchGetV2TerrafundPolygonGeojsonUuid({ pathParams: { uuid } })
      );

      const polygonResults = await Promise.all(polygonPromises);

      // Create a combined FeatureCollection
      const features: any[] = [];
      polygonResults.forEach((result, index) => {
        if (result?.geojson?.coordinates) {
          // Add each feature from the polygon's geojson
          result.geojson.coordinates.forEach((feature: any) => {
            // Add the polygon UUID as a property for identification
            features.push({
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [feature]
              },
              properties: {
                polygon_uuid: polygonsToDownload[index]
              }
            });
          });
        }
      });

      const combinedGeojson = {
        type: "FeatureCollection",
        features: features
      };

      const blob = new Blob([JSON.stringify(combinedGeojson, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `polygons-${new Date().toISOString().slice(0, 10)}.geojson`;
      link.click();
      URL.revokeObjectURL(url);

      openNotification("success", t("Success"), t(`Successfully downloaded ${polygonsToDownload.length} polygon(s).`));
    } catch (error) {
      Log.error("Download error:", error);
      openNotification("error", t("Error"), t("Failed to download polygons. Please try again."));
    } finally {
      setIsDownloadingPolygons(false);
    }
  };

  const { mutateAsync: updateGeometry } = usePutV2TerrafundPolygonUuid();
  const { mutateAsync: createGeometry } = usePostV2GeometryUUIDNewVersion();

  const onSaveEdit = async () => {
    if (map.current && draw.current) {
      const geojson = draw.current.getAll();
      if (geojson) {
        if (polygonFromMap?.uuid) {
          !pdView && onCancelEdit();
          const feature = geojson.features[0];
          try {
            if (!pdView) {
              showLoader();
              await createGeometry({
                body: { geometry: JSON.stringify(feature) as any },
                pathParams: { uuid: polygonFromMap?.uuid }
              });
              const selectedPolygon = sitePolygonData?.find(item => item.poly_id === polygonFromMap?.uuid);
              const polygonVersionData = (await fetchGetV2SitePolygonUuidVersions({
                pathParams: { uuid: selectedPolygon?.primary_uuid as string }
              })) as SitePolygonsDataResponse;

              const polygonActive = polygonVersionData?.find(item => item.is_active);
              if (selectedPolygon?.uuid) {
                await updateSingleSitePolygonData?.(selectedPolygon.uuid, polygonActive);
              }
              setPolygonFromMap?.({ isOpen: true, uuid: polygonActive?.poly_id as string });
              setStatusSelectedPolygon?.(polygonActive?.status as string);
            } else {
              await updateGeometry({
                body: { geometry: JSON.stringify(feature) },
                pathParams: { uuid: polygonFromMap?.uuid }
              });
            }
            onCancel(polygonsData);
            addSourcesToLayers(map.current, polygonsData, centroids);
            setShouldRefetchPolygonData(true);
            openNotification(
              "success",
              t("Success"),
              pdView ? t("Geometry updated successfully.") : t("Site polygon version created successfully.")
            );
          } catch (e: any) {
            openNotification("error", t("Error"), e?.message || t("Please try again later."));
          } finally {
            hideLoader();
          }
        }
      }
    }
  };

  const onCancelEdit = () => {
    onCancel(polygonsData);
  };

  const addGeometryVersion = async () => {
    const polygonGeojson = await fetchGetV2TerrafundPolygonGeojsonUuid({
      pathParams: { uuid: selectedPolyVersion?.poly_id as string }
    });
    drawTemporaryPolygon(polygonGeojson?.geojson, () => {}, map.current, selectedPolyVersion);
  };

  useValueChanged(selectedPolyVersion, () => {
    if (map?.current?.getSource("temp-polygon-source") || map?.current?.getLayer("temp-polygon-source-line")) {
      map?.current.removeLayer("temp-polygon-source-line");
      map?.current?.removeLayer("temp-polygon-source");
      map?.current?.removeSource("temp-polygon-source");
    }

    if (selectedPolyVersion) {
      addGeometryVersion();
    }
  });

  useEffect(() => {
    if (polygonFromMap?.isOpen && polygonFromMap?.uuid && polygonBbox && map.current) {
      zoomToBbox(polygonBbox as BBox, map.current, true);
    }
  }, [polygonFromMap, polygonBbox, map]);

  return (
    <MapEditingContext.Provider value={{ isEditing, setIsEditing }}>
      <div ref={mapContainer} className={twMerge("h-[500px] wide:h-[700px]", className)} id="map-container">
        <ControlGroup position="top-right">
          <button
            type="button"
            className="shadow-lg z-10 flex h-10 w-56 items-center justify-center gap-2 rounded-lg bg-white p-2.5 text-darkCustom-100 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
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
        <When condition={hasControls}>
          <When condition={polygonFromMap?.isOpen && !formMap}>
            <ControlGroup position={siteData ? "top-centerSite" : "top-center"}>
              <EditControl onClick={handleEditPolygon} onSave={onSaveEdit} onCancel={onCancelEdit} />
            </ControlGroup>
          </When>
          <When condition={selectedPolygonsInCheckbox.length}>
            <ControlGroup position={siteData ? "top-centerSite" : "top-centerPolygonsInCheckbox"}>
              <ProcessBulkPolygonsControl
                entityData={record}
                setIsLoadingDelayedJob={setIsLoadingDelayedJob!}
                isLoadingDelayedJob={isLoadingDelayedJob!}
                setAlertTitle={setAlertTitle!}
              />
            </ControlGroup>
          </When>
          <When condition={isDashboard !== "dashboard"}>
            <ControlGroup position="top-right">
              <StyleControl map={map.current} currentStyle={currentStyle} setCurrentStyle={setCurrentStyle} />
            </ControlGroup>
          </When>
          <ControlGroup position="top-right" className="top-21">
            <ZoomControl map={map.current} />
          </ControlGroup>

          <When condition={!!record?.uuid && validationType === "bulkValidation"}>
            <ControlGroup position={siteData ? "top-left-site" : "top-left"}>
              <CheckPolygonControl
                siteRecord={record}
                polygonCheck={!siteData}
                setIsLoadingDelayedJob={setIsLoadingDelayedJob!}
                isLoadingDelayedJob={isLoadingDelayedJob!}
                setAlertTitle={setAlertTitle!}
              />
            </ControlGroup>
          </When>
          <When condition={formMap}>
            <ControlGroup position="top-left">
              <PolygonHandler />
            </ControlGroup>
            <ControlGroup position="top-right" className="top-64">
              <PolygonModifier
                polygonFromMap={polygonFromMap}
                onClick={handleEditPolygon}
                onSave={onSaveEdit}
                onCancel={onCancelEdit}
              />
            </ControlGroup>
          </When>
          <When condition={!!status && validationType === "individualValidation"}>
            <ControlGroup position={siteData ? "top-left-site" : "top-left"}>
              <CheckIndividualPolygonControl viewRequestSuport={!siteData} />
            </ControlGroup>
          </When>
          <When condition={!!viewImages}>
            <ControlGroup position={siteData ? "bottom-left-site" : "bottom-left"}>
              <ImageControl viewImages={viewImages} setViewImages={setViewImages} />
            </ControlGroup>
          </When>
          <When condition={editPolygon}>
            <ControlGroup position="top-right" className="top-64">
              <button type="button" className="rounded-lg bg-white p-2.5 text-primary hover:text-primary ">
                <Icon name={IconNames.EDIT} className="h-5 w-5 lg:h-6 lg:w-6" />
              </button>
            </ControlGroup>
          </When>
          <When condition={!editable && !viewImages}>
            <ControlGroup position={siteData ? "bottom-left-site" : "bottom-left"}></ControlGroup>
          </When>
          <ControlGroup position="top-right" className="top-48">
            <button
              type="button"
              className="rounded-lg bg-white p-2.5 text-darkCustom-100 hover:bg-neutral-200 "
              onClick={() => {
                bbox && map.current && zoomToBbox(bbox, map.current, hasControls);
              }}
            >
              <Icon name={IconNames.IC_EARTH_MAP} className="h-5 w-5 lg:h-6 lg:w-6" />
            </button>
          </ControlGroup>
          <When condition={isEditing}>
            <ControlGroup position="top-right" className="top-[249px]">
              <TrashButton onClick={mapFunctions?.handleTrashDelete} />
            </ControlGroup>
          </When>
          <When condition={!formMap && showViewGallery}>
            <ControlGroup position="bottom-right" className="bottom-8 flex flex-row gap-2 mobile:hidden">
              <When condition={showImagesButton}>
                <ImageCheck showMediaPopups={showMediaPopups} setShowMediaPopups={setShowMediaPopups} />
              </When>
              {isDashboard === "dashboard" ? (
                <StyleControl map={map.current} currentStyle={currentStyle} setCurrentStyle={setCurrentStyle} />
              ) : (
                isDashboard !== "modal" && (
                  <ViewImageCarousel modelFilesData={props?.modelFilesData ?? []} imageGalleryRef={imageGalleryRef} />
                )
              )}
            </ControlGroup>
          </When>
        </When>
        <When condition={isDashboard === "dashboard"}>
          <ControlGroup position="top-left" className="mt-1 flex flex-row gap-2">
            <When condition={isDashboard !== "dashboard"}>
              <ViewImageCarousel
                className="py-2 lg:pb-[11.5px] lg:pt-[11.5px]"
                modelFilesData={props?.modelFilesData ?? []}
                imageGalleryRef={imageGalleryRef}
              />
            </When>
          </ControlGroup>
        </When>
        <When condition={showLegend}>
          <ControlGroup position={siteData ? "bottom-left-site" : legendPosition ?? "bottom-left"}>
            <FilterControl />
          </ControlGroup>
        </When>
        <When condition={captureAdditionalPolygonProperties}>
          <ControlGroup position="bottom-right"></ControlGroup>
        </When>
        <When condition={polygonChecks}>
          <ControlGroup position="bottom-left" className="bottom-13">
            <PolygonCheck />
          </ControlGroup>
        </When>
        <When condition={!polygonsExists}>
          <EmptyStateDisplay />
        </When>
        <When condition={(isMobile || isDashboard) && mobilePopupData !== null}>
          <PopupMobile
            event={mobilePopupData}
            onClose={() => setMobilePopupData(null)}
            variant={isMobile ? "mobile" : "desktop"}
          />
        </When>
      </div>
    </MapEditingContext.Provider>
  );
};

export default MapContainer;
