import { createContext, Dispatch, ReactNode, useContext, useState } from "react";

import { OptionValue } from "@/types/common";

type CurrencyType = {
  currency: OptionValue;
  setCurrency: Dispatch<OptionValue>;
};
const defaultValues: CurrencyType = {
  currency: "",
  setCurrency: () => {}
};
const CurrencyContext = createContext<CurrencyType>(defaultValues);

export const CurrencyProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [currency, setCurrency] = useState<OptionValue>("");
  const contextValue: CurrencyType = {
    currency,
    setCurrency
  };
  return <CurrencyContext.Provider value={contextValue}>{children}</CurrencyContext.Provider>;
};

export const useCurrencyContext = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrencyContext must be used within a CurrencyProvider");
  }
  return context;
};
