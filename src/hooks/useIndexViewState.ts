import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export const INDEX_SEARCH_DEBOUNCE_MS = 300;

type UseIndexViewStateOptions = {
  basePath: string;
  allProjectsValue: string;
  onViewChange: () => void;
};

export const useIndexViewState = ({ basePath, allProjectsValue, onViewChange }: UseIndexViewStateOptions) => {
  const router = useRouter();
  const [view, setView] = useState(allProjectsValue);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [hasHydratedQuery, setHasHydratedQuery] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedQuery(query.trim()), INDEX_SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    if (!router.isReady) return;
    const projectFromQuery = router.query.project;
    setView(typeof projectFromQuery === "string" && projectFromQuery !== "" ? projectFromQuery : allProjectsValue);
    setHasHydratedQuery(true);
  }, [allProjectsValue, router.isReady, router.query.project]);

  const handleViewChange = useCallback(
    (value: string) => {
      onViewChange();
      setView(value);
      const href = value === allProjectsValue ? basePath : `${basePath}?project=${value}`;
      void router.replace(href, undefined, { shallow: true });
    },
    [allProjectsValue, basePath, onViewChange, router]
  );

  return { view, query, setQuery, debouncedQuery, hasHydratedQuery, handleViewChange };
};
