import { Dictionary } from "lodash";

import {
  AllBeneficiariesCollection,
  DemographicType,
  JobsCollection,
  RestorationPartnerCollection,
  TrainingBeneficiariesCollection,
  VolunteersCollection,
  WorkdayCollection
} from "./types";

// Type ensures that if a new collection or demographic type is added, there will be a compile time
// error if a title mapping is not added as well.
type CollectionTitleSet = Record<DemographicType, Dictionary<string>> & {
  workdays: Record<WorkdayCollection, string>;
  restorationPartners: Record<RestorationPartnerCollection, string>;
  jobs: Record<JobsCollection, string>;
  volunteers: Record<VolunteersCollection, string>;
  allBeneficiaries: Record<AllBeneficiariesCollection, string>;
  trainingBeneficiaries: Record<TrainingBeneficiariesCollection, string>;
};

export const COLLECTION_TITLES: CollectionTitleSet = {
  workdays: {
    "paid-project-management": "Paid Project Management",
    "volunteer-project-management": "Volunteer Project Management",
    "paid-nursery-operations": "Paid Nursery Operations",
    "volunteer-nursery-operations": "Volunteer Nursery Operations",
    "paid-other-activities": "Paid Other Activities",
    "volunteer-other-activities": "Volunteer Other Activities",
    direct: "Direct Workdays",
    convergence: "Convergence Workdays",
    "paid-site-establishment": "Paid Site Establishment",
    "volunteer-site-establishment": "Volunteer Site Establishment",
    "paid-planting": "Paid Planting",
    "volunteer-planting": "Volunteer Planting",
    "paid-site-maintenance": "Paid Site Maintenance",
    "volunteer-site-maintenance": "Volunteer Site Maintenance",
    "paid-site-monitoring": "Paid Site Monitoring",
    "volunteer-site-monitoring": "Volunteer Site Monitoring"
  },
  restorationPartners: {
    "direct-income": "Direct Income",
    "indirect-income": "Indirect Income",
    "direct-benefits": "Direct In-kind Benefits",
    "indirect-benefits": "Indirect In-kind Benefits",
    "direct-conservation-payments": "Direct Conservation Agreement Payments",
    "indirect-conservation-payments": "Indirect Conservation Agreement Payments",
    "direct-market-access": "Direct Increased Market Access",
    "indirect-market-access": "Indirect Increased Market Access",
    "direct-capacity": "Direct Increased Capacity",
    "indirect-capacity": "Indirect Increased Capacity",
    "direct-training": "Direct Training",
    "indirect-training": "Indirect Training",
    "direct-land-title": "Direct Newly Secured Land Title",
    "indirect-land-title": "Indirect Newly Secured Land Title",
    "direct-livelihoods": "Direct Traditional Livelihoods or Customer Rights",
    "indirect-livelihoods": "Indirect Traditional Livelihoods or Customer Rights",
    "direct-productivity": "Direct Increased Productivity",
    "indirect-productivity": "Indirect Increased Productivity",
    "direct-other": "Direct Other",
    "indirect-other": "Indirect Other"
  },
  jobs: {
    "full-time": "Full-time",
    "part-time": "Part-time"
  },
  volunteers: {
    volunteer: "Volunteer"
  },
  allBeneficiaries: {
    all: "All Beneficiaries"
  },
  trainingBeneficiaries: {
    training: "Training Beneficiaries"
  }
};

export const getDemographicTitle = (type: DemographicType, collection: string) => {
  const collectionTitles = COLLECTION_TITLES[type];
  return collectionTitles?.[collection as keyof typeof collectionTitles] ?? "Unknown";
};
