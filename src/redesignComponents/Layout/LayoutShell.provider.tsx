import { createContext, FC, ReactNode, useCallback, useContext, useMemo, useState } from "react";

type LayoutShellContextValue = {
  isSidebarCollapseDisabled: boolean;
  setSidebarCollapseDisabled: (disabled: boolean) => void;
  pageResetKey: number;
  resetPage: () => void;
};

const defaultLayoutShellContextValue: LayoutShellContextValue = {
  isSidebarCollapseDisabled: false,
  setSidebarCollapseDisabled: () => {},
  pageResetKey: 0,
  resetPage: () => {}
};

const LayoutShellContext = createContext<LayoutShellContextValue>(defaultLayoutShellContextValue);

export const LayoutShellProvider: FC<{ children: ReactNode }> = ({ children }) => {
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
      isSidebarCollapseDisabled,
      setSidebarCollapseDisabled,
      pageResetKey,
      resetPage
    }),
    [isSidebarCollapseDisabled, setSidebarCollapseDisabled, pageResetKey, resetPage]
  );

  return <LayoutShellContext.Provider value={value}>{children}</LayoutShellContext.Provider>;
};

export const useLayoutShell = (): LayoutShellContextValue => {
  return useContext(LayoutShellContext);
};
