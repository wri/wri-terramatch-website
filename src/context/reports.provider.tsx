import React, { createContext, ReactNode, useContext } from "react";

import { IndexAccordionStates } from "@/hooks/useIndexAccordionOpen";
import { EMPTY_REPORT_FILTERS, ReportFilterState } from "@/pages/reports/components/reportFilter.constants";

export type ReportsFilterValues = {
  dueDateFrom: string;
  dueDateTo: string;
  dueMonth: string;
  dueYear: string;
  reportTypes: string[];
  statuses: string[];
  updateStatuses: string[];
};

type ReportsType = {
  // One filter state for every tab, so a filter applied in one tab still applies after switching tabs.
  filters: ReportFilterState;
  setFilters: React.Dispatch<React.SetStateAction<ReportFilterState>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  queryByTab: Record<string, string>;
  setQueryByTab: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  accordionStates: IndexAccordionStates;
};

const ReportsContext = createContext<ReportsType | undefined>(undefined);

export const ReportsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFilters] = React.useState<ReportFilterState>(EMPTY_REPORT_FILTERS);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [queryByTab, setQueryByTab] = React.useState<Record<string, string>>({});
  const [accordionStates] = React.useState<IndexAccordionStates>(() => new Map());

  return (
    <ReportsContext.Provider
      value={{
        filters,
        setFilters,
        searchTerm,
        setSearchTerm,
        queryByTab,
        setQueryByTab,
        accordionStates
      }}
    >
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

/** The report filters shared by every tab of the page. */
export const useReportsFilters = (): ReportFilterState => useReportsContext().filters;
