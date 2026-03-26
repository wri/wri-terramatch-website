import React, { createContext, ReactNode, useCallback, useContext, useMemo, useRef, useState } from "react";

export type AnrMapOverlayContextValue = {
  /** Polygon review drawer is open */
  drawerOpen: boolean;
  /** Site polygon row UUID for GET /anr-plot-geometry/{sitePolygonUuid} */
  sitePolygonUuidForApi: string | null;
  /** Geometry polygon UUID (map id); used to detect polygon switch */
  geometryPolygonUuid: string | null;
  /** True when polygon drawer is on the ANR Monitoring Plots tab */
  anrTabActive: boolean;
  setAnrTabActive: React.Dispatch<React.SetStateAction<boolean>>;
  /** User toggle: show ANR grid on map while on ANR tab (eye icon) */
  showPlotsOnMap: boolean;
  setShowPlotsOnMap: React.Dispatch<React.SetStateAction<boolean>>;
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
      setAnrTabActive: setAnrTabActiveState,
      showPlotsOnMap,
      setShowPlotsOnMap: setShowPlotsOnMapState,
      resetAnrMapOverlay,
      syncDrawerSelection,
      setDrawerOpen
    }),
    [
      drawerOpen,
      sitePolygonUuidForApi,
      geometryPolygonUuid,
      anrTabActive,
      showPlotsOnMap,
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

export const useAnrMapOverlayOptional = (): AnrMapOverlayContextValue | undefined => {
  return useContext(AnrMapOverlayContext);
};
