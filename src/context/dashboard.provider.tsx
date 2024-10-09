import React, { createContext, ReactNode, useContext } from "react";

const defaultValues = {};
const DashboardContext = createContext<any>(defaultValues);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const contextValue = {};
  return <DashboardContext.Provider value={contextValue}>{children}</DashboardContext.Provider>;
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboardContext must be used within a DashboardProvider");
  }
  return context;
};
