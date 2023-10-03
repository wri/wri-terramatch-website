import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

type RouteHistoryContextType = {
  history: History[];
  previousRoute?: History;
  push: (route: History) => void;
};

export type History = {
  title: string;
  path: string;
};

export const RouteHistoryContext = React.createContext<RouteHistoryContextType>({
  history: [],
  previousRoute: undefined,
  push: () => {}
});

type RouterHistoryProviderProps = {
  children: React.ReactNode;
};

const RouteHistoryProvider = ({ children }: RouterHistoryProviderProps) => {
  const [history, setHistory] = useState<History[]>([]);
  const router = useRouter();

  const push = (route: History) => {
    if (history?.[history.length - 1]?.path !== route.path) {
      setHistory(h => {
        h.push(route);
        return h;
      });
    }
  };

  useEffect(() => {
    push({
      path: location.pathname,
      title: document.title
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onRouteChangeComplete = (path: string) => {
      push({ path, title: window.document.title });
    };

    router.events.on("routeChangeComplete", onRouteChangeComplete);

    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RouteHistoryContext.Provider
      value={{
        history,
        push,
        previousRoute: history?.[history.length - 1]
      }}
    >
      {children}
    </RouteHistoryContext.Provider>
  );
};

export const useRouteHistoryContext = () => useContext(RouteHistoryContext);

export default RouteHistoryProvider;
