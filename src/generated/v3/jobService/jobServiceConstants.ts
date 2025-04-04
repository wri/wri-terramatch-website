import { StoreResourceMap } from "@/store/apiSlice";
import { DelayedJobDto } from "./jobServiceSchemas";

export const JOB_SERVICE_RESOURCES = ["delayedJobs"] as const;

export type JobServiceApiResources = {
  delayedJobs: StoreResourceMap<DelayedJobDto>;
};
