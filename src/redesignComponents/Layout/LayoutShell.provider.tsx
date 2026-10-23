import { createContext, FC, ReactNode, useCallback, useContext, useMemo, useState } from "react";

type LayoutShellContextValue = {
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  isSidebarCollapseDisabled: boolean;
  setSidebarCollapseDisabled: (disabled: boolean) => void;
  pageResetKey: number;
  resetPage: () => void;
};

const defaultLayoutShellContextValue: LayoutShellContextValue = {
  isSidebarCollapsed: false,
  setSidebarCollapsed: () => {},
  isSidebarCollapseDisabled: false,
  setSidebarCollapseDisabled: () => {},
  pageResetKey: 0,
  resetPage: () => {}
};

const LayoutShellContext = createContext<LayoutShellContextValue>(defaultLayoutShellContextValue);

export const LayoutShellProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSidebarCollapseDisabled, setIsSidebarCollapseDisabled] = useState(false);
  const [pageResetKey, setPageResetKey] = useState(0);

  const setSidebarCollapseDisabled = useCallback((disabled: boolean) => {
    setIsSidebarCollapseDisabled(disabled);
  }, []);

  const resetPage = useCallback(() => {
    setPageResetKey(key => key + 1);
  }, []);

  const value = useMemo(
    () => ({
      isSidebarCollapsed,
      setSidebarCollapsed,
      isSidebarCollapseDisabled,
      setSidebarCollapseDisabled,
      pageResetKey,
      resetPage
    }),
    [isSidebarCollapsed, isSidebarCollapseDisabled, setSidebarCollapseDisabled, pageResetKey, resetPage]
  );

  return <LayoutShellContext.Provider value={value}>{children}</LayoutShellContext.Provider>;
};

export const useLayoutShell = (): LayoutShellContextValue => {
  return useContext(LayoutShellContext);
};
