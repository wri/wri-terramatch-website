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
    uuid: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      programmes: string[];
      landscapes: string[];
      country: { country_slug: string; id: number; data: any };
      organizations: string[];
      uuid: string;
    }>
  >;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  frameworks: { framework_slug?: string; name?: string }[];
  setFrameworks: React.Dispatch<React.SetStateAction<{ framework_slug?: string; name?: string }[]>>;
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
    organizations: [],
    uuid: ""
  },
  setFilters: () => {},
  searchTerm: "",
  setSearchTerm: () => {},
  frameworks: [],
  setFrameworks: () => {}
};
const DashboardContext = createContext<DashboardType>(defaultValues);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFilters] = React.useState<DashboardType["filters"]>(defaultValues.filters);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [frameworks, setFrameworks] = React.useState<{ framework_slug?: string; name?: string }[]>([]);
  const contextValue: DashboardType = {
    filters,
    setFilters,
    searchTerm,
    setSearchTerm,
    frameworks,
    setFrameworks
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
