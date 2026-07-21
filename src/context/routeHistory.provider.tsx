import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";

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

const AUTH_PATH_PREFIXES = ["/auth/", "/login"];

const isAuthPath = (path: string) => AUTH_PATH_PREFIXES.some(prefix => path === prefix || path.startsWith(prefix));

const getPathname = (path: string) => path.split("?")[0] ?? path;

const RouteHistoryProvider = ({ children }: RouterHistoryProviderProps) => {
  const [history, setHistory] = useState<History[]>([]);
  const router = useRouter();
  const t = useT();

  const resolveTitle = useCallback(
    (path: string, documentTitle?: string) => {
      const pathname = getPathname(path);
      const fromDocument = documentTitle?.trim();
      if (fromDocument) {
        return fromDocument;
      }

      if (pathname === "/home" || pathname === "/") {
        return t("Home");
      }
      if (pathname.startsWith("/my-projects")) {
        return t("My Projects");
      }
      if (pathname.startsWith("/opportunities")) {
        return t("Opportunities");
      }
      if (pathname.startsWith("/organization/")) {
        return t("My Organization");
      }
      if (pathname.startsWith("/project/")) {
        return t("Project");
      }
      if (pathname.startsWith("/applications")) {
        return t("Application details");
      }

      return t("Home");
    },
    [t]
  );

  const push = useCallback((route: History) => {
    const pathname = getPathname(route.path);
    if (isAuthPath(pathname) || route.title != null) {
      return;
    }

    setHistory(current => {
      const last = current[current.length - 1];
      if (last?.path === pathname) {
        if (last.title === route.title) {
          return current;
        }
        return [...current.slice(0, -1), { path: pathname, title: route.title }];
      }
      return [...current, { path: pathname, title: route.title }];
    });
  }, []);

  useEffect(() => {
    const pathname = location.pathname;
    if (isAuthPath(pathname)) {
      return;
    }

    push({
      path: pathname,
      title: resolveTitle(pathname, document.title)
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onRouteChangeComplete = (url: string) => {
      const pathname = getPathname(url);
      if (isAuthPath(pathname)) {
        return;
      }

      // Wait for next/head <title> updates before reading document.title.
      window.setTimeout(() => {
        push({
          path: pathname,
          title: resolveTitle(pathname, window.document.title)
        });
      }, 0);
    };

    router.events.on("routeChangeComplete", onRouteChangeComplete);

    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
  }, [push, resolveTitle, router.events]);

  const previousRoute = useMemo(() => {
    for (let index = history.length - 2; index >= 0; index -= 1) {
      const entry = history[index];
      if (entry != null) {
        return entry;
      }
    }
    return undefined;
  }, [history]);

  return (
    <RouteHistoryContext.Provider
      value={{
        history,
        push,
        previousRoute
      }}
    >
      {children}
    </RouteHistoryContext.Provider>
  );
};

export const useRouteHistoryContext = () => useContext(RouteHistoryContext);

export default RouteHistoryProvider;
