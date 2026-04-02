import MapboxDraw from "@mapbox/mapbox-gl-draw";
import _ from "lodash";
import mapboxgl from "mapbox-gl";
import { MutableRefObject, useEffect, useState } from "react";

import { LAYERS_NAMES, layersList } from "@/constants/layers";
import { DELETED_POLYGONS } from "@/constants/statuses";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

import { AdminPopup } from "../components/AdminPopup";
import { DashboardPopup } from "../components/DashboardPopup";
import { addPopupsToMap } from "../interactions/popups";
import { addDeleteLayer, addFilterOnLayer, addSourcesToLayers } from "../layers/polygonLayers";
import type { TooltipType } from "../Map.d";
import { DashboardGetProjectsData } from "../Map.d";

type UseMapLayersParams = {
  map: MutableRefObject<mapboxgl.Map | null>;
  draw: MutableRefObject<MapboxDraw | null>;
  polygonsData?: Record<string, string[]>;
  centroids?: DashboardGetProjectsData[];
  polygonsCentroids?: any[];
  sitePolygonData?: SitePolygonLightDto[];
  isDashboard?: string;
  projectUUID?: string;
  hasAccess?: boolean;
  showPopups?: boolean;
  tooltipType?: TooltipType;
  editPolygonSelected: { isOpen: boolean; uuid: string; primary_uuid?: string };
  setEditPolygon: (v: { isOpen: boolean; uuid: string; primary_uuid?: string }) => void;
  setPolygonFromMap?: any;
  dashboardContext?: { setFilters?: any; dashboardCountries?: any[]; isDashboard?: string } | null;
  setFilters?: any;
  dashboardCountries?: any[];
  setLoader?: (v: boolean) => void;
  selectedCountry?: string | null;
  isMobile: boolean;
  setMobilePopupData: (v: any) => void;
  selectedPolygonsInCheckbox?: string[];
  styleLoaded: boolean;
};

/**
 * Manages the polygon source/layer lifecycle (contracts PL-1 through PL-5):
 *
 * - WHEN polygonsData or sitePolygonData changes → adds sources and applies uuid filters
 * - WHEN style loads → re-adds all sources (PL-3 + LC-3)
 * - WHEN selectedPolygonsInCheckbox changes → updates the deleted geometry layer (PL-4)
 *
 * Returns `sourcesAdded` so overlay/border hooks can gate on it (contract PL-2).
 */
export function useMapLayers({
  map,
  draw,
  polygonsData,
  centroids,
  polygonsCentroids,
  sitePolygonData,
  isDashboard,
  projectUUID,
  hasAccess,
  showPopups,
  tooltipType,
  editPolygonSelected,
  setEditPolygon,
  setPolygonFromMap,
  dashboardContext,
  setFilters,
  dashboardCountries,
  setLoader,
  selectedCountry,
  isMobile,
  setMobilePopupData,
  selectedPolygonsInCheckbox,
  styleLoaded
}: UseMapLayersParams) {
  const [sourcesAdded, setSourcesAdded] = useState(false);

  // Main layer setup effect (PL-1, PL-2, PL-3)
  useEffect(() => {
    if (map.current == null || (!isDashboard && _.isEmpty(polygonsData))) return;

    const currentMap = map.current as mapboxgl.Map;
    let isEffectActive = true;
    let hasSetupRun = false;

    const setupMap = () => {
      if (!isEffectActive || hasSetupRun) return;
      hasSetupRun = true;

      const zoomFilter = isDashboard ? 9 : undefined;
      let polygonsDataToUse = polygonsData;
      if (isDashboard != null && projectUUID != null && hasAccess === false) {
        polygonsDataToUse = {};
      }

      addSourcesToLayers(currentMap, polygonsDataToUse, centroids, zoomFilter, isDashboard, polygonsCentroids);
      setSourcesAdded(true);

      if (showPopups) {
        addPopupsToMap(
          currentMap,
          isDashboard ? DashboardPopup : AdminPopup,
          setPolygonFromMap,
          sitePolygonData,
          tooltipType ?? "goTo",
          editPolygonSelected,
          setEditPolygon,
          draw.current!,
          isDashboard,
          dashboardContext?.setFilters ?? setFilters,
          dashboardContext?.dashboardCountries ?? dashboardCountries,
          setLoader,
          selectedCountry,
          isMobile || isDashboard != null ? setMobilePopupData : undefined
        );
      }
    };

    setSourcesAdded(false);

    const isMapReady = () => {
      try {
        return !currentMap.isMoving() && currentMap.loaded() && currentMap.isStyleLoaded();
      } catch {
        return false;
      }
    };

    if (isMapReady()) {
      setupMap();
    } else {
      const handleIdle = () => setupMap();
      currentMap.on("idle", handleIdle);
      currentMap.once("idle", () => {
        if (hasSetupRun) currentMap.off("idle", handleIdle);
      });
    }

    const handleStyleLoad = () => {
      hasSetupRun = false;
      setSourcesAdded(false);
      const handleIdleAfterStyle = () => {
        setupMap();
        currentMap.off("idle", handleIdleAfterStyle);
      };
      if (isMapReady()) {
        setupMap();
      } else {
        currentMap.on("idle", handleIdleAfterStyle);
      }
    };

    currentMap.on("style.load", handleStyleLoad);

    return () => {
      isEffectActive = false;
      currentMap.off("style.load", handleStyleLoad);
    };
  }, [
    sitePolygonData,
    polygonsCentroids,
    polygonsData,
    showPopups,
    centroids,
    dashboardCountries,
    draw,
    editPolygonSelected,
    isDashboard,
    isMobile,
    map,
    selectedCountry,
    setMobilePopupData,
    setEditPolygon,
    setFilters,
    setLoader,
    setPolygonFromMap,
    tooltipType,
    projectUUID,
    hasAccess,
    dashboardContext
  ]);

  // Deleted geometry checkbox layer (PL-4)
  useEffect(() => {
    if (selectedPolygonsInCheckbox == null || map.current == null || !styleLoaded) return;
    addDeleteLayer(
      layersList.find(layer => layer.name === LAYERS_NAMES.DELETED_GEOMETRIES),
      map.current,
      { [DELETED_POLYGONS]: selectedPolygonsInCheckbox }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPolygonsInCheckbox, styleLoaded]);

  return { sourcesAdded, setSourcesAdded };
}

/** Filters a polygon UUID out of the current polygonsData and re-applies the layer filter.
 * Call this when entering edit mode for a specific polygon (contract DE-1). */
export function filterPolygonFromLayers(
  polygonuuid: string,
  polygonsData: Record<string, string[]> | undefined,
  map: mapboxgl.Map
) {
  if (polygonsData == null) return;
  const newPolygonData: Record<string, string[]> = JSON.parse(JSON.stringify(polygonsData));
  const statuses = ["submitted", "approved", "need-more-info", "draft", "form-polygons"];
  statuses.forEach(status => {
    if (newPolygonData[status] != null) {
      newPolygonData[status] = newPolygonData[status].filter((feature: string) => feature !== polygonuuid);
    }
  });
  addFilterOnLayer(
    layersList.find(layer => layer.name === LAYERS_NAMES.POLYGON_GEOMETRY),
    newPolygonData,
    map
  );
}
