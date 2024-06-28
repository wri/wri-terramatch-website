import React, { createContext, ReactNode, useContext, useState } from "react";

import { fetchGetV2DashboardViewProjectUuid } from "@/generated/apiComponents";

type MapAreaType = {
  isMonitoring: boolean;
  setIsMonitoring: (value: boolean) => void;
  checkIsMonitoringPartner: (projectUuid: string) => Promise<void>;
  isUserDrawingEnabled: boolean;
  setIsUserDrawingEnabled: (arg0: boolean) => void;
  toggleAttribute: (arg0: boolean) => void;
  openEditNewPolygon: boolean;
  editPolygon: { isOpen: boolean; uuid: string };
  setEditPolygon: (value: { isOpen: boolean; uuid: string }) => void;
  siteData: any;
  setSiteData: (value: any) => void;
  shouldRefetchPolygonData: boolean;
  setShouldRefetchPolygonData: (value: boolean) => void;
  shouldRefetchValidation: boolean;
  setShouldRefetchValidation: (value: boolean) => void;
  projectNotificationStatus: {
    open: boolean;
    message: string;
    type: "success" | "error" | "warning";
    title: string;
  };
  setProjectNotificationStatus: (value: {
    open: boolean;
    message: string;
    type: "success" | "error" | "warning";
    title: string;
  }) => void;
};

const defaultValue: MapAreaType = {
  isMonitoring: false,
  setIsMonitoring: () => {},
  checkIsMonitoringPartner: async () => {},
  isUserDrawingEnabled: false,
  setIsUserDrawingEnabled: () => {},
  toggleAttribute: () => {},
  openEditNewPolygon: false,
  editPolygon: { isOpen: false, uuid: "" },
  setEditPolygon: () => {},
  siteData: undefined,
  setSiteData: () => {},
  shouldRefetchPolygonData: false,
  setShouldRefetchPolygonData: () => {},
  shouldRefetchValidation: false,
  setShouldRefetchValidation: () => {},
  projectNotificationStatus: {
    open: false,
    message: "",
    type: "success",
    title: "Success!"
  },
  setProjectNotificationStatus: () => {}
};

const MapAreaContext = createContext<MapAreaType>(defaultValue);

export const MapAreaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const [isUserDrawingEnabled, setIsUserDrawingEnabled] = useState<boolean>(false);
  const [openEditNewPolygon, setOpenEditNewPolygon] = useState<boolean>(false);
  const [siteData, setSiteData] = useState<any>();
  const [shouldRefetchPolygonData, setShouldRefetchPolygonData] = useState<boolean>(false);
  const [shouldRefetchValidation, setShouldRefetchValidation] = useState<boolean>(false);
  const [editPolygon, setEditPolygon] = useState<{ isOpen: boolean; uuid: string }>({
    isOpen: false,
    uuid: ""
  });
  const [projectNotificationStatus, setProjectNotificationStatus] = useState<{
    open: boolean;
    message: string;
    type: "success" | "error" | "warning";
    title: string;
  }>({
    open: false,
    message: "",
    type: "success",
    title: "Success!"
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
    shouldRefetchValidation,
    setShouldRefetchValidation,
    projectNotificationStatus,
    setProjectNotificationStatus
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
