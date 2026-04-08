import MapboxDraw from "@mapbox/mapbox-gl-draw";
import mapboxgl from "mapbox-gl";
import { MutableRefObject } from "react";

import { loadListPolygonVersions } from "@/connections/PolygonVersion";
import { createVersionWithGeometry } from "@/connections/SitePolygons";
import { FORM_POLYGONS } from "@/constants/statuses";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
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
import { DashboardGetProjectsData } from "../Map.d";
import { filterPolygonFromLayers } from "./useMapLayers";

type UseMapDrawParams = {
  map: MutableRefObject<mapboxgl.Map | null>;
  draw: MutableRefObject<MapboxDraw | null>;
  isUserDrawingEnabled: boolean;
  formMap?: boolean;
  pdView?: boolean;
  polygonFromMap?: { uuid: string; isOpen: boolean; entityName?: string; projectPitchUuid?: string } | null;
  polygonsData?: Record<string, string[]>;
  centroids?: DashboardGetProjectsData[];
  sitePolygonData?: SitePolygonLightDto[];
  selectedPolyVersion?: any;
  onCancel: (polygonsData: any) => void;
  setPolygonFromMap?: any;
  reloadSiteData?: () => any;
  setShouldRefetchPolygonData?: (v: boolean) => void;
  setStatusSelectedPolygon?: (v: string) => void;
  t: (key: string) => string;
  showLoader: () => void;
  hideLoader: () => void;
  openNotification: (type: "success" | "error" | "warning", title: string, message?: any) => void;
};

/**
 * Manages the draw interaction lifecycle (contracts DE-1 through DE-6):
 *
 * - WHEN isUserDrawingEnabled flips true → enters draw_polygon mode (DE-1)
 * - WHEN isUserDrawingEnabled flips false → exits draw mode (DE-2)
 * - handleEditPolygon → fetches geometry + adds to draw canvas (DE-3)
 * - onSaveEdit → creates a polygon version and refreshes the tile layer (DE-4, DE-5)
 * - onCancelEdit → restores polygon filters without saving (DE-6)
 * - WHEN selectedPolyVersion changes → renders a temporary overlay polygon (not edit mode)
 */
