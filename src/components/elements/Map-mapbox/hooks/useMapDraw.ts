import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { Map as MapboxMap } from "mapbox-gl";
import { MutableRefObject, useCallback, useEffect, useRef } from "react";

import { pruneBoundingBoxesCache } from "@/connections/BoundingBox";
import { loadListPolygonVersions } from "@/connections/PolygonVersion";
import { createVersionWithGeometry } from "@/connections/SitePolygons";
import { FORM_POLYGONS } from "@/constants/statuses";
import type { PolygonGeometryEditState } from "@/context/mapArea.provider";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { isProjectPitchesEntityName } from "@/helpers/entity";
import { useValueChanged } from "@/hooks/useValueChanged";
import ApiSlice from "@/store/apiSlice";
import Log from "@/utils/log";

import {
  addGeojsonToDraw,
  drawTemporaryPolygon,
  fetchPolygonGeometry,
  updatePolygonProjectGeometry
} from "../interactions/draw";
import { removePopups } from "../interactions/popups";
import { addSourcesToLayers } from "../layers/polygonLayers";
import { DashboardGetProjectsData, PolygonFromMapState } from "../Map.d";
import { applyMapDrawStatusStyles, isPolygonDrawStatus, PolygonDrawStatus } from "../mapStyle";
import { filterPolygonFromLayers } from "./useMapLayers";

type UseMapDrawParams = {
  map: MutableRefObject<MapboxMap | null>;
  draw: MutableRefObject<MapboxDraw | null>;
  isUserDrawingEnabled: boolean;
  formMap?: boolean;
  polygonFromMap?: PolygonFromMapState | null;
  polygonsData?: Record<string, string[]>;
  centroids?: DashboardGetProjectsData[];
  sitePolygonData?: SitePolygonLightDto[];
  selectedPolyVersion?: SitePolygonLightDto;
  onCancel: (polygonsData: any) => void;
  setPolygonFromMap?: any;
  reloadSiteData?: () => any;
  setShouldRefetchPolygonData?: (v: boolean) => void;
  setStatusSelectedPolygon?: (v: string) => void;
  statusSelectedPolygon?: string;
  setPolygonGeometryEdit?: (value: PolygonGeometryEditState | undefined) => void;
  t: (key: string) => string;
  showLoader: () => void;
  hideLoader: () => void;
  openNotification: (type: "success" | "error" | "warning", title: string, message?: any) => void;
};

