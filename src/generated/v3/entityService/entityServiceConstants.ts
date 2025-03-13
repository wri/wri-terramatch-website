export class DemographicCollections {
  public static readonly WORKDAYS_PROJECT = [
    "paid-project-management",
    "volunteer-project-management",
    "paid-nursery-operations",
    "volunteer-nursery-operations",
    "paid-other-activities",
    "volunteer-other-activities",
    "direct",
    "convergence"
  ] as const;
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

export class TreeEntityTypes {
  public static readonly ESTABLISHMENT_ENTITIES = [
    "sites",
    "nurseries",
    "projectReports",
    "siteReports",
    "nurseryReports"
  ] as const;
  public static readonly REPORT_COUNT_ENTITIES = ["projects", "projectReports", "sites", "nurseries"] as const;
}
