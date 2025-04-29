import { Dictionary, filter, merge } from "lodash";
import { createSelector } from "reselect";

import { PendingErrorState } from "@/store/apiSlice";
import DataApiSlice, { DataApiStore } from "@/store/dataApiSlice";
import { Connection } from "@/types/connection";
import { connectionHook } from "@/utils/connectionShortcuts";
import { fetchGadmLevels, gadmFindFetchFailedSelector } from "@/utils/dataApi";
import { selectorCache } from "@/utils/selectorCache";

export type GadmConnection = {
  byCode?: Dictionary<Dictionary<string>>;
  codeMapping?: Dictionary<string>;
  fetchFailure?: PendingErrorState | null;
};

type GadmConnectionProps = {
  level: 0 | 1 | 2;
  // The code for the enclosing GADM category one level broader than what's being requested on this
  // connection
  parentCodes?: string[];
};

const isLoaded = ({ byCode, fetchFailure }: GadmConnection, { parentCodes }: GadmConnectionProps) =>
  filter(Object.values(byCode ?? {})).length === (parentCodes?.length ?? 1) || fetchFailure != null;

const gadmSelector = (level: 0 | 1 | 2, parentCodes?: string[]) =>
  createSelector([({ gadm }: DataApiStore) => gadm[`level${level}`]], levelCodes => {
    const result: Dictionary<Dictionary<string>> = {};
    for (const code of parentCodes ?? ["global"]) {
      result[code] = levelCodes[code];
    }

    return result;
  });

const gadmConnection: Connection<GadmConnection, GadmConnectionProps, DataApiStore> = {
  getState: DataApiSlice.getState,

  load: (connection, props) => {
    const { byCode } = connection;
    // We have to be careful here because we're loading multiple requests. If one finishes but the
    // others haven't, and we call fetchGadmLevels() again, it will re-load the first repeatedly
    // until all requests have finished.
    const someLoaded = filter(Object.values(byCode ?? {})).length > 0;
    if (!isLoaded(connection, props) && !someLoaded) fetchGadmLevels(props.level, props.parentCodes);
  },

  isLoaded,

  selector: selectorCache(
    ({ level, parentCodes }) => `${level}|${parentCodes?.join()}`,
    ({ level, parentCodes }) =>
      createSelector(
        [gadmSelector(level, parentCodes), gadmFindFetchFailedSelector(level, parentCodes)],
        (byCode, fetchFailure) => ({
          byCode,
          // don't bother providing the codeMapping until all of the fetches are complete; it won't
          // get passed to the component until isLoaded returns true anyway.
          codeMapping: isLoaded({ byCode, fetchFailure }, { level, parentCodes })
            ? (merge({}, ...Object.values(byCode)) as Dictionary<string>)
            : undefined,
          fetchFailure
        })
      )
  )
};

export const useGadmCodes = connectionHook(gadmConnection);
