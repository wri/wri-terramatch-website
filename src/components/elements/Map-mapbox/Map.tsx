import "mapbox-gl/dist/mapbox-gl.css";

import { useT } from "@transifex/react";
import _ from "lodash";
import mapboxgl, { LngLat } from "mapbox-gl";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { DetailedHTMLProps, HTMLAttributes, useState } from "react";
import { When } from "react-if";
import { twMerge } from "tailwind-merge";
import { ValidationError } from "yup";

import ControlGroup from "@/components/elements/Map-mapbox/components/ControlGroup";
import { AdditionalPolygonProperties } from "@/components/elements/Map-mapbox/MapLayers/ShapePropertiesModal";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import ModalImageDetails from "@/components/extensive/Modal/ModalImageDetails";
import { LAYERS_NAMES, layersList } from "@/constants/layers";
import { DELETED_POLYGONS } from "@/constants/statuses";
import { useLoading } from "@/context/loaderAdmin.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import {
  fetchGetV2SitePolygonUuidVersions,
  fetchGetV2TerrafundPolygonBboxUuid,
  fetchGetV2TerrafundPolygonGeojsonUuid,
  GetV2MODELUUIDFilesResponse,
  useDeleteV2FilesUUID,
  usePatchV2MediaProjectProjectMediaUuid,
  usePostV2ExportImage,
  usePostV2GeometryUUIDNewVersion,
  usePutV2TerrafundPolygonUuid
} from "@/generated/apiComponents";
import { DashboardGetProjectsData, SitePolygonsDataResponse } from "@/generated/apiSchemas";

import { ImageGalleryItemData } from "../ImageGallery/ImageGalleryItem";
import { AdminPopup } from "./components/AdminPopup";
import { DashboardPopup } from "./components/DashboardPopup";
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
import { MapStyle } from "./MapControls/types";
import ViewImageCarousel from "./MapControls/ViewImageCarousel";
import { ZoomControl } from "./MapControls/ZoomControl";
import {
  addDeleteLayer,
  addFilterOnLayer,
  addGeojsonToDraw,
  addMarkerAndZoom,
  addMediaSourceAndLayer,
  addPopupsToMap,
  addSourcesToLayers,
  drawTemporaryPolygon,
  removeMediaLayer,
  removePopups,
  startDrawing,
  stopDrawing,
  zoomToBbox
} from "./utils";

mapboxgl.accessToken =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ||
  "pk.eyJ1IjoiM3NpZGVkY3ViZSIsImEiOiJjam55amZrdjIwaWY3M3FueDAzZ3ZjeGR2In0.DhSsxs-8XhbTgoVmFcs94Q";

