import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useSyncExternalStore
} from "react";

import type { SiteIndexSite } from "./siteIndex.types";

type Listener = () => void;

class SiteIndexSelectionStore {
  private selectedById = new Map<string, SiteIndexSite>();
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

  getSelectedSites = () => Array.from(this.selectedById.values());

  getSelectedCount = () => this.selectedById.size;

  isSelectedId = (id: string) => this.selectedById.has(id);

  getTableFingerprint = (sites: SiteIndexSite[]) =>
    sites.map(site => (this.selectedById.has(site.id) ? "1" : "0")).join("");

  clearSelection = () => {
    if (this.selectedById.size === 0) return;
    this.selectedById = new Map();
    this.emit();
  };

  setSiteSelected = (site: SiteIndexSite, selected: boolean) => {
    if (selected === this.selectedById.has(site.id)) return;

    const next = new Map(this.selectedById);
    if (selected) next.set(site.id, site);
    else next.delete(site.id);
    this.selectedById = next;
    this.emit();
  };

  setVisibleSitesSelected = (sites: SiteIndexSite[], selected: boolean) => {
    const next = new Map(this.selectedById);
    let changed = false;

    sites.forEach(site => {
      if (selected === next.has(site.id)) return;
      changed = true;
      if (selected) next.set(site.id, site);
      else next.delete(site.id);
    });

    if (!changed) return;
    this.selectedById = next;
    this.emit();
  };
}

type SiteIndexSelectionStoreValue = {
  store: SiteIndexSelectionStore;
};

const SiteIndexSelectionStoreContext = createContext<SiteIndexSelectionStoreValue | undefined>(undefined);

const SiteIndexSelectionProvider = ({ children }: PropsWithChildren) => {
  const storeRef = useRef<SiteIndexSelectionStore>();
  if (storeRef.current == null) {
    storeRef.current = new SiteIndexSelectionStore();
  }

  const value = useMemo(() => ({ store: storeRef.current! }), []);

  return <SiteIndexSelectionStoreContext.Provider value={value}>{children}</SiteIndexSelectionStoreContext.Provider>;
};

const useSiteIndexSelectionStore = () => {
  const context = useContext(SiteIndexSelectionStoreContext);
  if (context == null) {
    throw new Error("Site index selection hooks must be used inside SiteIndexSelectionProvider");
  }
  return context.store;
};

export const useSiteIndexSelectionActions = () => {
  const store = useSiteIndexSelectionStore();

  return useMemo(
    () => ({
      clearSelection: store.clearSelection,
      setSiteSelected: store.setSiteSelected,
      setVisibleSitesSelected: store.setVisibleSitesSelected
    }),
    [store]
  );
};

export const useSiteIndexSelectionState = () => {
  const store = useSiteIndexSelectionStore();
  const selectedCount = useSyncExternalStore(store.subscribe, store.getSelectedCount, store.getSelectedCount);

  return useMemo(
    () => ({
      selectedSites: store.getSelectedSites(),
      selectedCount,
      isSiteSelected: (site: SiteIndexSite) => store.isSelectedId(site.id)
    }),
    [selectedCount, store]
  );
};

export const useSiteTableSelection = (sites: SiteIndexSite[]) => {
  const store = useSiteIndexSelectionStore();
  const { setSiteSelected, setVisibleSitesSelected } = useSiteIndexSelectionActions();

  const getFingerprint = useCallback(() => store.getTableFingerprint(sites), [sites, store]);
  const fingerprint = useSyncExternalStore(store.subscribe, getFingerprint, getFingerprint);

  const selectedRows = useMemo(() => {
    void fingerprint;
    return sites.filter(site => store.isSelectedId(site.id));
  }, [fingerprint, sites, store]);

  const isSiteSelected = useCallback((site: SiteIndexSite) => store.isSelectedId(site.id), [store]);

  const handleRowSelected = useCallback(
    (site: SiteIndexSite, selected: boolean) => setSiteSelected(site, selected),
    [setSiteSelected]
  );

  const handleAllItemsSelected = useCallback(
    (selected: boolean, visibleSites: SiteIndexSite[]) => setVisibleSitesSelected(visibleSites, selected),
    [setVisibleSitesSelected]
  );

  return { selectedRows, isSiteSelected, handleRowSelected, handleAllItemsSelected };
};

export default SiteIndexSelectionProvider;
