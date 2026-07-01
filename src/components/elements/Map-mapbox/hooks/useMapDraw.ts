import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useT } from "@transifex/react";
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
import { TranslatedText } from "@/i18n/types";
import ApiSlice from "@/store/apiSlice";
import { getPolygonAnalyticsContext, trackPolygonEvent } from "@/utils/ga4";
import Log from "@/utils/log";

import {
  dispatchPolygonDrawCanUndoChanged,
  isPolygonDrawUndoShortcut,
  shouldIgnorePolygonDrawUndoShortcut,
  UNDO_POLYGON_DRAW_EVENT
} from "../interactions/draftDrawEvents";
import {
  addGeojsonToDraw,
  applyMapDrawingCursor,
  drawTemporaryPolygon,
  fetchPolygonGeometry,
  resetMapDrawingCursor,
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
  t: typeof useT;
  showLoader: () => void;
  hideLoader: () => void;
  openNotification: (type: "success" | "error" | "warning", title: TranslatedText, message?: any) => void;
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
  const geometryHistoryRef = useRef<GeoJSON.Geometry[]>([]);
  const isApplyingGeometryUndoRef = useRef(false);

  const serializeGeometry = useCallback((geometry: GeoJSON.Geometry | null | undefined) => {
    return geometry == null ? "" : JSON.stringify(geometry);
  }, []);

  const cloneGeometry = useCallback(
    (geometry: GeoJSON.Geometry): GeoJSON.Geometry => {
      return JSON.parse(serializeGeometry(geometry)) as GeoJSON.Geometry;
    },
    [serializeGeometry]
  );

  const syncGeometryEditCanUndo = useCallback(() => {
    dispatchPolygonDrawCanUndoChanged(geometryHistoryRef.current.length > 1);
  }, []);

  const clearGeometryHistory = useCallback(() => {
    geometryHistoryRef.current = [];
    dispatchPolygonDrawCanUndoChanged(false);
  }, []);

  const resetGeometryHistory = useCallback(
    (geometry: GeoJSON.Geometry) => {
      geometryHistoryRef.current = [cloneGeometry(geometry)];
      syncGeometryEditCanUndo();
    },
    [cloneGeometry, syncGeometryEditCanUndo]
  );

  const pushGeometryHistory = useCallback(
    (geometry: GeoJSON.Geometry) => {
      if (isApplyingGeometryUndoRef.current) return;

      const history = geometryHistoryRef.current;
      const serialized = serializeGeometry(geometry);
      if (history.length > 0 && serializeGeometry(history[history.length - 1]) === serialized) {
        return;
      }

      history.push(cloneGeometry(geometry));
      syncGeometryEditCanUndo();
    },
    [cloneGeometry, serializeGeometry, syncGeometryEditCanUndo]
  );

  const applyGeometryToDraw = useCallback(
    (geometry: GeoJSON.Geometry) => {
      if (draw.current == null) return;

      const feature = draw.current.getAll().features[0];
      if (feature?.id == null) return;

      draw.current.set({
        type: "FeatureCollection",
        features: [{ ...feature, geometry }]
      });
    },
    [draw]
  );

  const updatePolygonGeometryEditState = useCallback(
    (currentGeometry: GeoJSON.Geometry) => {
      const polygonUuid = polygonFromMap?.uuid;
      if (polygonUuid == null || polygonUuid === "" || setPolygonGeometryEdit == null) return;

      const originalGeometry = originalGeometryRef.current;
      setPolygonGeometryEdit({
        polygonUuid,
        originalGeometry,
        currentGeometry,
        isDirty: serializeGeometry(originalGeometry) !== serializeGeometry(currentGeometry)
      });
    },
    [polygonFromMap?.uuid, serializeGeometry, setPolygonGeometryEdit]
  );

  const performGeometryEditUndo = useCallback((): boolean => {
    const history = geometryHistoryRef.current;
    if (history.length <= 1 || draw.current == null) return false;

    history.pop();
    const previousGeometry = history[history.length - 1];

    isApplyingGeometryUndoRef.current = true;
    applyGeometryToDraw(previousGeometry);
    updatePolygonGeometryEditState(previousGeometry);
    isApplyingGeometryUndoRef.current = false;
    syncGeometryEditCanUndo();
    return true;
  }, [applyGeometryToDraw, draw, syncGeometryEditCanUndo, updatePolygonGeometryEditState]);

  useEffect(() => {
    const currentMap = map.current;
    if (currentMap == null || setPolygonGeometryEdit == null) return;

    const updateCurrentGeometry = () => {
      const polygonUuid = polygonFromMap?.uuid;
      if (polygonUuid == null || polygonUuid === "") return;

      const currentGeometry = draw.current?.getAll().features[0]?.geometry as GeoJSON.Geometry | undefined;
      if (currentGeometry == null) return;

      pushGeometryHistory(currentGeometry);
      updatePolygonGeometryEditState(currentGeometry);
    };

    currentMap.on("draw.update", updateCurrentGeometry);
    currentMap.on("draw.delete", updateCurrentGeometry);

    return () => {
      currentMap.off("draw.update", updateCurrentGeometry);
      currentMap.off("draw.delete", updateCurrentGeometry);
    };
  }, [draw, map, polygonFromMap?.uuid, pushGeometryHistory, setPolygonGeometryEdit, updatePolygonGeometryEditState]);

  useEffect(() => {
    const handleUndoPolygonDraw = () => {
      if (draw.current?.getMode() === "draw_polygon") return;
      performGeometryEditUndo();
    };

    window.addEventListener(UNDO_POLYGON_DRAW_EVENT, handleUndoPolygonDraw);
    return () => {
      window.removeEventListener(UNDO_POLYGON_DRAW_EVENT, handleUndoPolygonDraw);
    };
  }, [draw, performGeometryEditUndo]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isPolygonDrawUndoShortcut(event) || shouldIgnorePolygonDrawUndoShortcut(event.target)) {
        return;
      }
      if (draw.current?.getMode() === "draw_polygon") return;
      if (polygonFromMap?.uuid == null || polygonFromMap.uuid === "") return;
      if (geometryHistoryRef.current.length <= 1) return;

      event.preventDefault();
      performGeometryEditUndo();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [draw, performGeometryEditUndo, polygonFromMap?.uuid]);

  useEffect(() => {
    if (polygonFromMap?.isOpen === true) return;
    if (draw.current == null) return;

    onCancel(polygonsData);
    originalGeometryRef.current = null;
    clearGeometryHistory();
    setPolygonGeometryEdit?.(undefined);
  }, [clearGeometryHistory, draw, onCancel, polygonFromMap?.isOpen, polygonsData, setPolygonGeometryEdit]);

  useValueChanged(isUserDrawingEnabled, () => {
    if (map.current == null || draw.current == null) return;
    if (isUserDrawingEnabled) {
      applyMapDrawStatusStyles(map.current);
      applyMapDrawingCursor(map.current);
      draw.current.changeMode("draw_polygon");
      applyMapDrawingCursor(map.current);
      requestAnimationFrame(() => {
        if (map.current != null) applyMapDrawingCursor(map.current);
      });
      if (formMap && polygonFromMap?.uuid) {
        filterPolygonFromLayers(polygonFromMap.uuid, polygonsData, map.current);
      }
    } else {
      draw.current.changeMode("simple_select");
      resetMapDrawingCursor(map.current);
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
    const isProjectPolygon = isProjectPitchesEntityName(polygonFromMap?.entityName ?? "");
    const projectPitchUuid = polygonFromMap?.projectPitchUuid;
    const rawStatus =
      sitePolygonData?.find(polygon => polygon.polygonUuid === polygonuuid)?.status ?? statusSelectedPolygon;
    const polygonStatus: PolygonDrawStatus | undefined = isPolygonDrawStatus(rawStatus) ? rawStatus : undefined;

    try {
      // Fetch before hiding the tile-rendered polygon: it keeps showing its real
      // status color for the whole network round trip instead of disappearing,
      // then we swap tile -> Draw feature in one synchronous pass (no visible gap).
      const geometry = await fetchPolygonGeometry(polygonuuid, true, isProjectPolygon ? projectPitchUuid : undefined);
      if (geometry == null) {
        openNotification("error", t("Error"), t("No geometry found for polygon. The polygon may have been deleted."));
        return;
      }
      if (map.current != null && draw.current != null) {
        filterPolygonFromLayers(polygonuuid, polygonsData, map.current);
        originalGeometryRef.current = geometry;
        resetGeometryHistory(geometry);
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
        trackPolygonEvent("polygon_shape_edited", {
          ...getPolygonAnalyticsContext({
            entityType: polygonFromMap?.entityName,
            entityId: polygonFromMap?.projectPitchUuid ?? polygonFromMap?.uuid
          }),
          polygon_id: polygonFromMap.uuid
        });
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
      clearGeometryHistory();
      setPolygonGeometryEdit?.(undefined);

      setShouldRefetchPolygonData?.(true);
      openNotification("success", t("Success"), t("Site polygon version created successfully."));
      trackPolygonEvent("polygon_shape_edited", {
        ...getPolygonAnalyticsContext({
          entityType: "site",
          entityId: selectedPolygon.siteId
        }),
        polygon_id: polygonFromMap.uuid
      });
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
    clearGeometryHistory();
    setPolygonGeometryEdit?.(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearGeometryHistory, polygonsData, setPolygonGeometryEdit]);

  return { handleEditPolygon, onSaveEdit, onCancelEdit };
}
