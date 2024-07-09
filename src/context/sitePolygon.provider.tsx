import React, { createContext, ReactNode, useContext } from "react";

import { SitePolygonsDataResponse } from "@/generated/apiSchemas";

export type SitePolygonData = {
  data: SitePolygonsDataResponse;
};

type SitePolygonContextType = {
  sitePolygonData: SitePolygonsDataResponse | undefined;
  reloadSiteData: () => void;
};

const SitePolygonDataContext = createContext<SitePolygonContextType | undefined>(undefined);

export const SitePolygonDataProvider: React.FC<{
  sitePolygonData: SitePolygonsDataResponse | undefined;
  reloadSiteData: () => void;
  children: ReactNode;
}> = ({ sitePolygonData, reloadSiteData, children }) => {
  type SitePolygonContextType = {
    sitePolygonData: SitePolygonsDataResponse | undefined;
    reloadSiteData: () => void;
  };
  const contextValue: SitePolygonContextType = {
    sitePolygonData,
    reloadSiteData
  };

  return <SitePolygonDataContext.Provider value={contextValue}>{children}</SitePolygonDataContext.Provider>;
};

export const useSitePolygonData = () => {
  const context = useContext(SitePolygonDataContext);
  return context;
};
