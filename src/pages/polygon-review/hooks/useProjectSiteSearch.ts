import { useCallback, useMemo, useState } from "react";

import { useSiteIndex } from "@/connections/Entity";
import { useDebounce } from "@/hooks/useDebounce";

import { SiteFilterOption } from "../../site/[uuid]/components/polygonFilter.constants";

const SITE_SEARCH_PAGE_SIZE = 50;
const SITE_SEARCH_DEBOUNCE_MS = 300;

export const useProjectSiteSearch = (projectUuid: string) => {
  const [query, setQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const debouncedSetSearchFilter = useDebounce(setSearchFilter, SITE_SEARCH_DEBOUNCE_MS);

  const [isLoaded, { data: sites }] = useSiteIndex({
    filter: { projectUuid, searchFilter: searchFilter === "" ? undefined : searchFilter },
    pageSize: SITE_SEARCH_PAGE_SIZE,
    pageNumber: 1,
    sortField: "name",
    sortDirection: "ASC"
  });

  const options = useMemo<SiteFilterOption[]>(
    () => (sites ?? []).map(({ uuid, name }) => ({ value: uuid, label: name ?? uuid })),
    [sites]
  );

  const onQueryChange = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      setQuery(trimmed);
      debouncedSetSearchFilter(trimmed);
    },
    [debouncedSetSearchFilter]
  );

  const isDebouncing = query !== searchFilter;
  return { query, options, isLoading: !isLoaded || isDebouncing, onQueryChange };
};
