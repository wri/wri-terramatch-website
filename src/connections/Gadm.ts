import { Dictionary } from "lodash";
import { createSelector } from "reselect";

import { PendingErrorState } from "@/store/apiSlice";
import DataApiSlice, { DataApiStore } from "@/store/dataApiSlice";
import { Connection } from "@/types/connection";
import { connectionHook } from "@/utils/connectionShortcuts";
import { fetchGadmLevel, gadmFetchFailedSelector } from "@/utils/dataApi";
import { selectorCache } from "@/utils/selectorCache";

export type GadmConnection = {
  codeMapping?: Dictionary<string>;
  fetchFailure?: PendingErrorState | null;
};

type GadmConnectionProps = {
  level: 0 | 1 | 2;
  // The code for the enclosing GADM category one level broader than what's being requested on this
  // connection
  parentCode?: string;
};

const isLoaded = ({ codeMapping, fetchFailure }: GadmConnection) => codeMapping != null || fetchFailure != null;

const gadmSelector = (level: 0 | 1 | 2, parentCode?: string) => (store: DataApiStore) =>
  store.gadm[`level${level}`]?.[parentCode ?? "global"];

const gadmConnection: Connection<GadmConnection, GadmConnectionProps, DataApiStore> = {
  getState: DataApiSlice.getState,

  load: (connection, { level, parentCode }) => {
    if (!isLoaded(connection)) fetchGadmLevel(level, parentCode);
  },

  isLoaded,

  selector: selectorCache(
    ({ level, parentCode }) => `${level}|${parentCode}`,
    ({ level, parentCode }) =>
      createSelector(
        [gadmSelector(level, parentCode), gadmFetchFailedSelector(level, parentCode)],
        (codeMapping, fetchFailure) => ({
          codeMapping,
          fetchFailure
        })
      )
  )
};

export const useGadmCodes = connectionHook(gadmConnection);
