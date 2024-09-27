import React, { createContext, useContext, useMemo, useState } from "react";

type LoadingContextType = {
  loading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
};

const LoadingContext = createContext<LoadingContextType>({
  loading: false,
  showLoader: () => {},
  hideLoader: () => {}
});

const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);

  const value = useMemo(
    () => ({
      loading,
      showLoader,
      hideLoader
    }),
    [loading]
  );

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};

const useLoading = () => useContext(LoadingContext);

export { LoadingProvider, useLoading };
