import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useSyncExternalStore
} from "react";

import type { NurseryIndexRow } from "./nurseryIndex.types";

type Listener = () => void;

class NurseriesSelectionStore {
  private selectedById = new Map<string, NurseryIndexRow>();
  private listeners = new Set<Listener>();

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private emit() {
    this.listeners.forEach(listener => listener());
  }

  getSelectedNurseries = () => Array.from(this.selectedById.values());

  getSelectedCount = () => this.selectedById.size;

  isSelected = (nursery: NurseryIndexRow) => this.selectedById.has(nursery.id);

  getTableFingerprint = (nurseries: NurseryIndexRow[]) =>
    nurseries.map(nursery => (this.selectedById.has(nursery.id) ? "1" : "0")).join("");

  clearSelection = () => {
    if (this.selectedById.size === 0) return;
    this.selectedById = new Map();
    this.emit();
  };

  setNurserySelected = (nursery: NurseryIndexRow, selected: boolean) => {
    if (selected === this.selectedById.has(nursery.id)) return;

    const next = new Map(this.selectedById);
    if (selected) next.set(nursery.id, nursery);
    else next.delete(nursery.id);
    this.selectedById = next;
    this.emit();
  };

  setVisibleNurseriesSelected = (nurseries: NurseryIndexRow[], selected: boolean) => {
    const next = new Map(this.selectedById);
    let changed = false;

    nurseries.forEach(nursery => {
      if (selected === next.has(nursery.id)) return;
      changed = true;
      if (selected) next.set(nursery.id, nursery);
      else next.delete(nursery.id);
    });

    if (!changed) return;
    this.selectedById = next;
    this.emit();
  };
}

const NurseriesSelectionContext = createContext<NurseriesSelectionStore | undefined>(undefined);

const NurseriesSelectionProvider = ({ children }: PropsWithChildren) => {
  const storeRef = useRef<NurseriesSelectionStore>();
  if (storeRef.current == null) storeRef.current = new NurseriesSelectionStore();

  return <NurseriesSelectionContext.Provider value={storeRef.current}>{children}</NurseriesSelectionContext.Provider>;
};

const useNurseriesSelectionStore = () => {
  const store = useContext(NurseriesSelectionContext);
  if (store == null) throw new Error("Nursery selection hooks must be used inside NurseriesSelectionProvider");
  return store;
};

export const useNurseriesSelectionActions = () => {
  const store = useNurseriesSelectionStore();

  return useMemo(
    () => ({
      clearSelection: store.clearSelection,
      setNurserySelected: store.setNurserySelected,
      setVisibleNurseriesSelected: store.setVisibleNurseriesSelected
    }),
    [store]
  );
};

export const useNurseriesSelectionState = () => {
  const store = useNurseriesSelectionStore();
  const selectedCount = useSyncExternalStore(store.subscribe, store.getSelectedCount, store.getSelectedCount);

  return useMemo(() => ({ selectedNurseries: store.getSelectedNurseries(), selectedCount }), [selectedCount, store]);
};

export const useNurseryTableSelection = (nurseries: NurseryIndexRow[]) => {
  const store = useNurseriesSelectionStore();
  const { setNurserySelected, setVisibleNurseriesSelected } = useNurseriesSelectionActions();
  const getFingerprint = useCallback(() => store.getTableFingerprint(nurseries), [nurseries, store]);
  const fingerprint = useSyncExternalStore(store.subscribe, getFingerprint, getFingerprint);

  const selectedRows = useMemo(() => {
    void fingerprint;
    return nurseries.filter(store.isSelected);
  }, [fingerprint, nurseries, store]);

  const isNurserySelected = useCallback((nursery: NurseryIndexRow) => store.isSelected(nursery), [store]);
  const handleRowSelected = useCallback(
    (nursery: NurseryIndexRow, selected: boolean) => setNurserySelected(nursery, selected),
    [setNurserySelected]
  );
  const handleAllItemsSelected = useCallback(
    (selected: boolean, visibleNurseries: NurseryIndexRow[]) => setVisibleNurseriesSelected(visibleNurseries, selected),
    [setVisibleNurseriesSelected]
  );

  return { selectedRows, isNurserySelected, handleRowSelected, handleAllItemsSelected };
};

export default NurseriesSelectionProvider;