interface LegendItem {
  color: string;
  text: string;
  uuid: string;
}

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
  modelFilesData?: GetV2MODELUUIDFilesResponse["data"];
  formMap?: boolean;
  pdView?: boolean;
  location?: LngLat;
  isDashboard?: "dashboard" | "modal" | undefined;
  entityData?: any;
  imageGalleryRef?: React.RefObject<HTMLDivElement>;
  listViewProjects?: any;
  role?: any;
}

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
  ...props
}: MapProps) => {
  const [showMediaPopups, setShowMediaPopups] = useState<boolean>(true);
  const [viewImages, setViewImages] = useState(false);
  const [currentStyle, setCurrentStyle] = useState(isDashboard ? MapStyle.Street : MapStyle.Satellite);
  const { polygonsData, bbox, setPolygonFromMap, polygonFromMap, sitePolygonData } = props;
  const context = useSitePolygonData();
  const contextMapArea = useMapAreaContext();
  const { reloadSiteData } = context ?? {};
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

  useEffect(() => {
    initMap(isDashboard);
    return () => {
      if (map.current) {
        setStyleLoaded(false);
        map.current.remove();
        map.current = null;
      }
    };
  }, []);
  useEffect(() => {
    if (!map) return;
    if (location && location.lat !== 0 && location.lng !== 0) {
      addMarkerAndZoom(map.current, location);
    }
  }, [map, location]);

  useEffect(() => {
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
  }, [isUserDrawingEnabled]);

  useEffect(() => {
    if (map?.current && !_.isEmpty(polygonsData)) {
      const currentMap = map.current as mapboxgl.Map;
      const setupMap = () => {
        const zoomFilter = isDashboard ? 7 : undefined;
        addSourcesToLayers(currentMap, polygonsData, centroids, zoomFilter, listViewProjects);
        setChangeStyle(true);
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
            isDashboard
          );
        }
      };

      if (currentMap.isStyleLoaded()) {
        setupMap();
      } else {
        currentMap.once("styledata", setupMap);
      }
    }
  }, [sitePolygonData, polygonsData, showPopups, listViewProjects]);

  useEffect(() => {
    if (currentStyle) {
      setChangeStyle(false);
    }
  }, [currentStyle]);

  useEffect(() => {
    if (!changeStyle) {
      setStyleLoaded(false);
    }
  }, [changeStyle]);

  useEffect(() => {
    if (bbox && map.current && map && shouldBboxZoom) {
      zoomToBbox(bbox, map.current, hasControls);
    }
  }, [bbox]);

  useEffect(() => {
    const projectUUID = router.query.uuid as string;
    const isProjectPath = router.isReady && router.asPath.includes("project");

    const handleDelete = (id: string) => {
      deleteFile({ pathParams: { uuid: id } });
      closeModal(ModalId.DELETE_IMAGE);
    };

    const openModalImageDetail = (data: ImageGalleryItemData | any) => {
      const dataImage = {
        uuid: data.uuid!,
        fullImageUrl: data.file_url!,
        thumbnailImageUrl: data.file_url!,
        label: data.model_name,
        isPublic: data.is_public!,
        isGeotagged: true,
        isCover: data.is_cover,
        raw: { ...data, location: JSON.parse(data.location), created_date: data.created_date }
      };
      openModal(
        ModalId.MODAL_IMAGE_DETAIL,
        <ModalImageDetails
          title="IMAGE DETAILS"
          data={dataImage}
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
          console.error("No response received from the server.");
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
        console.error("Download error:", error);
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
  }, [props?.modelFilesData, showMediaPopups, styleLoaded]);

  useEffect(() => {
    if (geojson && map.current && draw.current) {
      addGeojsonToDraw(geojson, "", () => {}, draw.current, map.current);
    }
  }, [showMediaPopups]);

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
    if (selectedPolygonsInCheckbox && map.current && styleLoaded && map.current.isStyleLoaded()) {
      const newPolygonData = {
        [DELETED_POLYGONS]: selectedPolygonsInCheckbox
      };
      addDeleteLayer(
        layersList.find(layer => layer.name === LAYERS_NAMES.DELETED_GEOMETRIES),
        map.current as mapboxgl.Map,
        newPolygonData
      );
    }
  }, [selectedPolygonsInCheckbox]);

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

  const flyToPolygonBounds = async (poly_id: string) => {
    const bbox = await fetchGetV2TerrafundPolygonBboxUuid({ pathParams: { uuid: poly_id } });
    const bounds: any = bbox.bbox;
    if (!map.current) {
      return;
    }
    map.current.fitBounds(bounds, {
      padding: 100,
      linear: false
    });
  };

  const { mutate: updateGeometry } = usePutV2TerrafundPolygonUuid();
  const { mutate: createGeometry } = usePostV2GeometryUUIDNewVersion();

  const onSaveEdit = async () => {
    if (map.current && draw.current) {
      const geojson = draw.current.getAll();
      if (geojson) {
        if (polygonFromMap?.uuid) {
          !pdView && onCancelEdit();
          const feature = geojson.features[0];
          try {
            if (!pdView) {
              await createGeometry({
                body: { geometry: JSON.stringify(feature) as any },
                pathParams: { uuid: polygonFromMap?.uuid }
              });
              await reloadSiteData?.();
              const selectedPolygon = sitePolygonData?.find(item => item.poly_id === polygonFromMap?.uuid);
              const polygonVersionData = (await fetchGetV2SitePolygonUuidVersions({
                pathParams: { uuid: selectedPolygon?.primary_uuid as string }
              })) as SitePolygonsDataResponse;
              const polygonActive = polygonVersionData?.find(item => item.is_active);
              setPolygonFromMap?.({ isOpen: true, uuid: polygonActive?.poly_id as string });
              setStatusSelectedPolygon?.(polygonActive?.status as string);
              flyToPolygonBounds(polygonActive?.poly_id as string);
            } else {
              await updateGeometry({
                body: { geometry: JSON.stringify(feature) },
                pathParams: { uuid: polygonFromMap?.uuid }
              });
              await reloadSiteData?.();
            }
            onCancel(polygonsData);
            addSourcesToLayers(map.current, polygonsData, centroids);
            setShouldRefetchPolygonData(true);
            openNotification(
              "success",
              t("Success"),
              pdView ? t("Geometry updated successfully.") : t("Site polygon version created successfully.")
            );
          } catch (e) {
            openNotification("error", t("Error"), t("Please try again later."));
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

  useEffect(() => {
    if (map?.current?.getSource("temp-polygon-source") || map?.current?.getLayer("temp-polygon-source-line")) {
      map?.current.removeLayer("temp-polygon-source-line");
      map?.current?.removeLayer("temp-polygon-source");
      map?.current?.removeSource("temp-polygon-source");
    }

    if (selectedPolyVersion) {
      addGeometryVersion();
    }
  }, [selectedPolyVersion]);

  return (
    <div ref={mapContainer} className={twMerge("h-[500px] wide:h-[700px]", className)} id="map-container">
      <When condition={hasControls}>
        <When condition={polygonFromMap?.isOpen && !formMap}>
          <ControlGroup position={siteData ? "top-centerSite" : "top-center"}>
            <EditControl onClick={handleEditPolygon} onSave={onSaveEdit} onCancel={onCancelEdit} />
          </ControlGroup>
        </When>
        <When condition={selectedPolygonsInCheckbox.length}>
          <ControlGroup position={siteData ? "top-centerSite" : "top-centerPolygonsInCheckbox"}>
            <ProcessBulkPolygonsControl entityData={record} />
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
            <CheckPolygonControl siteRecord={record} polygonCheck={!siteData} />
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
            onClick={() => bbox && map.current && zoomToBbox(bbox, map.current, hasControls)}
          >
            <Icon name={IconNames.IC_EARTH_MAP} className="h-5 w-5 lg:h-6 lg:w-6" />
          </button>
        </ControlGroup>
        <When condition={!formMap}>
          <ControlGroup position="bottom-right" className="bottom-8 flex flex-row gap-2">
            <ImageCheck showMediaPopups={showMediaPopups} setShowMediaPopups={setShowMediaPopups} />
            {isDashboard === "dashboard" ? (
              <StyleControl map={map.current} currentStyle={currentStyle} setCurrentStyle={setCurrentStyle} />
            ) : (
              isDashboard !== "modal" && (
                <ViewImageCarousel modelFilesData={props?.modelFilesData} imageGalleryRef={imageGalleryRef} />
              )
            )}
          </ControlGroup>
        </When>
      </When>
      <When condition={showLegend}>
        <ControlGroup position={siteData ? "bottom-left-site" : "bottom-left"}>
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
    </div>
  );
};

export default MapContainer;
