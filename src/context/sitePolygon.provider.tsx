import React, { createContext, ReactNode, useContext } from "react";

import { SitePolygonsDataResponse } from "@/generated/apiSchemas";

type SitePolygonData = {
  data: SitePolygonsDataResponse;
};

const SitePolygonDataContext = createContext<any>(null);

export const SitePolygonDataProvider: React.FC<{
  sitePolygonData: SitePolygonData | undefined;
  children: ReactNode;
}> = ({ sitePolygonData, children }) => {
  return <SitePolygonDataContext.Provider value={sitePolygonData}>{children}</SitePolygonDataContext.Provider>;
};

export const useSitePolygonData = () => {
  return useContext(SitePolygonDataContext);
};
