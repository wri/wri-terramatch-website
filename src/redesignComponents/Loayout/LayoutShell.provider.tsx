import { createContext, FC, ReactNode, useCallback, useContext, useMemo, useState } from "react";

type LayoutShellContextValue = {
  isSidebarCollapseDisabled: boolean;
  setSidebarCollapseDisabled: (disabled: boolean) => void;
  isBulkActionToolbarVisible: boolean;
  setBulkActionToolbarVisible: (visible: boolean) => void;
};

const defaultLayoutShellContextValue: LayoutShellContextValue = {
  isSidebarCollapseDisabled: false,
  setSidebarCollapseDisabled: () => {},
  isBulkActionToolbarVisible: false,
  setBulkActionToolbarVisible: () => {}
};

const LayoutShellContext = createContext<LayoutShellContextValue>(defaultLayoutShellContextValue);

export const LayoutShellProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isSidebarCollapseDisabled, setIsSidebarCollapseDisabled] = useState(false);
  const [isBulkActionToolbarVisible, setIsBulkActionToolbarVisible] = useState(false);

  const setSidebarCollapseDisabled = useCallback((disabled: boolean) => {
    setIsSidebarCollapseDisabled(disabled);
  }, []);

  const setBulkActionToolbarVisible = useCallback((visible: boolean) => {
    setIsBulkActionToolbarVisible(visible);
  }, []);

  const value = useMemo(
    () => ({
      isSidebarCollapseDisabled,
      setSidebarCollapseDisabled,
      isBulkActionToolbarVisible,
      setBulkActionToolbarVisible
    }),
    [isSidebarCollapseDisabled, setSidebarCollapseDisabled, isBulkActionToolbarVisible, setBulkActionToolbarVisible]
  );

  return <LayoutShellContext.Provider value={value}>{children}</LayoutShellContext.Provider>;
};

export const useLayoutShell = (): LayoutShellContextValue => {
  return useContext(LayoutShellContext);
};
