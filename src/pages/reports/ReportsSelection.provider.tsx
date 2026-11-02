import { createIndexSelection } from "@/hooks/createIndexSelection";

import type { ReportIndexItem } from "./reportIndex.types";

const reportSelection = createIndexSelection<ReportIndexItem>(report => `${report.type}:${report.id}`);

const ReportsSelectionProvider = reportSelection.Provider;

export const useReportsSelectionActions = () => {
  const { clearSelection, setItemSelected, setItemsSelected } = reportSelection.useSelectionActions();

  return { clearSelection, setReportSelected: setItemSelected, setVisibleReportsSelected: setItemsSelected };
};

export const useReportsSelectionState = () => {
  const { selectedItems, selectedCount, isSelected } = reportSelection.useSelectionState();

  return { selectedReports: selectedItems, selectedCount, isReportSelected: isSelected };
};

export const useReportsSelection = () => {
  const actions = useReportsSelectionActions();
  const state = useReportsSelectionState();
  return { ...actions, ...state };
};

export const useReportTableSelection = <T extends ReportIndexItem>(reports: T[]) => {
  const { selectedRows, isSelected, handleRowSelected, handleAllItemsSelected } =
    reportSelection.useTableSelection(reports);

  return { selectedRows, isReportSelected: isSelected, handleRowSelected, handleAllItemsSelected };
};

export default ReportsSelectionProvider;
