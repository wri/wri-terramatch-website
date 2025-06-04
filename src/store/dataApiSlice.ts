import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dictionary } from "lodash";
import { Store } from "redux";

import { Pending, PendingErrorState } from "@/store/apiSlice";
import { AppStore } from "@/store/store";

export type DataApiStore = {
  gadm: {
    level0: Dictionary<Dictionary<string>>;
    level1: Dictionary<Dictionary<string>>;
    level2: Dictionary<Dictionary<string>>;
  };
  meta: {
    pending: Dictionary<Pending>;
  };
};

const INITIAL_STATE: DataApiStore = {
  gadm: {
    level0: {},
    level1: {},
    level2: {}
  },
  meta: {
    pending: {}
  }
};

export type DataApiFetchStartingProps = {
  url: string;
};

export type DataApiFetchFailedProps = DataApiFetchStartingProps & {
  error: PendingErrorState;
};

export type GadmLevel = keyof DataApiStore["gadm"];

export type GadmData = {
  gadmLevel: GadmLevel;
  parentCode?: string;
  data: Dictionary<string>;
};

export type DataApiPayload = GadmData;

// If / When we do more with the Data API than just fetching GadmData, this type and the
// dataSetFetchSucceeded reducer will need to get more sophisticated.
export type DataApiFetchSucceededProps = DataApiFetchStartingProps & DataApiPayload;

export const dataApiSlice = createSlice({
  name: "dataApi",

  initialState: INITIAL_STATE,

  reducers: {
    dataSetFetchStarting: (state, action: PayloadAction<DataApiFetchStartingProps>) => {
      state.meta.pending[action.payload.url] = true;
    },

    dataSetFetchFailed: (state, action: PayloadAction<DataApiFetchFailedProps>) => {
      const { url, error } = action.payload;
      state.meta.pending[url] = error;
    },

    dataSetFetchSucceeded: (state, action: PayloadAction<DataApiFetchSucceededProps>) => {
      const { url, parentCode, gadmLevel, data } = action.payload;
      delete state.meta.pending[url];
      state.gadm[gadmLevel][parentCode ?? "global"] = data;
    }
  }
});

export default class DataApiSlice {
  private static _redux: Store;

  static set redux(value: Store) {
    this._redux = value;
  }

  static get currentState() {
    return DataApiSlice.getState(this._redux.getState());
  }

  static getState({ dataApi }: AppStore) {
    return dataApi;
  }

  static dataSetFetchStarting(props: DataApiFetchStartingProps) {
    this._redux.dispatch(dataApiSlice.actions.dataSetFetchStarting(props));
  }

  static dataSetFetchFailed(props: DataApiFetchFailedProps) {
    this._redux.dispatch(dataApiSlice.actions.dataSetFetchFailed(props));
  }

  static dataSetFetchSucceeded(props: DataApiFetchSucceededProps) {
    this._redux.dispatch(dataApiSlice.actions.dataSetFetchSucceeded(props));
  }
}
