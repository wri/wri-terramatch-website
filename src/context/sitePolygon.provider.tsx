import React, { createContext, ReactNode, useContext } from "react";

import { SitePolygonsDataResponse } from "@/generated/apiSchemas";

export type SitePolygonData = {
  data: SitePolygonsDataResponse;
};

type SitePolygonContextType = {
  sitePolygonData: SitePolygonsDataResponse | undefined;
  reloadSiteData: () => void;
  updateSingleSitePolygonData?: (poly_id: string, updatedData: any) => void;
};

const SitePolygonDataContext = createContext<SitePolygonContextType | undefined>(undefined);

export const SitePolygonDataProvider: React.FC<{
  sitePolygonData: SitePolygonsDataResponse | undefined;
  updateSingleSitePolygonData?: (poly_id: string, updatedData: any) => void;
  reloadSiteData: () => void;
  children: ReactNode;
}> = ({ sitePolygonData, reloadSiteData, updateSingleSitePolygonData, children }) => {
  const contextValue: SitePolygonContextType = {
    sitePolygonData,
    reloadSiteData,
    updateSingleSitePolygonData
  };

  return <SitePolygonDataContext.Provider value={contextValue}>{children}</SitePolygonDataContext.Provider>;
};

export const useSitePolygonData = () => {
  const context = useContext(SitePolygonDataContext);
  return context;
};
