import React, { createContext, ReactNode, useContext, useState } from "react";

import { fetchGetV2DashboardViewProjectUuid } from "@/generated/apiComponents";
import { SitePolygon } from "@/generated/apiSchemas";

type MapAreaType = {
  isMonitoring: boolean;
  setIsMonitoring: (value: boolean) => void;
  checkIsMonitoringPartner: (projectUuid: string) => Promise<void>;
  isUserDrawingEnabled: boolean;
  setIsUserDrawingEnabled: (arg0: boolean) => void;
  toggleAttribute: (arg0: boolean) => void;
  openEditNewPolygon: boolean;
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
  setpolygonNotificationStatus: (value: {
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
};

const defaultValue: MapAreaType = {
  isMonitoring: false,
  setIsMonitoring: () => {},
  checkIsMonitoringPartner: async () => {},
  isUserDrawingEnabled: false,
  setIsUserDrawingEnabled: () => {},
  toggleAttribute: () => {},
  openEditNewPolygon: false,
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
  setpolygonNotificationStatus: () => {},
  setSelectedPolyVersion: () => {},
  selectedPolyVersion: undefined,
  openModalConfirmation: false,
  setOpenModalConfirmation: () => {},
  previewVersion: false,
  setPreviewVersion: () => {},
  statusSelectedPolygon: "",
  setStatusSelectedPolygon: () => {}
};

const MapAreaContext = createContext<MapAreaType>(defaultValue);

export const MapAreaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const [isUserDrawingEnabled, setIsUserDrawingEnabled] = useState<boolean>(false);
  const [openEditNewPolygon, setOpenEditNewPolygon] = useState<boolean>(false);
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
  const [editPolygon, setEditPolygon] = useState<{ isOpen: boolean; uuid: string; primary_uuid?: string }>({
    isOpen: false,
    uuid: "",
    primary_uuid: ""
  });
  const [polygonNotificationStatus, setpolygonNotificationStatus] = useState<{
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
  const toggleAttribute = (isOpen: boolean) => {
    setOpenEditNewPolygon(isOpen);
  };

  const checkIsMonitoringPartner = async (projectUuid: string) => {
    try {
      const isMonitoringPartner: any = await fetchGetV2DashboardViewProjectUuid({
        pathParams: { uuid: projectUuid }
      });
      setIsMonitoring(isMonitoringPartner?.allowed ?? false);
    } catch (error) {
      console.error("Failed to check if monitoring partner:", error);
      setIsMonitoring(false);
    }
  };

  const contextValue: MapAreaType = {
    isMonitoring,
    setIsMonitoring,
    checkIsMonitoringPartner,
    isUserDrawingEnabled,
    setIsUserDrawingEnabled,
    toggleAttribute,
    openEditNewPolygon,
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
    setpolygonNotificationStatus,
    setSelectedPolyVersion,
    selectedPolyVersion,
    setOpenModalConfirmation,
    openModalConfirmation,
    previewVersion,
    setPreviewVersion,
    setStatusSelectedPolygon,
    statusSelectedPolygon
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
