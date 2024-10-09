import React, { createContext, ReactNode, useContext } from "react";

export interface CountriesProps {
  data: {
    label: string;
    icon: string;
  };
  id: number;
  country_slug: string;
}
type DashboardType = {
  filters: {
    programmes: string[];
    landscapes: string[];
    country: CountriesProps;
    organizations: string[];
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      programmes: string[];
      landscapes: string[];
      country: { country_slug: string; id: number; data: any };
      organizations: string[];
    }>
  >;
};
const defaultValues: DashboardType = {
  filters: {
    programmes: [],
    landscapes: [],
    country: {
      country_slug: "",
      id: 0,
      data: {
        label: "",
        icon: ""
      }
    },
    organizations: []
  },
  setFilters: () => {}
};
const DashboardContext = createContext<DashboardType>(defaultValues);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFilters] = React.useState<DashboardType["filters"]>(defaultValues.filters);
  const contextValue: DashboardType = {
    filters,
    setFilters
  };
  return <DashboardContext.Provider value={contextValue}>{children}</DashboardContext.Provider>;
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboardContext must be used within a DashboardProvider");
  }
  return context;
};