export function useMapDraw({
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
}: UseMapDrawParams) {
  // Draw mode toggle (DE-1, DE-2)
  useValueChanged(isUserDrawingEnabled, () => {
    if (map.current == null || draw.current == null) return;
    if (isUserDrawingEnabled) {
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

  // Polygon version preview: render temporary overlay when version is selected
  useValueChanged(selectedPolyVersion, () => {
    if (map.current == null) return;
    const m = map.current;
    if (m.getSource("temp-polygon-source") != null || m.getLayer("temp-polygon-source-line") != null) {
      m.removeLayer("temp-polygon-source-line");
      m.removeLayer("temp-polygon-source");
      m.removeSource("temp-polygon-source");
    }
    const polygonUuid = (selectedPolyVersion as any)?.polygonUuid ?? (selectedPolyVersion as any)?.poly_id;
    if (selectedPolyVersion != null && polygonUuid != null) {
      fetchPolygonGeometry(polygonUuid).then(geometry => {
        if (geometry != null && map.current != null) {
          drawTemporaryPolygon(geometry, () => {}, map.current, selectedPolyVersion);
        }
      });
    }
  });

  const handleEditPolygon = async () => {
    if (map.current == null) return;
    removePopups(map.current, "POLYGON");
    if (!polygonFromMap?.isOpen || polygonFromMap?.uuid === "") return;

    const polygonuuid = polygonFromMap.uuid;
    const isProjectPolygon =
      polygonFromMap?.entityName === "project-pitches" || polygonFromMap?.entityName === "project-pitch";
    const projectPitchUuid = polygonFromMap?.projectPitchUuid;

    try {
      const geometry = await fetchPolygonGeometry(polygonuuid, true, isProjectPolygon ? projectPitchUuid : undefined);
      if (geometry == null) {
        openNotification("error", t("Error"), t("No geometry found for polygon. The polygon may have been deleted."));
        return;
      }
      if (map.current != null && draw.current != null) {
        addGeojsonToDraw(
          geometry,
          polygonuuid,
          () => {
            if (map.current != null) filterPolygonFromLayers(polygonuuid, polygonsData, map.current);
          },
          draw.current
        );
      }
    } catch (error) {
      Log.error("Error fetching polygon geometry:", error);
      openNotification("error", t("Error"), t("Failed to load polygon geometry. Please try again."));
    }
  };

  const onSaveEdit = async () => {
    if (map.current == null || draw.current == null) return;
    const geojson = draw.current.getAll();
    if (!geojson || !polygonFromMap?.uuid) return;

    !pdView && onCancelEdit();
    const feature = geojson.features[0];

    if (formMap) {
      try {
        showLoader();
        const projectPitchUuid = polygonFromMap.projectPitchUuid;
        await updatePolygonProjectGeometry([feature], polygonFromMap.uuid, reloadSiteData);

        if (draw.current) draw.current.deleteAll();
        await new Promise(resolve => setTimeout(resolve, 100));

        const isProjectPolygon = polygonFromMap.entityName === "project-pitches";
        const updatedGeometry = await fetchPolygonGeometry(
          polygonFromMap.uuid,
          true,
          isProjectPolygon ? projectPitchUuid : undefined
        );
        if (updatedGeometry != null && map.current != null) {
          // Style is guaranteed loaded here: we're responding to a successful async API call
          // that takes multiple seconds. If a style switch happened mid-save, useMapLayers
          // will re-add layers on the next styleVersion increment (LC-3).
          addSourcesToLayers(map.current, { [FORM_POLYGONS]: [polygonFromMap.uuid] }, centroids);
        }
        ApiSlice.pruneCache("boundingBoxes");
        ApiSlice.pruneIndex("boundingBoxes", "");
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
      if (!siteId) throw new Error("Missing siteId for polygon");

      await createVersionWithGeometry(
        selectedPolygon.primaryUuid,
        pdView ? "Updated geometry" : "Updated geometry from admin panel",
        { type: "Feature", geometry: feature.geometry, properties: { site_id: siteId } }
      );

      if (selectedPolygon.polygonUuid != null) {
        await ApiSlice.pruneCache("sitePolygons", [selectedPolygon.polygonUuid]);
      }
      ApiSlice.pruneCache("boundingBoxes");
      ApiSlice.pruneIndex("boundingBoxes", "");

      const polygonVersionResponse = await loadListPolygonVersions({ uuid: selectedPolygon.primaryUuid });
      const polygonActive = polygonVersionResponse?.data?.find((item: SitePolygonLightDto) => item.isActive);

      reloadSiteData?.();
      setPolygonFromMap?.({ isOpen: true, uuid: polygonActive?.polygonUuid as string });
      setStatusSelectedPolygon?.(polygonActive?.status as string);

      // For pdView the draw canvas was NOT cleared at the top (onCancelEdit is guarded
      // by !pdView), so clear it now. For !pdView it was already cleared by onCancelEdit.
      // Do NOT call addFilterOfPolygonsData or addSourcesToLayers with the stale
      // polygonsData closure here — both would re-paint the OLD polygon onto the tile
      // layer. useMapLayers re-runs reactively with the fresh polygonsData once
      // reloadSiteData() resolves, correctly showing the new polygon version (PL-2, DE-4).
      if (pdView && draw.current != null) {
        draw.current.deleteAll();
      }

      setShouldRefetchPolygonData?.(true);
      openNotification("success", t("Success"), t("Site polygon version created successfully."));
    } catch (e: any) {
      openNotification("error", t("Error"), e?.message ?? t("Please try again later."));
    } finally {
      hideLoader();
    }
  };

  const onCancelEdit = () => {
    onCancel(polygonsData);
  };

  return { handleEditPolygon, onSaveEdit, onCancelEdit };
}
