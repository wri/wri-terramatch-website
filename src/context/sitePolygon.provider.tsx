import React, { createContext, ReactNode, useContext, useState } from "react";

import { SitePolygonsDataResponse } from "@/generated/apiSchemas";

export type SitePolygonData = {
  data: SitePolygonsDataResponse;
};

type SitePolygonContextType = {
  sitePolygonData: SitePolygonsDataResponse | undefined;
  reloadSiteData: () => void;
  isUserDrawingEnabled: boolean;
  toggleUserDrawing: (arg0: boolean) => void;
  toggleAttribute: (arg0: boolean) => void;
  openEditNewPolygon: boolean;
};

const SitePolygonDataContext = createContext<SitePolygonContextType | undefined>(undefined);

export const SitePolygonDataProvider: React.FC<{
  sitePolygonData: SitePolygonsDataResponse | undefined;
  reloadSiteData: () => void;
  children: ReactNode;
}> = ({ sitePolygonData, reloadSiteData, children }) => {
  const [isUserDrawingEnabled, setIsUserDrawingEnabled] = useState<boolean>(false);
  type SitePolygonContextType = {
    sitePolygonData: SitePolygonsDataResponse | undefined;
    reloadSiteData: () => void;
    isUserDrawingEnabled: boolean;
    toggleUserDrawing: (arg0: boolean) => void;
    toggleAttribute: (arg0: boolean) => void;
    openEditNewPolygon: boolean;
  };

  const [openEditNewPolygon, setOpenEditNewPolygon] = useState<boolean>(false);
  const toggleUserDrawing = (isDrawing: boolean) => {
    setIsUserDrawingEnabled(isDrawing);
  };
  const toggleAttribute = (isOpen: boolean) => {
    setOpenEditNewPolygon(isOpen);
  };
  const contextValue: SitePolygonContextType = {
    sitePolygonData,
    reloadSiteData,
    isUserDrawingEnabled,
    toggleUserDrawing,
    toggleAttribute,
    openEditNewPolygon
  };

  return <SitePolygonDataContext.Provider value={contextValue}>{children}</SitePolygonDataContext.Provider>;
};

export const useSitePolygonData = () => {
  return useContext(SitePolygonDataContext);
};
