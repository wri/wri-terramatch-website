import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Store } from "redux";

export type JobsDataStore = {
  totalContent: number;
  processedContent: number;
  progressMessage: string | null;
  abortDelayedJob: boolean;
};

export const INITIAL_STATE: JobsDataStore = {
  totalContent: 0,
  processedContent: 0,
  progressMessage: null,
  abortDelayedJob: false
};

type JobsProgressProps = {
  totalContent: number;
  processedContent: number;
  progressMessage: string | null;
};

export const jobsSlice = createSlice({
  name: "jobs",

  initialState: INITIAL_STATE,

  reducers: {
    setJobsProgress: (state, action: PayloadAction<JobsProgressProps>) => {
      state.totalContent = action.payload.totalContent;
      state.processedContent = action.payload.processedContent;
      state.progressMessage = action.payload.progressMessage;
    },

    reset: state => {
      Object.assign(state, INITIAL_STATE);
    },

    abort: state => {
      state.abortDelayedJob = true;
    }
  }
});

export default class JobsSlice {
  static redux: Store;

  static get store(): JobsDataStore {
    return this.redux.getState().jobs;
  }

  static setJobsProgress(totalContent: number, processedContent: number, progressMessage: string | null) {
    this.redux.dispatch(jobsSlice.actions.setJobsProgress({ totalContent, processedContent, progressMessage }));
  }

  static reset() {
    this.redux.dispatch(jobsSlice.actions.reset());
  }

  static abortDelayedJob() {
    this.redux.dispatch(jobsSlice.actions.abort());
  }
}
