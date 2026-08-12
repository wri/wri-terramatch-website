import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react";

import type { ReportIndexItem } from "./reportIndex.types";

type ReportsSelectionContextValue = {
  selectedReports: ReportIndexItem[];
  clearSelection: () => void;
  isReportSelected: (report: ReportIndexItem) => boolean;
  setReportSelected: (report: ReportIndexItem, selected: boolean) => void;
  setVisibleReportsSelected: (reports: ReportIndexItem[], selected: boolean) => void;
};

const ReportsSelectionContext = createContext<ReportsSelectionContextValue | undefined>(undefined);

const getSelectionKey = (report: ReportIndexItem) => `${report.type}:${report.id}`;

const ReportsSelectionProvider = ({ children }: PropsWithChildren) => {
  const [selectedByKey, setSelectedByKey] = useState<Map<string, ReportIndexItem>>(new Map());

  const clearSelection = useCallback(() => setSelectedByKey(new Map()), []);

  const isReportSelected = useCallback(
    (report: ReportIndexItem) => selectedByKey.has(getSelectionKey(report)),
    [selectedByKey]
  );

  const setReportSelected = useCallback((report: ReportIndexItem, selected: boolean) => {
    setSelectedByKey(current => {
      const next = new Map(current);
      const key = getSelectionKey(report);
      if (selected) next.set(key, report);
      else next.delete(key);
      return next;
    });
  }, []);

  const setVisibleReportsSelected = useCallback((reports: ReportIndexItem[], selected: boolean) => {
    setSelectedByKey(current => {
      const next = new Map(current);
      reports.forEach(report => {
        const key = getSelectionKey(report);
        if (selected) next.set(key, report);
        else next.delete(key);
      });
      return next;
    });
  }, []);

  const value = useMemo<ReportsSelectionContextValue>(
    () => ({
      selectedReports: Array.from(selectedByKey.values()),
      clearSelection,
      isReportSelected,
      setReportSelected,
      setVisibleReportsSelected
    }),
    [clearSelection, isReportSelected, selectedByKey, setReportSelected, setVisibleReportsSelected]
  );

  return <ReportsSelectionContext.Provider value={value}>{children}</ReportsSelectionContext.Provider>;
};

export const useReportsSelection = () => {
  const context = useContext(ReportsSelectionContext);
  if (context == null) throw new Error("useReportsSelection must be used inside ReportsSelectionProvider");
  return context;
};

export const useReportTableSelection = <T extends ReportIndexItem>(reports: T[]) => {
  const { isReportSelected, setReportSelected, setVisibleReportsSelected } = useReportsSelection();
  const selectedRows = useMemo(() => reports.filter(isReportSelected), [isReportSelected, reports]);

  const handleRowSelected = useCallback(
    (report: T, selected: boolean) => setReportSelected(report, selected),
    [setReportSelected]
  );

  const handleAllItemsSelected = useCallback(
    (selected: boolean, visibleReports: T[]) => setVisibleReportsSelected(visibleReports, selected),
    [setVisibleReportsSelected]
  );

  return { selectedRows, isReportSelected, handleRowSelected, handleAllItemsSelected };
};

export default ReportsSelectionProvider;
