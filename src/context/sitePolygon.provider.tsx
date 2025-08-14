import React, { createContext, ReactNode, useContext } from "react";

import { SitePolygonFullDto } from "@/generated/v3/researchService/researchServiceSchemas";

export type SitePolygonData = {
  data: SitePolygonFullDto[];
};

type SitePolygonContextType = {
  sitePolygonData: SitePolygonFullDto[] | undefined;
  reloadSiteData: () => void;
};

const SitePolygonDataContext = createContext<SitePolygonContextType | undefined>(undefined);

export const SitePolygonDataProvider: React.FC<{
  sitePolygonData: SitePolygonFullDto[] | undefined;
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
  return context;
};
