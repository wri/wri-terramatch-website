import React, { createContext, ReactNode, useCallback, useContext, useMemo, useRef, useState } from "react";

/**
 * Coordinates ANR monitoring plot map overlay between the polygon drawer (sidebar) and MapContainer.
 *
 * - Map reads: drawerOpen, sitePolygonUuid (API id), geometryPolygonUuid, showPlotsOnMap
 * - AnrMonitoringPlots writes: showPlotsOnMap via toggle
 * - PolygonDrawer syncs drawer + selection; geometryPolygonUuid change forces plots hidden until user toggles again
 */
export type AnrMapOverlayContextValue = {
  /** Polygon review drawer is open */
  drawerOpen: boolean;
  /** Site polygon row UUID for GET /anr-plot-geometry/{sitePolygonUuid} */
  sitePolygonUuidForApi: string | null;
  /** Geometry polygon UUID (map id); used to detect polygon switch */
  geometryPolygonUuid: string | null;
  /** True when polygon drawer is on the ANR Monitoring Plots tab */
  anrTabActive: boolean;
  setAnrTabActive: (value: boolean) => void;
  /** User toggle: show ANR grid on map while on ANR tab (eye icon) */
  showPlotsOnMap: boolean;
  setShowPlotsOnMap: (value: boolean) => void;
  /** Called when drawer closes — clears overlay state */
  resetAnrMapOverlay: () => void;
  /** Called from PolygonDrawer when drawer is open */
  syncDrawerSelection: (args: { sitePolygonUuid: string; geometryPolygonUuid: string }) => void;
  setDrawerOpen: (open: boolean) => void;
};

const AnrMapOverlayContext = createContext<AnrMapOverlayContextValue | undefined>(undefined);

export const AnrMapOverlayProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sitePolygonUuidForApi, setSitePolygonUuidForApi] = useState<string | null>(null);
  const [geometryPolygonUuid, setGeometryPolygonUuid] = useState<string | null>(null);
  const [anrTabActive, setAnrTabActiveState] = useState(false);
  const [showPlotsOnMap, setShowPlotsOnMapState] = useState(false);
  const prevGeometryUuidRef = useRef<string | null>(null);

  const resetAnrMapOverlay = useCallback(() => {
    setDrawerOpen(false);
    setSitePolygonUuidForApi(null);
    setGeometryPolygonUuid(null);
    prevGeometryUuidRef.current = null;
    setAnrTabActiveState(false);
    setShowPlotsOnMapState(false);
  }, []);

  const setAnrTabActive = useCallback((value: boolean) => {
    setAnrTabActiveState(value);
  }, []);

  const setShowPlotsOnMap = useCallback((value: boolean) => {
    setShowPlotsOnMapState(value);
  }, []);

  const syncDrawerSelection = useCallback((args: { sitePolygonUuid: string; geometryPolygonUuid: string }) => {
    const { sitePolygonUuid, geometryPolygonUuid: geom } = args;
    const prev = prevGeometryUuidRef.current;
    if (prev != null && prev !== "" && geom !== "" && prev !== geom) {
      setShowPlotsOnMapState(false);
    }
    prevGeometryUuidRef.current = geom === "" ? null : geom;
    setSitePolygonUuidForApi(sitePolygonUuid === "" ? null : sitePolygonUuid);
    setGeometryPolygonUuid(geom === "" ? null : geom);
  }, []);

  const value = useMemo<AnrMapOverlayContextValue>(
    () => ({
      drawerOpen,
      sitePolygonUuidForApi,
      geometryPolygonUuid,
      anrTabActive,
      setAnrTabActive,
      showPlotsOnMap,
      setShowPlotsOnMap,
      resetAnrMapOverlay,
      syncDrawerSelection,
      setDrawerOpen
    }),
    [
      drawerOpen,
      sitePolygonUuidForApi,
      geometryPolygonUuid,
      anrTabActive,
      setAnrTabActive,
      showPlotsOnMap,
      setShowPlotsOnMap,
      resetAnrMapOverlay,
      syncDrawerSelection
    ]
  );

  return <AnrMapOverlayContext.Provider value={value}>{children}</AnrMapOverlayContext.Provider>;
};

export const useAnrMapOverlay = (): AnrMapOverlayContextValue => {
  const ctx = useContext(AnrMapOverlayContext);
  if (ctx == null) {
    throw new Error("useAnrMapOverlay must be used within AnrMapOverlayProvider");
  }
  return ctx;
};

/** Safe for MapContainer used outside polygon review (e.g. dashboard). */
export const useAnrMapOverlayOptional = (): AnrMapOverlayContextValue | undefined => {
  return useContext(AnrMapOverlayContext);
};
