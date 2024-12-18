import React, { createContext, ReactNode, useContext } from "react";

import { IpolygonFromMap } from "@/admin/components/ResourceTabs/PolygonReviewTab/components/Polygons";

type MonitoredDataType = {
  filters: {
    uuid: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      uuid: string;
    }>
  >;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  indicatorSlug?: string;
  setIndicatorSlug?: React.Dispatch<React.SetStateAction<string>>;
  indicatorSlugAnalysis?: string;
  setIndicatorSlugAnalysis?: React.Dispatch<React.SetStateAction<string>>;
  loadingAnalysis?: boolean;
  setLoadingAnalysis?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectPolygonFromMap?: (value: IpolygonFromMap) => void;
  selectPolygonFromMap?: IpolygonFromMap;
};
const defaultValues: MonitoredDataType = {
  filters: {
    uuid: ""
  },
  setFilters: () => {},
  searchTerm: "",
  setSearchTerm: () => {},
  indicatorSlug: "treeCoverLoss",
  setIndicatorSlug: () => {},
  indicatorSlugAnalysis: "treeCoverLoss",
  setIndicatorSlugAnalysis: () => {},
  loadingAnalysis: false,
  setLoadingAnalysis: () => {},
  setSelectPolygonFromMap: () => {},
  selectPolygonFromMap: { isOpen: false, uuid: "" }
};
const MonitoredDataContext = createContext<MonitoredDataType>(defaultValues);

export const MonitoredDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFilters] = React.useState<MonitoredDataType["filters"]>(defaultValues.filters);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [indicatorSlug, setIndicatorSlug] = React.useState("treeCoverLoss");
  const [indicatorSlugAnalysis, setIndicatorSlugAnalysis] = React.useState("treeCoverLoss");
  const [loadingAnalysis, setLoadingAnalysis] = React.useState<boolean>(false);
  const [selectPolygonFromMap, setSelectPolygonFromMap] = React.useState<IpolygonFromMap>({ isOpen: false, uuid: "" });

  const contextValue: MonitoredDataType = {
    filters,
    setFilters,
    searchTerm,
    setSearchTerm,
    indicatorSlug,
    setIndicatorSlug,
    indicatorSlugAnalysis,
    setIndicatorSlugAnalysis,
    loadingAnalysis,
    setLoadingAnalysis,
    setSelectPolygonFromMap,
    selectPolygonFromMap
  };
  return <MonitoredDataContext.Provider value={contextValue}>{children}</MonitoredDataContext.Provider>;
};

export const useMonitoredDataContext = () => {
  const context = useContext(MonitoredDataContext);
  if (!context) {
    throw new Error("useMonitoredDataContext must be used within a MonitoredDataProvider");
  }
  return context;
};
