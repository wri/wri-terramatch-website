import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useSyncExternalStore
} from "react";

import type { ReportIndexItem } from "./reportIndex.types";

const getSelectionKey = (report: ReportIndexItem) => `${report.type}:${report.id}`;

type Listener = () => void;

class ReportsSelectionStore {
  private selectedByKey = new Map<string, ReportIndexItem>();
  private listeners = new Set<Listener>();

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private emit() {
    this.listeners.forEach(listener => listener());
  }

  getSelectedReports = () => Array.from(this.selectedByKey.values());

  getSelectedCount = () => this.selectedByKey.size;

  isSelectedKey = (key: string) => this.selectedByKey.has(key);

  getTableFingerprint = (reports: ReportIndexItem[]) =>
    reports.map(report => (this.selectedByKey.has(getSelectionKey(report)) ? "1" : "0")).join("");

  clearSelection = () => {
    if (this.selectedByKey.size === 0) return;
    this.selectedByKey = new Map();
    this.emit();
  };

  setReportSelected = (report: ReportIndexItem, selected: boolean) => {
    const key = getSelectionKey(report);
    if (selected === this.selectedByKey.has(key)) return;

    const next = new Map(this.selectedByKey);
    if (selected) next.set(key, report);
    else next.delete(key);
    this.selectedByKey = next;
    this.emit();
  };

  setVisibleReportsSelected = (reports: ReportIndexItem[], selected: boolean) => {
    const next = new Map(this.selectedByKey);
    let changed = false;

    reports.forEach(report => {
      const key = getSelectionKey(report);
      if (selected === next.has(key)) return;
      changed = true;
      if (selected) next.set(key, report);
      else next.delete(key);
    });

    if (!changed) return;
    this.selectedByKey = next;
    this.emit();
  };
}

type ReportsSelectionStoreValue = {
  store: ReportsSelectionStore;
};

const ReportsSelectionStoreContext = createContext<ReportsSelectionStoreValue | undefined>(undefined);

const ReportsSelectionProvider = ({ children }: PropsWithChildren) => {
  const storeRef = useRef<ReportsSelectionStore>();
  if (storeRef.current == null) {
    storeRef.current = new ReportsSelectionStore();
  }

  const value = useMemo(() => ({ store: storeRef.current! }), []);

  return <ReportsSelectionStoreContext.Provider value={value}>{children}</ReportsSelectionStoreContext.Provider>;
};

const useReportsSelectionStore = () => {
  const context = useContext(ReportsSelectionStoreContext);
  if (context == null) {
    throw new Error("Reports selection hooks must be used inside ReportsSelectionProvider");
  }
  return context.store;
};

export const useReportsSelectionActions = () => {
  const store = useReportsSelectionStore();

  return useMemo(
    () => ({
      clearSelection: store.clearSelection,
      setReportSelected: store.setReportSelected,
      setVisibleReportsSelected: store.setVisibleReportsSelected
    }),
    [store]
  );
};

export const useReportsSelectionState = () => {
  const store = useReportsSelectionStore();
  const selectedCount = useSyncExternalStore(store.subscribe, store.getSelectedCount, store.getSelectedCount);

  return useMemo(
    () => ({
      selectedReports: store.getSelectedReports(),
      selectedCount,
      isReportSelected: (report: ReportIndexItem) => store.isSelectedKey(getSelectionKey(report))
    }),
    [selectedCount, store]
  );
};

export const useReportsSelection = () => {
  const actions = useReportsSelectionActions();
  const state = useReportsSelectionState();
  return { ...actions, ...state };
};

export const useReportTableSelection = <T extends ReportIndexItem>(reports: T[]) => {
  const store = useReportsSelectionStore();
  const { setReportSelected, setVisibleReportsSelected } = useReportsSelectionActions();

  const getFingerprint = useCallback(() => store.getTableFingerprint(reports), [reports, store]);
  const fingerprint = useSyncExternalStore(store.subscribe, getFingerprint, getFingerprint);

  const selectedRows = useMemo(() => {
    void fingerprint;
    return reports.filter(report => store.isSelectedKey(getSelectionKey(report)));
  }, [fingerprint, reports, store]);

  const isReportSelected = useCallback((report: T) => store.isSelectedKey(getSelectionKey(report)), [store]);

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
