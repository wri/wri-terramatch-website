import { useLayoutEffect, useSyncExternalStore } from "react";

type RowId = string | number;
type Listener = () => void;

let selectedRowIds = new Set<RowId>();
let hoveredPolygonUuid: string | null = null;
let pendingPolygonFocusUuid: string | null = null;

const selectedListeners = new Map<RowId, Set<Listener>>();
const hoverListeners = new Map<RowId, Set<Listener>>();
const globalHoverListeners = new Set<Listener>();
const globalSelectionListeners = new Set<Listener>();

const noopUnsubscribe = () => {};

const notifySelected = (rowId: RowId) => {
  selectedListeners.get(rowId)?.forEach(listener => listener());
};

const notifyHover = (rowId: RowId) => {
  hoverListeners.get(rowId)?.forEach(listener => listener());
};

const notifyGlobalHover = () => {
  globalHoverListeners.forEach(listener => listener());
};

const notifyGlobalSelection = () => {
  globalSelectionListeners.forEach(listener => listener());
};

const subscribeSelected = (rowId: RowId, listener: Listener) => {
  let listeners = selectedListeners.get(rowId);
  if (listeners == null) {
    listeners = new Set();
    selectedListeners.set(rowId, listeners);
  }
  listeners.add(listener);
  return () => {
    listeners?.delete(listener);
    if (listeners?.size === 0) {
      selectedListeners.delete(rowId);
    }
  };
};

const subscribeHover = (rowId: RowId, listener: Listener) => {
  let listeners = hoverListeners.get(rowId);
  if (listeners == null) {
    listeners = new Set();
    hoverListeners.set(rowId, listeners);
  }
  listeners.add(listener);
  return () => {
    listeners?.delete(listener);
    if (listeners?.size === 0) {
      hoverListeners.delete(rowId);
    }
  };
};

const subscribeGlobalHover = (listener: Listener) => {
  globalHoverListeners.add(listener);
  return () => {
    globalHoverListeners.delete(listener);
  };
};

const applyHoveredPolygonUuid = (next: string | null) => {
  const prev = hoveredPolygonUuid;
  if (prev === next) {
    return;
  }

  hoveredPolygonUuid = next;
  if (prev != null) {
    notifyHover(prev);
  }
  if (next != null) {
    notifyHover(next);
  }
  notifyGlobalHover();
};

export const setPolygonTableHoveredUuid = (uuid: string | null) => {
  applyHoveredPolygonUuid(uuid);
};

export const setPendingPolygonFocusUuid = (uuid: string) => {
  pendingPolygonFocusUuid = uuid;
};

export const consumePendingPolygonFocusUuid = (): string | null => {
  const uuid = pendingPolygonFocusUuid;
  pendingPolygonFocusUuid = null;
  return uuid;
};

export const getPolygonTableHoveredUuid = () => hoveredPolygonUuid;

export const syncPolygonTableSelectedRowIds = (next: Set<RowId>) => {
  const prev = selectedRowIds;
  const changed = new Set<RowId>();

  for (const id of next) {
    if (!prev.has(id)) {
      changed.add(id);
    }
  }
  for (const id of prev) {
    if (!next.has(id)) {
      changed.add(id);
    }
  }

  if (changed.size === 0) {
    return;
  }

  selectedRowIds = next;
  changed.forEach(notifySelected);
  notifyGlobalSelection();
};

export const getPolygonTableHasSelection = () => selectedRowIds.size > 0;

export const getPolygonRowIsSelected = (rowId: RowId) => selectedRowIds.has(rowId);

export const getPolygonRowIsHovered = (rowId: RowId) => hoveredPolygonUuid === rowId;

export const usePolygonRowSelected = (rowId: RowId) =>
  useSyncExternalStore(
    listener => subscribeSelected(rowId, listener),
    () => getPolygonRowIsSelected(rowId),
    () => getPolygonRowIsSelected(rowId)
  );

export const usePolygonRowHovered = (rowId: RowId) =>
  useSyncExternalStore(
    listener => subscribeHover(rowId, listener),
    () => getPolygonRowIsHovered(rowId),
    () => getPolygonRowIsHovered(rowId)
  );

export const usePolygonTableHoveredUuid = (enabled = true) =>
  useSyncExternalStore(
    enabled ? subscribeGlobalHover : () => noopUnsubscribe,
    () => (enabled ? hoveredPolygonUuid : null),
    () => null
  );

export const usePolygonTableHasSelection = () =>
  useSyncExternalStore(
    listener => {
      globalSelectionListeners.add(listener);
      return () => {
        globalSelectionListeners.delete(listener);
      };
    },
    () => getPolygonTableHasSelection(),
    () => false
  );

export const useSyncPolygonTableSelectionStore = (selectedIds: Set<RowId>) => {
  useLayoutEffect(() => {
    syncPolygonTableSelectedRowIds(selectedIds);
  }, [selectedIds]);

  useLayoutEffect(() => {
    return () => {
      syncPolygonTableSelectedRowIds(new Set());
      setPolygonTableHoveredUuid(null);
    };
  }, []);
};
