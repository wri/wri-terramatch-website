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
  // Filters are kept per tab so that each tab always reads the filters that belong to the tab it renders.
  filtersByTab: Record<string, ReportFilterState>;
  setFiltersByTab: React.Dispatch<React.SetStateAction<Record<string, ReportFilterState>>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  queryByTab: Record<string, string>;
  setQueryByTab: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  viewByTab: Record<string, string>;
  setViewByTab: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  accordionStates: IndexAccordionStates;
};

const ReportsContext = createContext<ReportsType | undefined>(undefined);

export const ReportsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filtersByTab, setFiltersByTab] = React.useState<Record<string, ReportFilterState>>({
    "progress-reports": EMPTY_REPORT_FILTERS,
    "additional-reports": EMPTY_REPORT_FILTERS
  });
  const [searchTerm, setSearchTerm] = React.useState("");
  const [queryByTab, setQueryByTab] = React.useState<Record<string, string>>({});
  const [viewByTab, setViewByTab] = React.useState<Record<string, string>>({});
  const [accordionStates] = React.useState<IndexAccordionStates>(() => new Map());

  return (
    <ReportsContext.Provider
      value={{
        filtersByTab,
        setFiltersByTab,
        searchTerm,
        setSearchTerm,
        queryByTab,
        setQueryByTab,
        viewByTab,
        setViewByTab,
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

/** The filters of one tab. Pass the tab that is being rendered so the filters always match it. */
export const useReportsTabFilters = (tab: string): ReportFilterState => {
  const { filtersByTab } = useReportsContext();
  return filtersByTab[tab] ?? EMPTY_REPORT_FILTERS;
};
