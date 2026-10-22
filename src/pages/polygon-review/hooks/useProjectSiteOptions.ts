import { useMemo } from "react";

import { useSiteIndex } from "@/connections/Entity";

import { SiteFilterOption } from "../../site/[uuid]/components/polygonFilter.constants";

// The API's page size cap. The combobox filters options client side, so it needs every site in one page.
const SITE_OPTIONS_PAGE_SIZE = 100;

/** The project's sites as Site filter options, sorted by name. Undefined until they're loaded. */
export const useProjectSiteOptions = (projectUuid: string | undefined): SiteFilterOption[] | undefined => {
  const [isLoaded, { data: sites }] = useSiteIndex({
    filter: { projectUuid },
    pageSize: SITE_OPTIONS_PAGE_SIZE,
    pageNumber: 1,
    sortField: "name",
    sortDirection: "ASC",
    enabled: projectUuid != null
  });

  return useMemo(
    () =>
      isLoaded && sites != null ? sites.map(({ uuid, name }) => ({ value: uuid, label: name ?? uuid })) : undefined,
    [isLoaded, sites]
  );
};
