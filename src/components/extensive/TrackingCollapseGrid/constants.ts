import { Dictionary } from "lodash";

import {
  AllBeneficiariesCollection,
  JobsCollection,
  RestorationPartnerCollection,
  TrackingType,
  TrainingBeneficiariesCollection,
  VolunteersCollection,
  WorkdayCollection
} from "./types";

// Type ensures that if a new collection or tracking type is added, there will be a compile time
// error if a title mapping is not added as well.
export type CollectionTitleSet = Record<TrackingType, Dictionary<string>> & {
  workdays: Record<WorkdayCollection, string>;
  restorationPartners: Record<RestorationPartnerCollection, string>;
  jobs: Record<JobsCollection, string>;
  volunteers: Record<VolunteersCollection, string>;
  allBeneficiaries: Record<AllBeneficiariesCollection, string>;
  trainingBeneficiaries: Record<TrainingBeneficiariesCollection, string>;
};
