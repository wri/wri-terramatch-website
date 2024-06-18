import React, { createContext, ReactNode, useContext, useState } from "react";

import { fetchGetV2DashboardViewProjectUuid } from "@/generated/apiComponents";

type MapAreaType = {
  isMonitoring: boolean;
  setIsMonitoring: (value: boolean) => void;
  checkIsMonitoringPartner: (projectUuid: string) => Promise<void>;
  isUserDrawingEnabled: boolean;
  toggleUserDrawing: (arg0: boolean) => void;
  toggleAttribute: (arg0: boolean) => void;
  openEditNewPolygon: boolean;
};

const MapAreaContext = createContext<MapAreaType | undefined>(undefined);

export const MapAreaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const [isUserDrawingEnabled, setIsUserDrawingEnabled] = useState<boolean>(false);
  const [openEditNewPolygon, setOpenEditNewPolygon] = useState<boolean>(false);
  const toggleUserDrawing = (isDrawing: boolean) => {
    setIsUserDrawingEnabled(isDrawing);
  };
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
    toggleUserDrawing,
    toggleAttribute,
    openEditNewPolygon
  };

  return <MapAreaContext.Provider value={contextValue}>{children}</MapAreaContext.Provider>;
};

export const useMapAreaContext = () => {
  const context = useContext(MapAreaContext);
  return context;
};
