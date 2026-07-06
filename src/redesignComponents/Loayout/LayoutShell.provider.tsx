import { createContext, FC, ReactNode, useCallback, useContext, useMemo, useState } from "react";

type LayoutShellContextValue = {
  isSidebarCollapseDisabled: boolean;
  setSidebarCollapseDisabled: (disabled: boolean) => void;
};

const defaultLayoutShellContextValue: LayoutShellContextValue = {
  isSidebarCollapseDisabled: false,
  setSidebarCollapseDisabled: () => {}
};

const LayoutShellContext = createContext<LayoutShellContextValue>(defaultLayoutShellContextValue);

export const LayoutShellProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isSidebarCollapseDisabled, setIsSidebarCollapseDisabled] = useState(false);

  const setSidebarCollapseDisabled = useCallback((disabled: boolean) => {
    setIsSidebarCollapseDisabled(disabled);
  }, []);

  const value = useMemo(
    () => ({
      isSidebarCollapseDisabled,
      setSidebarCollapseDisabled
    }),
    [isSidebarCollapseDisabled, setSidebarCollapseDisabled]
  );

  return <LayoutShellContext.Provider value={value}>{children}</LayoutShellContext.Provider>;
};

export const useLayoutShell = (): LayoutShellContextValue => {
  return useContext(LayoutShellContext);
};
