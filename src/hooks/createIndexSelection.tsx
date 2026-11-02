import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useSyncExternalStore
} from "react";

type Listener = () => void;

class IndexSelectionStore<T> {
  private selectedByKey = new Map<string, T>();
  private listeners = new Set<Listener>();
  private readonly getKey: (item: T) => string;

  constructor(getKey: (item: T) => string) {
    this.getKey = getKey;
  }

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private emit() {
    this.listeners.forEach(listener => listener());
  }

  getSelectedItems = () => Array.from(this.selectedByKey.values());

  getSelectedCount = () => this.selectedByKey.size;

  isSelected = (item: T) => this.selectedByKey.has(this.getKey(item));

  getTableFingerprint = (items: T[]) => items.map(item => (this.isSelected(item) ? "1" : "0")).join("");

  clearSelection = () => {
    if (this.selectedByKey.size === 0) return;
    this.selectedByKey = new Map();
    this.emit();
  };

  setItemsSelected = (items: T[], selected: boolean) => {
    const next = new Map(this.selectedByKey);
    let changed = false;

    items.forEach(item => {
      const key = this.getKey(item);
      if (selected === next.has(key)) return;
      changed = true;
      if (selected) next.set(key, item);
      else next.delete(key);
    });

    if (!changed) return;
    this.selectedByKey = next;
    this.emit();
  };
}

export function createIndexSelection<T>(getKey: (item: T) => string) {
  const StoreContext = createContext<IndexSelectionStore<T> | undefined>(undefined);

  const IndexSelectionProvider: FC<PropsWithChildren> = ({ children }) => {
    const storeRef = useRef<IndexSelectionStore<T>>();
    if (storeRef.current == null) storeRef.current = new IndexSelectionStore(getKey);

    return <StoreContext.Provider value={storeRef.current}>{children}</StoreContext.Provider>;
  };

  const useSelectionStore = () => {
    const store = useContext(StoreContext);
    if (store == null) throw new Error("Index selection hooks must be used inside their selection provider");
    return store;
  };

  const useSelectionActions = () => {
    const store = useSelectionStore();

    return useMemo(
      () => ({
        clearSelection: store.clearSelection,
        setItemSelected: (item: T, selected: boolean) => store.setItemsSelected([item], selected),
        setItemsSelected: store.setItemsSelected
      }),
      [store]
    );
  };

  const useSelectionState = () => {
    const store = useSelectionStore();
    const selectedCount = useSyncExternalStore(store.subscribe, store.getSelectedCount, store.getSelectedCount);

    return useMemo(
      () => ({ selectedItems: store.getSelectedItems(), selectedCount, isSelected: store.isSelected }),
      [selectedCount, store]
    );
  };

  const useTableSelection = <R extends T>(items: R[]) => {
    const store = useSelectionStore();
    const { setItemSelected, setItemsSelected } = useSelectionActions();

    const getFingerprint = useCallback(() => store.getTableFingerprint(items), [items, store]);
    const fingerprint = useSyncExternalStore(store.subscribe, getFingerprint, getFingerprint);

    const selectedRows = useMemo(() => {
      void fingerprint;
      return items.filter(store.isSelected);
    }, [fingerprint, items, store]);

    const isSelected = useCallback((item: T) => store.isSelected(item), [store]);
    const handleRowSelected = useCallback(
      (item: R, selected: boolean) => setItemSelected(item, selected),
      [setItemSelected]
    );
    const handleAllItemsSelected = useCallback(
      (selected: boolean, visibleItems: R[]) => setItemsSelected(visibleItems, selected),
      [setItemsSelected]
    );

    return { selectedRows, isSelected, handleRowSelected, handleAllItemsSelected };
  };

  return {
    Provider: IndexSelectionProvider,
    useSelectionActions,
    useSelectionState,
    useTableSelection
  };
}
