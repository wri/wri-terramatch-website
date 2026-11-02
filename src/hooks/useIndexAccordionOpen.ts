import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type StoredAccordionState = { open: boolean; resetValue: string };

export type IndexAccordionStates = Map<string, StoredAccordionState>;

type IndexAccordionStorage = { scope: string; states: IndexAccordionStates };

export const IndexAccordionStorageContext = createContext<IndexAccordionStorage | null>(null);

type IndexAccordionOpenOptions = {
  defaultOpen: boolean;
  resetKey?: string;
  restoreOpen?: boolean;
  storageKey?: string;
};

export const useIndexAccordionOpen = ({
  defaultOpen,
  resetKey,
  restoreOpen,
  storageKey
}: IndexAccordionOpenOptions) => {
  const storage = useContext(IndexAccordionStorageContext);
  const stateKey = storage == null || storageKey == null ? null : `${storage.scope}:${storageKey}`;
  const resetValue = `${defaultOpen}:${resetKey}`;
  const stored = stateKey == null ? undefined : storage?.states.get(stateKey);
  const [open, setOpen] = useState(
    restoreOpen ?? (stored != null && stored.resetValue === resetValue ? stored.open : defaultOpen)
  );

  const setAndStoreOpen = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      if (stateKey != null) storage?.states.set(stateKey, { open: nextOpen, resetValue });
    },
    [resetValue, stateKey, storage]
  );

  const lastResetValue = useRef(resetValue);
  useEffect(() => {
    if (lastResetValue.current === resetValue) return;
    lastResetValue.current = resetValue;
    if (restoreOpen == null) setAndStoreOpen(defaultOpen);
  }, [defaultOpen, resetValue, restoreOpen, setAndStoreOpen]);

  return [open, setAndStoreOpen] as const;
};
