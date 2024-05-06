import React, { createContext, ReactNode, useContext } from "react";

import { SitePolygonsDataResponse } from "@/generated/apiSchemas";

type SitePolygonData = {
  data: SitePolygonsDataResponse;
};

type SitePolygonContextType = {
  sitePolygonData: SitePolygonData | undefined;
  reloadSiteData: () => void;
};

const SitePolygonDataContext = createContext<SitePolygonContextType | undefined>(undefined);

export const SitePolygonDataProvider: React.FC<{
  sitePolygonData: SitePolygonData | undefined;
  reloadSiteData: () => void; // Added reloadSiteData to props
  children: ReactNode;
}> = ({ sitePolygonData, reloadSiteData, children }) => {
  const contextValue: SitePolygonContextType = {
    sitePolygonData,
    reloadSiteData
  };

  return <SitePolygonDataContext.Provider value={contextValue}>{children}</SitePolygonDataContext.Provider>;
};

export const useSitePolygonData = () => {
  return useContext(SitePolygonDataContext);
};
