export class DemographicCollections {
  public static readonly COLLECTION_TITLES = {
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
    "restoration-partners": {
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
    "all-beneficiaries": {
      all: "All Beneficiaries"
    },
    "training-beneficiaries": {
      training: "Training Beneficiaries"
    }
  } as const;
  public static readonly WORKDAYS_PROJECT_PPC = [
    "paid-project-management",
    "volunteer-project-management",
    "paid-nursery-operations",
    "volunteer-nursery-operations",
    "paid-other-activities",
    "volunteer-other-activities"
  ] as const;
  public static readonly WORKDAYS_PROJECT_OTHER = "paid-other-activities" as const;
  public static readonly WORKDAYS_SITE = [
    "paid-site-establishment",
    "volunteer-site-establishment",
    "paid-planting",
    "volunteer-planting",
    "paid-site-maintenance",
    "volunteer-site-maintenance",
    "paid-site-monitoring",
    "volunteer-site-monitoring",
    "paid-other-activities",
    "volunteer-other-activities"
  ] as const;
  public static readonly WORKDAYS_SITE_OTHER = "paid-other-activities" as const;
  public static readonly RESTORATION_PARTNERS_PROJECT = [
    "direct-income",
    "indirect-income",
    "direct-benefits",
    "indirect-benefits",
    "direct-conservation-payments",
    "indirect-conservation-payments",
    "direct-market-access",
    "indirect-market-access",
    "direct-capacity",
    "indirect-capacity",
    "direct-training",
    "indirect-training",
    "direct-land-title",
    "indirect-land-title",
    "direct-livelihoods",
    "indirect-livelihoods",
    "direct-productivity",
    "indirect-productivity",
    "direct-other",
    "indirect-other"
  ] as const;
  public static readonly RESTORATION_PARTNERS_PROJECT_OTHER = "direct-other" as const;
  public static readonly JOBS_PROJECT = ["full-time", "part-time"] as const;
  public static readonly VOLUNTEERS_PROJECT = ["volunteer"] as const;
  public static readonly BENEFICIARIES_PROJECT_ALL = ["all"] as const;
  public static readonly BENEFICIARIES_PROJECT_TRAINING = ["training"] as const;
}
