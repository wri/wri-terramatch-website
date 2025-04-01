import React, { createContext, ReactNode, useContext } from "react";

import { SitePolygonsDataResponse } from "@/generated/apiSchemas";

export type SitePolygonData = {
  data: SitePolygonsDataResponse;
};

type SitePolygonContextType = {
  sitePolygonData: SitePolygonsDataResponse | undefined;
  reloadSiteData: () => void;
  updateSingleCriteriaData: (poly_id: string, updatedData: any) => void;
};

const SitePolygonDataContext = createContext<SitePolygonContextType | undefined>(undefined);

export const SitePolygonDataProvider: React.FC<{
  sitePolygonData: SitePolygonsDataResponse | undefined;
  updateSingleCriteriaData: (poly_id: string, updatedData: any) => void;
  reloadSiteData: () => void;
  children: ReactNode;
}> = ({ sitePolygonData, reloadSiteData, updateSingleCriteriaData, children }) => {
  const contextValue: SitePolygonContextType = {
    sitePolygonData,
    reloadSiteData,
    updateSingleCriteriaData
  };

  return <SitePolygonDataContext.Provider value={contextValue}>{children}</SitePolygonDataContext.Provider>;
};

export const useSitePolygonData = () => {
  const context = useContext(SitePolygonDataContext);
  if (!context) {
    throw new Error("useSitePolygonData must be used within a SitePolygonDataProvider");
  }
  return context;
};
