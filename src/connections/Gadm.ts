import { useT } from "@transifex/react";
import { Dictionary, difference, filter, isEmpty, merge } from "lodash";
import { useMemo } from "react";
import { createSelector } from "reselect";

import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import { PendingError } from "@/store/apiSlice";
import DataApiSlice, { DataApiStore } from "@/store/dataApiSlice";
import { Connection } from "@/types/connection";
import { fetchGadmLevel, gadmFindFetchFailedSelector } from "@/utils/dataApi";
import Log from "@/utils/log";
import { optionToChoices } from "@/utils/options";
import { selectorCache } from "@/utils/selectorCache";

export type GadmConnection = {
  byParentCode?: Dictionary<Dictionary<string>>;
  codeMapping?: Dictionary<string>;
  fetchFailure?: PendingError | null;
};

type GadmConnectionProps = {
  level: 0 | 1 | 2;
  // The code for the enclosing GADM category one level broader than what's being requested on this
  // connection
  parentCodes?: string[];
  // Whether to load the GADM data for this connection. Defaults to true.
  enabled?: boolean;
};

const isLoaded = (
  { byParentCode, fetchFailure }: GadmConnection,
  { level, parentCodes, enabled }: GadmConnectionProps
) => {
  if (enabled === false) return true;
  if (level > 0 && isEmpty(parentCodes)) return true; // Prevent attempting to load when our props aren't yet valid.
  return filter(Object.values(byParentCode ?? {})).length === (parentCodes?.length ?? 1) || fetchFailure != null;
};

const gadmSelector = (level: 0 | 1 | 2, parentCodes?: string[]) =>
  createSelector([({ gadm }: DataApiStore) => gadm[`level${level}`]], levelCodes => {
    if (level > 0 && isEmpty(parentCodes)) return {};

    const result: Dictionary<Dictionary<string>> = {};
    for (const code of parentCodes ?? ["global"]) {
      result[code] = levelCodes[code];
    }

    return result;
  });

const gadmConnection: Connection<GadmConnection, GadmConnectionProps, DataApiStore> = {
  getState: DataApiSlice.getState,

  load: (connection, props) => {
    if (isLoaded(connection, props)) return;

    // We have to be careful here because we're loading multiple requests. If one finishes but the
    // others haven't, and we call fetchGadmLevel() on the already loaded resource again, it will
    // re-load the first repeatedly until all requests have finished.
    const { byParentCode } = connection;
    const loaded = Object.entries(byParentCode ?? {})
      .filter(([, values]) => !isEmpty(values))
      .map(([parentCode]) => parentCode);
    const expectedCodes = props.level === 0 ? ["global"] : props.parentCodes;
    const missingCodes = difference(expectedCodes, loaded);
    for (const parentCode of missingCodes) {
      fetchGadmLevel(props.level, parentCode);
    }
  },

  isLoaded,

  selector: selectorCache(
    ({ level, parentCodes }) => `${level}|${parentCodes?.join()}`,
    ({ level, parentCodes }) =>
      createSelector(
        [gadmSelector(level, parentCodes), gadmFindFetchFailedSelector(level, parentCodes)],
        (byParentCode, fetchFailure) => ({
          byParentCode,
          // don't bother providing the codeMapping until all of the fetches are complete; it won't
          // get passed to the component until isLoaded returns true anyway.
          codeMapping: isLoaded({ byParentCode, fetchFailure }, { level, parentCodes })
            ? (merge({}, ...Object.values(byParentCode)) as Dictionary<string>)
            : undefined,
          fetchFailure
        })
      )
  )
};

export const useGadmCodes = connectionHook(gadmConnection);
export const loadGadmCodes = connectionLoader(gadmConnection);

export const useGadmOptions = (props: GadmConnectionProps) => {
  const { level, parentCodes } = props;
  const enabled = props.enabled !== false && (level === 0 || (parentCodes != null && parentCodes.length > 0));
  const [loaded, { codeMapping, fetchFailure }] = useGadmCodes({ level, parentCodes, enabled });
  const t = useT();
  return useMemo(() => {
    if (!loaded) return null;
    if (!enabled) return [];
    if (fetchFailure != null) {
      Log.error("Failed to fetch some GADM code data", { level, parentCodes, fetchFailure });
      return null;
    }
    if (codeMapping == null) {
      Log.error("GADM data fetch complete, but no codeMapping provided", { level, parentCodes });
      return null;
    }

    return Object.entries(codeMapping)
      .map(([code, name]) => ({
        value: code,
        title: t(name)
      }))
      .sort(({ title: a }, { title: b }) => a.localeCompare(b));
  }, [codeMapping, enabled, fetchFailure, level, loaded, parentCodes, t]);
};

export const useGadmChoices = (props: GadmConnectionProps) => {
  const options = useGadmOptions(props);
  return useMemo(() => (options == null ? [] : optionToChoices(options)), [options]);
};

export const findCachedGadmTitle = (level: 0 | 1 | 2, code: string, parentCodes?: string[]) => {
  const { gadm } = DataApiSlice.currentState;
  const levelCodes = gadm[`level${level}`];
  const inferredParentCodes = level === 1 ? [code.split(".")[0]].filter(Boolean) : [];
  const lookupParentCodes =
    level === 0 ? ["global"] : [...inferredParentCodes, ...((parentCodes as string[] | undefined) ?? [])];

  // First try with the expected parent codes.
  for (const parentCode of lookupParentCodes) {
    const title = levelCodes[parentCode]?.[code];
    if (title != null) return title;
  }

  // Fallback: some records can have stale/mismatched parent values in answers.
  // Search all cached parent buckets so we can still resolve the label from the code.
  for (const codesByParent of Object.values(levelCodes)) {
    const title = codesByParent?.[code];
    if (title != null) return title;
  }
  return null;
};
