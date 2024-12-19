import { isEmpty } from "lodash";
import { useCallback, useMemo } from "react";

import { getAccessToken } from "@/admin/apiProvider/utils/token";
import { resolveUrl } from "@/generated/v3/utils";

type ScientificName = { taxonId: string; scientificName: string };

async function searchRequest(search: string) {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  const accessToken = typeof window !== "undefined" && getAccessToken();
  if (accessToken != null) headers.Authorization = `Bearer ${accessToken}`;

  const url = resolveUrl(`/trees/v3/scientific-names`, { search });
  const response = await fetch(url, { headers });
  if (!response.ok) {
    let error;
    try {
      error = {
        statusCode: response.status,
        ...(await response.json())
      };
    } catch (e) {
      error = { statusCode: -1 };
    }

    throw error;
  }

  const payload = await response.json();
  const data = payload.data as { id: string; attributes: { scientificName: string } }[];
  return data.map(({ id, attributes: { scientificName } }) => ({ taxonId: id, scientificName } as ScientificName));
}

/**
 * This accesses the v3 tree species search endpoint, but skips the Connection system and the
 * top level redux caching. Instead, it provides a simple method to issue a search and will return
 * the locally cached result if the same search is issued multiple times (as can happen if a user
 * types some characters, then backspaces a couple to type new ones).
 */
export function useAutocompleteSearch() {
  const cache = useMemo(() => new Map<string, ScientificName[]>(), []);

  const autocompleteSearch = useCallback(
    async (search: string): Promise<string[]> => {
      const mapNames = (names: ScientificName[]) => names.map(({ scientificName }) => scientificName);

      if (isEmpty(search)) return [];
      if (cache.has(search)) return mapNames(cache.get(search) as ScientificName[]);

      const names = await searchRequest(search);
      cache.set(search, names);
      return mapNames(names);
    },
    [cache]
  );

  const findTaxonId = useCallback(
    (name: string) => {
      for (const names of cache.values()) {
        const found = names.find(({ scientificName }) => scientificName === name);
        if (found != null) return found.taxonId;
      }

      return undefined;
    },
    [cache]
  );

  return { autocompleteSearch, findTaxonId };
}
