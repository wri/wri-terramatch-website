import React, { createContext, ReactNode, useContext } from "react";

import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

export type SitePolygonData = {
  data: SitePolygonLightDto[];
};

type SitePolygonContextType = {
  sitePolygonData: SitePolygonLightDto[] | undefined;
  reloadSiteData: () => void;
};

const SitePolygonDataContext = createContext<SitePolygonContextType | undefined>(undefined);

export const SitePolygonDataProvider: React.FC<{
  sitePolygonData: SitePolygonLightDto[] | undefined;
  reloadSiteData: () => void;
  children: ReactNode;
}> = ({ sitePolygonData, reloadSiteData, children }) => {
  const contextValue: SitePolygonContextType = {
    sitePolygonData,
    reloadSiteData
  };

  return <SitePolygonDataContext.Provider value={contextValue}>{children}</SitePolygonDataContext.Provider>;
};

export const useSitePolygonData = () => {
  const context = useContext(SitePolygonDataContext);
  if (context === undefined) {
    throw new Error("useSitePolygonData must be used within a SitePolygonDataProvider");
  }
  return context;
};
