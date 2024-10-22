import React, { createContext, MutableRefObject, PropsWithChildren, useRef } from "react";

type RefContextType = MutableRefObject<HTMLInputElement | null>;

export const RefContext = createContext<RefContextType | null>(null);

const RefProvider = ({ children }: PropsWithChildren) => {
  const sharedRef = useRef<HTMLInputElement | null>(null);

  return <RefContext.Provider value={sharedRef}>{children}</RefContext.Provider>;
};

export default RefProvider;
