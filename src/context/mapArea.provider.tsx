import React, { createContext, ReactNode, useCallback, useContext, useState } from "react";

import { EditPolygonState } from "@/components/elements/Map-mapbox/Map.d";
import { SitePolygon } from "@/generated/apiSchemas";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { Entity } from "@/types/common";

export type MapAreaSiteData = Entity | SiteFullDto;

export function isMapAreaSiteFullDto(siteData: MapAreaSiteData | undefined): siteData is SiteFullDto {
  return siteData != null && "lightResource" in siteData;
}

type MapAreaType = {
  isUserDrawingEnabled: boolean;
  setIsUserDrawingEnabled: (arg0: boolean) => void;
  editPolygon: EditPolygonState;
  setEditPolygon: (value: EditPolygonState) => void;
  siteData: MapAreaSiteData | undefined;
  setSiteData: (value: MapAreaSiteData | undefined) => void;
  shouldRefetchPolygonData: boolean;
  setShouldRefetchPolygonData: (value: boolean) => void;
  shouldRefetchMediaData: boolean;
  setShouldRefetchMediaData: (value: boolean) => void;
  shouldRefetchValidation: boolean;
  setShouldRefetchValidation: (value: boolean) => void;
  shouldRefetchPolygonVersions: boolean;
  setShouldRefetchPolygonVersions: (value: boolean) => void;
  hasOverlaps: boolean;
  setHasOverlaps: (value: boolean) => void;
  selectedPolygonsInCheckbox: string[];
  setSelectedPolygonsInCheckbox: (value: string[]) => void;
  setSelectedPolyVersion: (value: SitePolygon) => void;
  selectedPolyVersion: SitePolygon | undefined;
  openModalConfirmation: boolean;
  setOpenModalConfirmation: (value: boolean) => void;
  previewVersion: boolean;
  setPreviewVersion: (value: boolean) => void;
  statusSelectedPolygon: string;
  setStatusSelectedPolygon: (value: string) => void;
  polygonCriteriaMap: Record<string, unknown>;
  setPolygonCriteriaMap: (value: Record<string, unknown>) => void;
  polygonData: SitePolygonLightDto[];
  setPolygonData: (value: SitePolygonLightDto[]) => void;
  validFilter: string;
  setValidFilter: (value: string) => void;
  resetSiteMapInteractionState: () => void;
};

const defaultValue: MapAreaType = {
  isUserDrawingEnabled: false,
  setIsUserDrawingEnabled: () => {},
  editPolygon: { isOpen: false, uuid: "" },
  setEditPolygon: () => {},
  siteData: undefined,
  setSiteData: () => {},
  shouldRefetchPolygonData: false,
  setShouldRefetchPolygonData: () => {},
  shouldRefetchMediaData: false,
  setShouldRefetchMediaData: () => {},
  shouldRefetchValidation: false,
  setShouldRefetchValidation: () => {},
  shouldRefetchPolygonVersions: false,
  setShouldRefetchPolygonVersions: () => {},
  hasOverlaps: false,
  setHasOverlaps: () => {},
  selectedPolygonsInCheckbox: [],
  setSelectedPolygonsInCheckbox: () => {},
  setSelectedPolyVersion: () => {},
  selectedPolyVersion: undefined,
  openModalConfirmation: false,
  setOpenModalConfirmation: () => {},
  previewVersion: false,
  setPreviewVersion: () => {},
  statusSelectedPolygon: "",
  setStatusSelectedPolygon: () => {},
  polygonCriteriaMap: {},
  setPolygonCriteriaMap: () => {},
  polygonData: [],
  setPolygonData: () => {},
  validFilter: "all",
  setValidFilter: () => {},
  resetSiteMapInteractionState: () => {}
};

const MapAreaContext = createContext<MapAreaType>(defaultValue);

export const MapAreaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isUserDrawingEnabled, setIsUserDrawingEnabled] = useState<boolean>(false);
  const [siteData, setSiteData] = useState<MapAreaSiteData | undefined>(undefined);
  const [shouldRefetchPolygonData, setShouldRefetchPolygonData] = useState<boolean>(false);
  const [shouldRefetchMediaData, setShouldRefetchMediaData] = useState<boolean>(false);
  const [shouldRefetchValidation, setShouldRefetchValidation] = useState<boolean>(false);
  const [shouldRefetchPolygonVersions, setShouldRefetchPolygonVersions] = useState<boolean>(false);
  const [hasOverlaps, setHasOverlaps] = useState<boolean>(false);
  const [selectedPolyVersion, setSelectedPolyVersion] = useState<SitePolygon | undefined>();
  const [openModalConfirmation, setOpenModalConfirmation] = useState<boolean>(false);
  const [previewVersion, setPreviewVersion] = useState<boolean>(false);
  const [statusSelectedPolygon, setStatusSelectedPolygon] = useState<string>("");
  const [selectedPolygonsInCheckbox, setSelectedPolygonsInCheckbox] = useState<string[]>([]);
  const [polygonCriteriaMap, setPolygonCriteriaMap] = useState<Record<string, unknown>>({});
  const [polygonData, setPolygonData] = useState<SitePolygonLightDto[]>([]);
  const [validFilter, setValidFilter] = useState<string>("all");
  const [editPolygon, setEditPolygonInternal] = useState<EditPolygonState>({
    isOpen: false,
    uuid: ""
  });

  const setEditPolygon = useCallback((value: EditPolygonState) => {
    setEditPolygonInternal(value);
    if (!value.isOpen) {
      setShouldRefetchPolygonData(false);
    }
  }, []);

  const resetSiteMapInteractionState = useCallback(() => {
    setIsUserDrawingEnabled(false);
    setEditPolygonInternal({ isOpen: false, uuid: "" });
    setShouldRefetchPolygonData(false);
    setSelectedPolyVersion(undefined);
    setOpenModalConfirmation(false);
    setPreviewVersion(false);
    setStatusSelectedPolygon("");
    setSelectedPolygonsInCheckbox([]);
    setHasOverlaps(false);
  }, []);

  const contextValue: MapAreaType = {
    isUserDrawingEnabled,
    setIsUserDrawingEnabled,
    editPolygon,
    setEditPolygon,
    siteData,
    setSiteData,
    shouldRefetchPolygonData,
    setShouldRefetchPolygonData,
    shouldRefetchMediaData,
    setShouldRefetchMediaData,
    shouldRefetchValidation,
    setShouldRefetchValidation,
    shouldRefetchPolygonVersions,
    setShouldRefetchPolygonVersions,
    hasOverlaps,
    setHasOverlaps,
    selectedPolygonsInCheckbox,
    setSelectedPolygonsInCheckbox,
    setSelectedPolyVersion,
    selectedPolyVersion,
    setOpenModalConfirmation,
    openModalConfirmation,
    previewVersion,
    setPreviewVersion,
    setStatusSelectedPolygon,
    statusSelectedPolygon,
    polygonCriteriaMap,
    setPolygonCriteriaMap,
    polygonData,
    setPolygonData,
    validFilter,
    setValidFilter,
    resetSiteMapInteractionState
  };

  return <MapAreaContext.Provider value={contextValue}>{children}</MapAreaContext.Provider>;
};

export const useMapAreaContext = () => {
  const context = useContext(MapAreaContext);
  if (!context) {
    throw new Error("useMapAreaContext must be used within a MapAreaProvider");
  }
  return context;
};
