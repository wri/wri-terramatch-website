import { keyBy, mapValues } from "lodash";
import { createSelector } from "reselect";

import { isErrorState } from "@/store/apiSlice";
import DataApiSlice, { DataApiPayload, DataApiStore, GadmLevel } from "@/store/dataApiSlice";

import Log from "./log";

const DATA_API_DATASET = "https://data-api.globalforestwatch.org/dataset";
const GADM_QUERY = "/gadm_administrative_boundaries/v4.1.85/query";

const gadmLevel0Sql = () => `
  SELECT country AS name, gid_0 AS id
  FROM gadm_administrative_boundaries
  WHERE adm_level = '0'
    AND gid_0 NOT IN ('Z01', 'Z02', 'Z03', 'Z04', 'Z05', 'Z06', 'Z07', 'Z08', 'Z09', 'TWN', 'XCA', 'ESH', 'XSP')
`;

const gadmLevel1Sql = (level0: string) => `
  SELECT name_1 AS name, gid_1 AS id
  FROM gadm_administrative_boundaries
  WHERE adm_level='1'
    AND gid_0 = '${level0}'
`;

const gadmLevel2Sql = (level1: string) => `
  SELECT gid_2 as id, name_2 as name
  FROM gadm_administrative_boundaries
  WHERE gid_1 = '${level1}'
    AND adm_level='2'
    AND type_2 NOT IN ('Waterbody', 'Water body', 'Water Body')
`;

const gadmSql = (level: number, parentCode?: string) => {
  if (level === 0) return gadmLevel0Sql();
  if (parentCode == null) throw new Error("parentCode must be provided for level 1 / 2");

  return level === 1 ? gadmLevel1Sql(parentCode) : gadmLevel2Sql(parentCode);
};

const queryUrl = (queryPath: string, query: string) => {
  const params = new URLSearchParams();
  params.append("sql", query);
  return `${DATA_API_DATASET}${queryPath}?${params}`;
};

const isPending = (url: string) => DataApiSlice.currentState.meta.pending[url] != null;

async function fetchDataSet(
  queryPath: string,
  query: string,
  makeSuccessPayload: (response: { data: object }) => DataApiPayload
) {
  const url = queryUrl(queryPath, query);
  if (isPending(url)) return;

  const actionPayload = { url };
  DataApiSlice.dataSetFetchStarting(actionPayload);

  const dataApiKey = process.env.NEXT_PUBLIC_DATA_API_KEY;
  if (dataApiKey == null) {
    throw new Error("Data API Key not found in env");
  }

  try {
    const response = await fetch(url, { headers: { "x-api-key": dataApiKey } });

    if (!response.ok) {
      const error = await response.json();
      DataApiSlice.dataSetFetchFailed({ ...actionPayload, error });
      return;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("json")) {
      throw new Error(`Response type is not JSON [${contentType}]`);
    }

    DataApiSlice.dataSetFetchSucceeded({ ...actionPayload, ...makeSuccessPayload(await response.json()) });
  } catch (e) {
    Log.error("Unexpected Data API fetch failure", e);
    const message = e instanceof Error ? `Network error (${e.message})` : "Network error";
    DataApiSlice.dataSetFetchFailed({ ...actionPayload, error: { statusCode: -1, message } });
  }
}

export const gadmFindFetchFailedSelector = (level: 0 | 1 | 2, parentCodes?: string[]) => {
  const urls =
    level === 0
      ? [queryUrl(GADM_QUERY, gadmLevel0Sql())]
      : (parentCodes ?? []).map(code => queryUrl(GADM_QUERY, gadmSql(level, code)));
  return createSelector(
    ({ meta: { pending } }: DataApiStore) => pending,
    pendingStates => {
      for (const url of urls) {
        const pending = pendingStates[url];
        if (isErrorState(pending)) return pending;
      }

      return null;
    }
  );
};

export function fetchGadmLevel(level: number, parentCode?: string) {
  const sql = gadmSql(level, parentCode);
  const payloadMutator = ({ data }: { data: object }) => ({
    gadmLevel: `level${level}` as GadmLevel,
    parentCode: parentCode,
    data: mapValues(keyBy(data, "id"), "name")
  });
  // Promise intentionally ignored
  fetchDataSet(GADM_QUERY, sql, payloadMutator);
}
