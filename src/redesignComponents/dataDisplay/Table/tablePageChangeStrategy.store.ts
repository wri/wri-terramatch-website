import { useSyncExternalStore } from "react";

import Log from "@/utils/log";

/**
 * How a table keeps the user oriented when a page change shrinks it (usually on the last page):
 * - `center`: scroll the table into the middle of the viewport.
 * - `containerTop`: scroll to the top of the table's container (e.g. tab content), so the header is visible.
 * - `fixedHeight`: keep the table as tall as a full page, with empty space on the last page, so nothing shifts.
 */
export const TABLE_PAGE_CHANGE_STRATEGIES = ["center", "containerTop", "fixedHeight"] as const;

export type TablePageChangeStrategy = (typeof TABLE_PAGE_CHANGE_STRATEGIES)[number];

const STORAGE_KEY = "tm-table-page-change-strategy";
const DEFAULT_STRATEGY: TablePageChangeStrategy = "containerTop";

type Listener = () => void;

const listeners = new Set<Listener>();
let currentStrategy: TablePageChangeStrategy | null = null;

const isStrategy = (value: unknown): value is TablePageChangeStrategy =>
  TABLE_PAGE_CHANGE_STRATEGIES.includes(value as TablePageChangeStrategy);

const readStoredStrategy = (): TablePageChangeStrategy => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isStrategy(stored) ? stored : DEFAULT_STRATEGY;
  } catch (error) {
    Log.warn("Unable to read the table page change strategy", error);
    return DEFAULT_STRATEGY;
  }
};

const getSnapshot = () => (currentStrategy ??= readStoredStrategy());

const getServerSnapshot = () => DEFAULT_STRATEGY;

const subscribe = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const setTablePageChangeStrategy = (strategy: TablePageChangeStrategy) => {
  currentStrategy = strategy;
  try {
    window.localStorage.setItem(STORAGE_KEY, strategy);
  } catch (error) {
    Log.warn("Unable to persist the table page change strategy", error);
  }
  listeners.forEach(listener => listener());
};

export const useTablePageChangeStrategy = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
