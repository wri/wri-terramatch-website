import React, { createContext, ReactNode, useContext } from "react";

export type ReportsFilterValues = {
  dueDateFrom: string;
  dueDateTo: string;
  dueMonth: string;
  dueYear: string;
  reportTypes: string[];
  statuses: string[];
};

export type ReportsFilters = React.Dispatch<React.SetStateAction<ReportsFilterValues>>;

type ReportsType = {
  filters: ReportsFilterValues;
  setFilters: ReportsFilters;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

const EMPTY_FILTERS: ReportsFilterValues = {
  dueDateFrom: "",
  dueDateTo: "",
  dueMonth: "",
  dueYear: "",
  reportTypes: [],
  statuses: []
};

const ReportsContext = createContext<ReportsType | undefined>(undefined);

export const ReportsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFilters] = React.useState<ReportsFilterValues>(EMPTY_FILTERS);
  const [searchTerm, setSearchTerm] = React.useState("");

  return (
    <ReportsContext.Provider value={{ filters, setFilters, searchTerm, setSearchTerm }}>
      {children}
    </ReportsContext.Provider>
  );
};

export const useReportsContext = () => {
  const context = useContext(ReportsContext);
  if (context == null) {
    throw new Error("useReportsContext must be used within a ReportsProvider");
  }
  return context;
};
