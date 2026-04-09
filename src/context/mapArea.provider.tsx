import React, { createContext, ReactNode, useCallback, useContext, useState } from "react";

import { SitePolygon } from "@/generated/apiSchemas";

type MapAreaType = {
  isUserDrawingEnabled: boolean;
  setIsUserDrawingEnabled: (arg0: boolean) => void;
  editPolygon: { isOpen: boolean; uuid: string; primary_uuid?: string };
  setEditPolygon: (value: { isOpen: boolean; uuid: string; primary_uuid?: string }) => void;
  siteData: any;
  setSiteData: (value: any) => void;
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
  polygonNotificationStatus: {
    open: boolean;
    message: string;
    type: "success" | "error" | "warning";
    title: string;
  };
  setPolygonNotificationStatus: (value: {
    open: boolean;
    message: string;
    type: "success" | "error" | "warning";
    title: string;
  }) => void;
  setSelectedPolyVersion: (value: SitePolygon) => void;
  selectedPolyVersion: SitePolygon | undefined;
  openModalConfirmation: boolean;
  setOpenModalConfirmation: (value: boolean) => void;
  previewVersion: boolean;
  setPreviewVersion: (value: boolean) => void;
  statusSelectedPolygon: string;
  setStatusSelectedPolygon: (value: string) => void;
  polygonCriteriaMap: any;
  setPolygonCriteriaMap: (value: any) => void;
  polygonData: any[];
  setPolygonData: (value: any[]) => void;
  validFilter: string;
  setValidFilter: (value: string) => void;
  isFetchingValidationData: boolean;
  setIsFetchingValidationData: (value: boolean) => void;
  resetSiteMapInteractionState: () => void;
};

const defaultValue: MapAreaType = {
  isUserDrawingEnabled: false,
  setIsUserDrawingEnabled: () => {},
  editPolygon: { isOpen: false, uuid: "", primary_uuid: "" },
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
  polygonNotificationStatus: {
    open: false,
    message: "",
    type: "success",
    title: ""
  },
  setPolygonNotificationStatus: () => {},
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
  isFetchingValidationData: false,
  setIsFetchingValidationData: () => {},
  resetSiteMapInteractionState: () => {}
};

const MapAreaContext = createContext<MapAreaType>(defaultValue);

export const MapAreaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isUserDrawingEnabled, setIsUserDrawingEnabled] = useState<boolean>(false);
  const [siteData, setSiteData] = useState<any>();
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
  const [polygonCriteriaMap, setPolygonCriteriaMap] = useState<any>({});
  const [polygonData, setPolygonData] = useState<any[]>([]);
  const [validFilter, setValidFilter] = useState<string>("all");
  const [isFetchingValidationData, setIsFetchingValidationData] = useState<boolean>(false);
  const [editPolygon, setEditPolygonInternal] = useState<{ isOpen: boolean; uuid: string; primary_uuid?: string }>({
    isOpen: false,
    uuid: "",
    primary_uuid: ""
  });
  const [polygonNotificationStatus, setPolygonNotificationStatus] = useState<{
    open: boolean;
    message: string;
    type: "success" | "error" | "warning";
    title: string;
  }>({
    open: false,
    message: "",
    type: "success",
    title: ""
  });

  const setEditPolygon = (value: { isOpen: boolean; uuid: string; primary_uuid?: string }) => {
    setEditPolygonInternal(value);
    if (!value.isOpen) {
      setShouldRefetchPolygonData(false);
    }
  };

  const resetSiteMapInteractionState = useCallback(() => {
    setIsUserDrawingEnabled(false);
    setEditPolygonInternal({ isOpen: false, uuid: "", primary_uuid: "" });
    setShouldRefetchPolygonData(false);
    setSelectedPolyVersion(undefined);
    setOpenModalConfirmation(false);
    setPreviewVersion(false);
    setStatusSelectedPolygon("");
    setSelectedPolygonsInCheckbox([]);
    setPolygonNotificationStatus({
      open: false,
      message: "",
      type: "success",
      title: ""
    });
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
    polygonNotificationStatus,
    setPolygonNotificationStatus,
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
    isFetchingValidationData,
    setIsFetchingValidationData,
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