export function useMapDraw({
  map,
  draw,
  isUserDrawingEnabled,
  formMap,
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
  statusSelectedPolygon,
  setPolygonGeometryEdit,
  t,
  showLoader,
  hideLoader,
  openNotification
}: UseMapDrawParams) {
  const originalGeometryRef = useRef<GeoJSON.Geometry | null>(null);

  const serializeGeometry = useCallback((geometry: GeoJSON.Geometry | null | undefined) => {
    return geometry == null ? "" : JSON.stringify(geometry);
  }, []);

  useEffect(() => {
    const currentMap = map.current;
    if (currentMap == null || setPolygonGeometryEdit == null) return;

    const updateCurrentGeometry = () => {
      const polygonUuid = polygonFromMap?.uuid;
      if (polygonUuid == null || polygonUuid === "") return;

      const currentGeometry = draw.current?.getAll().features[0]?.geometry as GeoJSON.Geometry | undefined;
      if (currentGeometry == null) return;

      const originalGeometry = originalGeometryRef.current;
      setPolygonGeometryEdit({
        polygonUuid,
        originalGeometry,
        currentGeometry,
        isDirty: serializeGeometry(originalGeometry) !== serializeGeometry(currentGeometry)
      });
    };

    currentMap.on("draw.update", updateCurrentGeometry);
    currentMap.on("draw.delete", updateCurrentGeometry);

    return () => {
      currentMap.off("draw.update", updateCurrentGeometry);
      currentMap.off("draw.delete", updateCurrentGeometry);
    };
  }, [draw, map, polygonFromMap?.uuid, serializeGeometry, setPolygonGeometryEdit]);

  useEffect(() => {
    if (polygonFromMap?.isOpen === true) return;
    if (draw.current == null) return;

    onCancel(polygonsData);
    originalGeometryRef.current = null;
    setPolygonGeometryEdit?.(undefined);
  }, [draw, onCancel, polygonFromMap?.isOpen, polygonsData, setPolygonGeometryEdit]);

  useValueChanged(isUserDrawingEnabled, () => {
    if (map.current == null || draw.current == null) return;
    if (isUserDrawingEnabled) {
      applyMapDrawStatusStyles(map.current);
      draw.current.changeMode("draw_polygon");
      map.current.getCanvas().style.cursor = "crosshair";
      if (formMap && polygonFromMap?.uuid) {
        filterPolygonFromLayers(polygonFromMap.uuid, polygonsData, map.current);
      }
    } else {
      draw.current.changeMode("simple_select");
      map.current.getCanvas().style.cursor = "auto";
    }
  });

  useValueChanged(selectedPolyVersion, () => {
    if (map.current == null) return;
    const m = map.current;
    if (m.getLayer("temp-polygon-source-line") != null) m.removeLayer("temp-polygon-source-line");
    if (m.getLayer("temp-polygon-source") != null) m.removeLayer("temp-polygon-source");
    if (m.getSource("temp-polygon-source") != null) m.removeSource("temp-polygon-source");
    const polygonUuid = selectedPolyVersion?.polygonUuid ?? null;
    if (selectedPolyVersion != null && polygonUuid != null) {
      fetchPolygonGeometry(polygonUuid).then(geometry => {
        if (geometry != null && map.current != null) {
          drawTemporaryPolygon(geometry, () => {}, map.current, selectedPolyVersion);
        }
      });
    }
  });

  const handleEditPolygon = useCallback(async () => {
    if (map.current == null) return;
    removePopups(map.current, "POLYGON");
    if (!polygonFromMap?.isOpen || polygonFromMap?.uuid === "") return;

    const polygonuuid = polygonFromMap.uuid;
    filterPolygonFromLayers(polygonuuid, polygonsData, map.current);
    const isProjectPolygon = isProjectPitchesEntityName(polygonFromMap?.entityName ?? "");
    const projectPitchUuid = polygonFromMap?.projectPitchUuid;
    const rawStatus =
      sitePolygonData?.find(polygon => polygon.polygonUuid === polygonuuid)?.status ?? statusSelectedPolygon;
    const polygonStatus: PolygonDrawStatus | undefined = isPolygonDrawStatus(rawStatus) ? rawStatus : undefined;

    try {
      const geometry = await fetchPolygonGeometry(polygonuuid, true, isProjectPolygon ? projectPitchUuid : undefined);
      if (geometry == null) {
        openNotification("error", t("Error"), t("No geometry found for polygon. The polygon may have been deleted."));
        return;
      }
      if (map.current != null && draw.current != null) {
        originalGeometryRef.current = geometry;
        setPolygonGeometryEdit?.({
          polygonUuid: polygonuuid,
          originalGeometry: geometry,
          currentGeometry: geometry,
          isDirty: false
        });
        addGeojsonToDraw(geometry, polygonuuid, () => {}, draw.current, map.current, polygonStatus);
      }
    } catch (error) {
      Log.error("Error fetching polygon geometry:", error);
      openNotification("error", t("Error"), t("Failed to load polygon geometry. Please try again."));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    polygonFromMap?.isOpen,
    polygonFromMap?.uuid,
    polygonFromMap?.entityName,
    polygonFromMap?.projectPitchUuid,
    polygonsData,
    sitePolygonData,
    statusSelectedPolygon
  ]);

  const onSaveEdit = useCallback(async () => {
    if (map.current == null || draw.current == null) return;
    const geojson = draw.current.getAll();
    if (geojson == null || polygonFromMap?.uuid == null || polygonFromMap.uuid === "") return;

    const feature = geojson.features[0];

    if (formMap) {
      try {
        showLoader();
        const projectPitchUuid = polygonFromMap.projectPitchUuid;
        await updatePolygonProjectGeometry([feature], polygonFromMap.uuid, reloadSiteData);

        if (draw.current) draw.current.deleteAll();
        await new Promise(resolve => setTimeout(resolve, 100));

        const isProjectPolygon = isProjectPitchesEntityName(polygonFromMap?.entityName ?? "");
        const updatedGeometry = await fetchPolygonGeometry(
          polygonFromMap.uuid,
          true,
          isProjectPolygon ? projectPitchUuid : undefined
        );
        if (updatedGeometry != null && map.current != null) {
          addSourcesToLayers(map.current, { [FORM_POLYGONS]: [polygonFromMap.uuid] }, centroids);
        }
        pruneBoundingBoxesCache();
        openNotification("success", t("Success"), t("Project polygon updated successfully."));
      } catch (e: any) {
        openNotification("error", t("Error"), e?.message ?? t("Please try again later."));
      } finally {
        hideLoader();
      }
      return;
    }

    const selectedPolygon = sitePolygonData?.find(item => item.polygonUuid === polygonFromMap.uuid);
    if (selectedPolygon?.primaryUuid == null) {
      openNotification("error", t("Error"), t("Missing polygon information"));
      return;
    }

    try {
      showLoader();
      const siteId = selectedPolygon.siteId;
      if (siteId == null || siteId === "") throw new Error("Missing siteId for polygon");

      await createVersionWithGeometry(selectedPolygon.primaryUuid, "Updated geometry", {
        type: "Feature",
        geometry: feature.geometry,
        properties: { siteId }
      });

      if (selectedPolygon.polygonUuid != null) {
        await ApiSlice.pruneCache("sitePolygons", [selectedPolygon.polygonUuid]);
      }
      pruneBoundingBoxesCache();

      const polygonVersionResponse = await loadListPolygonVersions({ uuid: selectedPolygon.primaryUuid });
      const polygonActive = polygonVersionResponse?.data?.find((item: SitePolygonLightDto) => item.isActive);

      reloadSiteData?.();
      setPolygonFromMap?.({ isOpen: true, uuid: polygonActive?.polygonUuid as string });
      setStatusSelectedPolygon?.(polygonActive?.status as string);
      draw.current?.deleteAll();
      originalGeometryRef.current = null;
      setPolygonGeometryEdit?.(undefined);

      setShouldRefetchPolygonData?.(true);
      openNotification("success", t("Success"), t("Site polygon version created successfully."));
    } catch (e: any) {
      openNotification("error", t("Error"), e?.message ?? t("Please try again later."));
    } finally {
      hideLoader();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    polygonFromMap?.uuid,
    polygonFromMap?.entityName,
    polygonFromMap?.projectPitchUuid,
    formMap,
    sitePolygonData,
    centroids
  ]);

  const onCancelEdit = useCallback(() => {
    onCancel(polygonsData);
    originalGeometryRef.current = null;
    setPolygonGeometryEdit?.(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polygonsData, setPolygonGeometryEdit]);

  return { handleEditPolygon, onSaveEdit, onCancelEdit };
}
