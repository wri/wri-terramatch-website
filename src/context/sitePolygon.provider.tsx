import React, { createContext, ReactNode, useContext, useState } from "react";

import { SitePolygonsDataResponse } from "@/generated/apiSchemas";

type SitePolygonData = {
  data: SitePolygonsDataResponse;
};

type SitePolygonContextType = {
  sitePolygonData: SitePolygonData | undefined;
  reloadSiteData: () => void;
  isUserDrawingEnabled: boolean;
  toggleUserDrawing: (arg0: boolean) => void;
};

const SitePolygonDataContext = createContext<SitePolygonContextType | undefined>(undefined);

export const SitePolygonDataProvider: React.FC<{
  sitePolygonData: SitePolygonData | undefined;
  reloadSiteData: () => void;
  children: ReactNode;
}> = ({ sitePolygonData, reloadSiteData, children }) => {
  const [isUserDrawingEnabled, setIsUserDrawingEnabled] = useState<boolean>(false);

  const toggleUserDrawing = (isDrawing: boolean) => {
    console.log("is toggling in provider", isDrawing);
    setIsUserDrawingEnabled(isDrawing);
  };

  const contextValue: SitePolygonContextType = {
    sitePolygonData,
    reloadSiteData,
    isUserDrawingEnabled,
    toggleUserDrawing
  };

  return <SitePolygonDataContext.Provider value={contextValue}>{children}</SitePolygonDataContext.Provider>;
};

export const useSitePolygonData = () => {
  return useContext(SitePolygonDataContext);
};
