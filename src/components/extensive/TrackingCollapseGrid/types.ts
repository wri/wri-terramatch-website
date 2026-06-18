import { useT } from "@transifex/react";
import { useMemo } from "react";

import { Framework, useFrameworkContext } from "@/context/framework.provider";
import { DemographicCollections } from "@/generated/v3/entityService/entityServiceConstants";
import { TrackingDto, TrackingEntryDto } from "@/generated/v3/entityService/entityServiceSchemas";

export type TrackingEntity = "projectReports" | "siteReports" | "srpReports";

export type Status = "complete" | "not-started" | "in-progress";

export type WorkdayCollection =
  | (typeof DemographicCollections.WORKDAYS_PROJECT)[number]
  | (typeof DemographicCollections.WORKDAYS_SITE)[number];
export type RestorationPartnerCollection = (typeof DemographicCollections.RESTORATION_PARTNERS_PROJECT)[number];
export type JobsCollection = (typeof DemographicCollections.JOBS_PROJECT)[number];
export type VolunteersCollection = (typeof DemographicCollections.VOLUNTEERS_PROJECT)[number];
export type AllBeneficiariesCollection = (typeof DemographicCollections.BENEFICIARIES_PROJECT_ALL)[number];
export type TrainingBeneficiariesCollection = (typeof DemographicCollections.BENEFICIARIES_PROJECT_TRAINING)[number];

export interface TrackingGridVariantProps {
  header: string;
  open?: string;
  bodyCollapse: string;
  columTitle: string;
  gridStyle: string;
  roundedTl: string;
  roundedBl: string;
  roundedTr: string;
  roundedBr: string;
  firstCol?: string;
  secondCol?: string;
  tertiaryCol?: string;
}

type KebabToCamelCase<S extends string> = S extends `${infer T}-${infer U}`
  ? `${T}${Capitalize<KebabToCamelCase<U>>}`
  : S;

export type TrackingDomain = KebabToCamelCase<TrackingDto["domain"]>;
export type TrackingType = KebabToCamelCase<TrackingDto["type"]>;

export const DEMOGRAPHIC_TYPES = [
  "workdays",
  "restorationPartners",
  "jobs",
  "employees",
  "volunteers",
  "allBeneficiaries",
  "trainingBeneficiaries",
  "indirectBeneficiaries",
  "associates",
  "elpBeneficiaries",
  "livelihoodActivities"
] as const;
export type DemographicType = (typeof DEMOGRAPHIC_TYPES)[number];
export const isDemographicType = (value: unknown): value is DemographicType =>
  typeof value === "string" && DEMOGRAPHIC_TYPES.includes(value as DemographicType);

export const RESTORATION_TYPES = ["hectaresGoal", "hectaresHistorical", "treesGoal", "treesHistorical"] as const;
export type RestorationType = (typeof RESTORATION_TYPES)[number];
export const isRestorationType = (value: unknown): value is RestorationType =>
  typeof value === "string" && RESTORATION_TYPES.includes(value as RestorationType);

export const isTrackingType = (value: unknown): value is TrackingType =>
  isDemographicType(value) || isRestorationType(value);

type TrackingLabelProperties = {
  sectionLabel: string;
  rowLabelSingular: string;
  rowLabelPlural: string;
  /** When set, used for accordion totals (single Transifex source strings). */
  summaryTotalSingular?: string;
  summaryTotalPlural?: string;
};

const useTrackingLabelsTypes = (): { [k in TrackingType]: TrackingLabelProperties } => {
  const t = useT();

  return useMemo(
    () => ({
      workdays: {
        sectionLabel: t("Total"),
        rowLabelSingular: t("Workday"),
        rowLabelPlural: t("Workdays")
      },
      restorationPartners: {
        sectionLabel: t("Total Restoration"),
        rowLabelSingular: t("Partner"),
        rowLabelPlural: t("Partners")
      },
      jobs: {
        sectionLabel: t("Total"),
        rowLabelSingular: t("Job"),
        rowLabelPlural: t("Jobs")
      },
      employees: {
        sectionLabel: t("Total"),
        rowLabelSingular: t("Employee"),
        rowLabelPlural: t("Employees")
      },
      volunteers: {
        sectionLabel: t("Total"),
        rowLabelSingular: t("Volunteer"),
        rowLabelPlural: t("Volunteers")
      },
      allBeneficiaries: {
        sectionLabel: t("Total"),
        rowLabelSingular: t("Beneficiary"),
        rowLabelPlural: t("Beneficiaries")
      },
      trainingBeneficiaries: {
        sectionLabel: t("Total Training"),
        rowLabelSingular: t("Beneficiary"),
        rowLabelPlural: t("Beneficiaries")
      },
      indirectBeneficiaries: {
        sectionLabel: t("Total Indirect"),
        rowLabelSingular: t("Beneficiary"),
        rowLabelPlural: t("Beneficiaries")
      },
      associates: {
        sectionLabel: t("Total"),
        rowLabelSingular: t("Associate"),
        rowLabelPlural: t("Associates")
      },
      elpBeneficiaries: {
        sectionLabel: t("Total ELP"),
        rowLabelSingular: t("Beneficiary"),
        rowLabelPlural: t("Beneficiaries")
      },
      livelihoodActivities: {
        sectionLabel: t("Total Livelihood Activity"),
        rowLabelSingular: t("Beneficiary"),
        rowLabelPlural: t("Beneficiaries")
      },
      treesHistorical: {
        sectionLabel: t("Total"),
        rowLabelSingular: t("Tree"),
        rowLabelPlural: t("Trees")
      },
      treesGoal: {
        sectionLabel: t("Total"),
        rowLabelSingular: t("Tree"),
        rowLabelPlural: t("Trees"),
        summaryTotalSingular: t("Total Tree"),
        summaryTotalPlural: t("Total Trees")
      },
      hectaresHistorical: {
        sectionLabel: t("Total"),
        rowLabelSingular: t("Hectare"),
        rowLabelPlural: t("Hectares")
      },
      hectaresGoal: {
        sectionLabel: t("Total"),
        rowLabelSingular: t("Hectare"),
        rowLabelPlural: t("Hectares"),
        summaryTotalSingular: t("Total Hectare"),
        summaryTotalPlural: t("Total Hectares")
      }
    }),
    [t]
  );
};

export const useTrackingLabels = (type: TrackingType) => {
  const t = useT();
  const trackingLabelsType = useTrackingLabelsTypes();

  const { framework } = useFrameworkContext();
  return useMemo(() => {
    const { sectionLabel, rowLabelSingular, rowLabelPlural, summaryTotalSingular, summaryTotalPlural } =
      trackingLabelsType[type];
    const props: TrackingLabelProperties = {
      sectionLabel: sectionLabel,
      rowLabelSingular: rowLabelSingular,
      rowLabelPlural: rowLabelPlural,
      summaryTotalSingular: summaryTotalSingular == null ? undefined : summaryTotalSingular,
      summaryTotalPlural: summaryTotalPlural == null ? undefined : summaryTotalPlural
    };
    if (type.endsWith("Beneficiaries") && framework === Framework.HBF) {
      return {
        ...props,
        rowLabelSingular: t("Partner"),
        rowLabelPlural: t("Partners")
      } as TrackingLabelProperties;
    }

    return props;
  }, [framework, type, trackingLabelsType, t]);
};

export type TrackingCollapseGridProps = {
  title?: string;
  entryConfigs?: TrackingEntryConfig[] | null;
  domain: TrackingDomain;
  type: TrackingType;
  entries: TrackingEntryDto[];
  variant: TrackingGridVariantProps;
  onChange?: (entries: TrackingEntryDto[]) => void;
};

export type TrackingEntryConfig = {
  type: string;
  title: string;
  displayTrackingType?: string;
  subTypes: TrackingEntrySubtypeConfig[];
  // If true, this field is required to balance with other "balanced" fields for a tracking
  // input to be considered complete.
  balanced: boolean;
  addNameLabel?: string;
  // If included, these types should only be included in the UI display if they already exists in the
  // underlying data.
  onlyIfPresent?: string[];
};

export type TrackingEntrySubtypeConfig = {
  subtype: string;
  label: string;
};

const GENDERS: TrackingEntrySubtypeConfig[] = [
  { subtype: "male", label: "Male" },
  { subtype: "female", label: "Female" },
  { subtype: "non-binary", label: "Non-binary" },
  { subtype: "unknown", label: "Unknown" }
];

const CASTES: TrackingEntrySubtypeConfig[] = [{ subtype: "marginalized", label: "Marginalized" }];

const AGES: TrackingEntrySubtypeConfig[] = [
  { subtype: "youth", label: "Youth (15-24)" },
  { subtype: "adult", label: "Adult (24-64)" },
  { subtype: "elder", label: "Elder (65+)" },
  { subtype: "unknown", label: "Unknown" }
];

const HBF_AGES: TrackingEntrySubtypeConfig[] = [
  { subtype: "youth", label: "Youth (15-29)" },
  { subtype: "non-youth", label: "Non Youth (over 29)" },
  { subtype: "unknown", label: "Unknown" }
];

const JOBS_AGES: TrackingEntrySubtypeConfig[] = [
  { subtype: "youth", label: "Youth (18-35)" },
  { subtype: "non-youth", label: "Non Youth (over 35)" },
  { subtype: "unknown", label: "Unknown" }
];

const ETHNICITIES: TrackingEntrySubtypeConfig[] = [
  { subtype: "indigenous", label: "Indigenous" },
  { subtype: "other", label: "Other" },
  { subtype: "unknown", label: "Unknown" }
];

const FARMERS: TrackingEntrySubtypeConfig[] = [
  { subtype: "smallholder", label: "Smallholder" },
  { subtype: "large-scale", label: "Large scale" }
];

const HBF_FARMERS: TrackingEntrySubtypeConfig[] = [...FARMERS, { subtype: "marginalized", label: "Marginalized" }];

const RACES: TrackingEntrySubtypeConfig[] = [
  { subtype: "black-or-pardo", label: "Black or Pardo" },
  { subtype: "white-or-amarelo", label: "White or Amarelo" },
  { subtype: "indigenous", label: "Indigenous" },
  { subtype: "unknown", label: "Unknown" }
];

const TRADITIONAL_COMMUNITIES: TrackingEntrySubtypeConfig[] = [
  { subtype: "member", label: "Member" },
  { subtype: "non-member", label: "Non-member" },
  { subtype: "unknown", label: "Unknown" }
];

const LIVELIHOODS: TrackingEntrySubtypeConfig[] = [
  { subtype: "oil-processing", label: "Oil Processing from Tree Crops" },
  { subtype: "soil-water-conservation", label: "Soil and Water Conservation Practices" },
  { subtype: "small-animals", label: "Small Animal Farming" },
  { subtype: "farmer-field-schools", label: "Farmer Field Schools" },
  { subtype: "home-gardens", label: "Home Gardens" },
  { subtype: "cookstoves", label: "Energy-saving Cookstoves" },
  { subtype: "fruits-vegetables", label: "Non-tree Fruit and Vegetable Farming" },
  { subtype: "cover-crops", label: "Cover Crops, Fodder Crops & Intercropping" },
  { subtype: "savings-loans", label: "Village Savings & Loans Associations or Local Cooperatives" },
  { subtype: "beekeeping", label: "Beekeeping & Apiary Management" },
  { subtype: "other", label: "Other" }
];

const BASE_DEMOGRAPHIC_TYPE_MAP: TrackingEntryConfig[] = [
  {
    type: "gender",
    title: "Gender",
    subTypes: GENDERS,
    balanced: true
  },
  {
    type: "age",
    title: "Age",
    subTypes: AGES,
    balanced: true
  }
];

const DEMOGRAPHIC_TYPE_MAP: TrackingEntryConfig[] = [
  ...BASE_DEMOGRAPHIC_TYPE_MAP,
  {
    type: "ethnicity",
    title: "Ethnicity",
    subTypes: ETHNICITIES,
    addNameLabel: "Add Ethnic Group",
    balanced: true
  }
];

const HBF_DEMOGRAPHIC_TYPE_MAP: TrackingEntryConfig[] = [
  {
    type: "gender",
    title: "Gender",
    subTypes: GENDERS,
    balanced: true
  },
  {
    type: "age",
    title: "Age",
    subTypes: HBF_AGES,
    balanced: false
  },
  {
    type: "caste",
    title: "Caste",
    subTypes: CASTES,
    balanced: false
  }
];

const JOBS_DEMOGRAPHICS_TYPE_MAP: TrackingEntryConfig[] = [
  {
    type: "gender",
    title: "Gender",
    subTypes: GENDERS,
    balanced: true
  },
  {
    type: "age",
    title: "Age",
    subTypes: JOBS_AGES,
    balanced: true
  }
];

const HBF_JOBS_DEMOGRAPHICS_TYPE_MAP: TrackingEntryConfig[] = [
  {
    type: "gender",
    title: "Gender",
    subTypes: GENDERS,
    balanced: true
  },
  {
    type: "age",
    title: "Age",
    subTypes: HBF_AGES,
    balanced: false
  },
  {
    type: "caste",
    title: "Caste",
    subTypes: CASTES,
    balanced: false
  }
];

const FF_VOLUNTEERS_DEMOGRAPHICS_TYPE_MAP: TrackingEntryConfig[] = [
  ...BASE_DEMOGRAPHIC_TYPE_MAP,
  {
    type: "traditional-community",
    title: "Traditional Community",
    subTypes: TRADITIONAL_COMMUNITIES,
    balanced: true
  }
];

const FF_JOBS_DEMOGRAPHICS_TYPE_MAP: TrackingEntryConfig[] = [
  ...BASE_DEMOGRAPHIC_TYPE_MAP,
  {
    type: "race",
    title: "Race",
    subTypes: RACES,
    balanced: true
  },
  {
    type: "traditional-community",
    title: "Traditional Community",
    subTypes: TRADITIONAL_COMMUNITIES,
    balanced: true
  }
];

const BENEFICIARIES_TRAINING_DEMOGRAPHICS_TYPE_MAP: TrackingEntryConfig[] = [
  {
    type: "gender",
    title: "Gender",
    subTypes: GENDERS,
    balanced: true
  },
  {
    type: "age",
    title: "Age",
    subTypes: JOBS_AGES,
    balanced: true
  }
];

const BENEFICIARIES_DEMOGRAPHICS_TYPE_MAP: TrackingEntryConfig[] = [
  ...BENEFICIARIES_TRAINING_DEMOGRAPHICS_TYPE_MAP,
  {
    type: "farmer",
    title: "Farmer",
    subTypes: FARMERS,
    balanced: false
  }
];

const HBF_BENEFICIARIES_TRAINING_DEMOGRAPHICS_TYPE_MAP: TrackingEntryConfig[] = [
  {
    type: "gender",
    title: "Gender",
    subTypes: GENDERS,
    balanced: true
  },
  {
    type: "age",
    title: "Age",
    subTypes: HBF_AGES,
    balanced: false
  }
];

const HBF_BENEFICIARIES_DEMOGRAPHICS_TYPE_MAP: TrackingEntryConfig[] = [
  ...HBF_BENEFICIARIES_TRAINING_DEMOGRAPHICS_TYPE_MAP,
  {
    type: "farmer",
    title: "Farmer",
    subTypes: HBF_FARMERS,
    balanced: false
  },
  {
    type: "caste",
    title: "Caste",
    subTypes: CASTES,
    balanced: false
  }
];

const FF_BENEFICIARIES_DEMOGRAPHICS_TYPE_MAP: TrackingEntryConfig[] = [
  ...BENEFICIARIES_TRAINING_DEMOGRAPHICS_TYPE_MAP,
  {
    type: "traditional-community",
    title: "Traditional Community",
    subTypes: TRADITIONAL_COMMUNITIES,
    balanced: true
  }
];

const LIVELIHOODS_TYPE_MAP: TrackingEntryConfig[] = [
  {
    type: "livelihoods",
    title: "Livelihood Activity",
    displayTrackingType: "Beneficiaries",
    subTypes: LIVELIHOODS,
    balanced: true
  }
];

const getDemographicsEntryConfigs = (type: TrackingType, framework: Framework) => {
  if (["jobs", "volunteers", "employees", "associates"].includes(type)) {
    switch (framework) {
      case Framework.HBF:
        return HBF_JOBS_DEMOGRAPHICS_TYPE_MAP;
      case Framework.FF:
      case Framework.FF_1:
        return type === "volunteers" ? FF_VOLUNTEERS_DEMOGRAPHICS_TYPE_MAP : FF_JOBS_DEMOGRAPHICS_TYPE_MAP;
      default:
        return JOBS_DEMOGRAPHICS_TYPE_MAP;
    }
  } else if (type.endsWith("Beneficiaries")) {
    if (type === "trainingBeneficiaries") {
      switch (framework) {
        case Framework.HBF:
          return HBF_BENEFICIARIES_TRAINING_DEMOGRAPHICS_TYPE_MAP;
        case Framework.FF:
        case Framework.FF_1:
          return FF_BENEFICIARIES_DEMOGRAPHICS_TYPE_MAP;
        default:
          return BENEFICIARIES_TRAINING_DEMOGRAPHICS_TYPE_MAP;
      }
    } else if (type === "elpBeneficiaries") {
      return BENEFICIARIES_TRAINING_DEMOGRAPHICS_TYPE_MAP;
    } else {
      switch (framework) {
        case Framework.HBF:
          return HBF_BENEFICIARIES_DEMOGRAPHICS_TYPE_MAP;
        case Framework.FF:
        case Framework.FF_1:
          return FF_BENEFICIARIES_DEMOGRAPHICS_TYPE_MAP;
        default:
          return BENEFICIARIES_DEMOGRAPHICS_TYPE_MAP;
      }
    }
  } else if (type === "livelihoodActivities") {
    return LIVELIHOODS_TYPE_MAP;
  } else {
    switch (framework) {
      case Framework.HBF:
        return HBF_DEMOGRAPHIC_TYPE_MAP;
      default:
        return DEMOGRAPHIC_TYPE_MAP;
    }
  }
};

const HISTORICAL_YEARS: TrackingEntrySubtypeConfig[] = [
  { subtype: "3-year", label: "Last 3 Years" },
  { subtype: "older", label: "More than 3 Years Ago" },
  { subtype: "unknown", label: "Unknown" }
];

const GOAL_YEARS: TrackingEntrySubtypeConfig[] = [
  { subtype: "1-year", label: "First Year" },
  { subtype: "2-year", label: "Second Year" },
  { subtype: "unknown", label: "Unknown" }
];

const GOAL_STRATEGY: TrackingEntrySubtypeConfig[] = [
  { subtype: "anr", label: "Assisted Natural Regeneration" },
  { subtype: "direct-seeding", label: "Direct Seeding" },
  { subtype: "tree-planting", label: "Tree Planting" },
  { subtype: "unknown", label: "Unknown" }
];

const FF_LAND_USE: TrackingEntrySubtypeConfig[] = [
  { subtype: "agroforest", label: "Agroforest" },
  { subtype: "natural-forest", label: "Natural Forest" },
  { subtype: "riparian-area-or-wetland", label: "Riparian Area or Wetland" },
  { subtype: "silvopasture", label: "Silvopasture" },
  { subtype: "urban-forest", label: "Urban Forest" },
  { subtype: "woodlot-or-plantation", label: "Woodlot or Plantation" },
  { subtype: "unknown", label: "Unknown" }
];

const LAND_USE: TrackingEntrySubtypeConfig[] = [
  { subtype: "agroforest", label: "Agroforest" },
  { subtype: "natural-forest", label: "Natural Forest" },
  { subtype: "riparian-area-or-wetland", label: "Riparian Area or Wetland" },
  { subtype: "silvopasture", label: "Silvopasture" },
  { subtype: "urban-forest", label: "Urban Forest" },
  { subtype: "woodlot-or-plantation", label: "Woodlot or Plantation" },
  { subtype: "mangrove", label: "Mangrove" },
  { subtype: "peatland", label: "Peatland" },
  { subtype: "open-natural-ecosystem", label: "Open Natural Ecosystem" },
  { subtype: "unknown", label: "Unknown" }
];

const HISTORICAL: TrackingEntryConfig[] = [
  {
    type: "years",
    title: "Years",
    subTypes: HISTORICAL_YEARS,
    balanced: true,
    onlyIfPresent: ["unknown"]
  }
];

const TREES_GOAL: TrackingEntryConfig[] = [
  {
    type: "years",
    title: "Years",
    subTypes: GOAL_YEARS,
    balanced: true
  },
  {
    type: "strategy",
    title: "Strategy",
    subTypes: GOAL_STRATEGY,
    balanced: false
  }
];

const HECTARES_GOAL: TrackingEntryConfig[] = [
  {
    type: "years",
    title: "Years",
    subTypes: GOAL_YEARS,
    balanced: true
  },
  {
    type: "strategy",
    title: "Strategy",
    subTypes: GOAL_STRATEGY,
    balanced: true
  },
  {
    type: "land-use",
    title: "Land Use",
    subTypes: LAND_USE,
    balanced: true
  }
];

const FF_HECTARES_GOAL: TrackingEntryConfig[] = [
  {
    type: "years",
    title: "Years",
    subTypes: GOAL_YEARS,
    balanced: true
  },
  {
    type: "strategy",
    title: "Strategy",
    subTypes: GOAL_STRATEGY,
    balanced: true
  },
  {
    type: "land-use",
    title: "Land Use",
    subTypes: FF_LAND_USE,
    balanced: true
  }
];

const getRestorationEntryConfigs = (type: TrackingType, framework: Framework) => {
  if (type === "treesGoal") {
    return TREES_GOAL;
  } else if (type === "hectaresGoal") {
    return framework === Framework.FF_1 ? FF_HECTARES_GOAL : HECTARES_GOAL;
  } else return HISTORICAL;
};

export const getDefaultEntryConfigs = (domain: TrackingDomain, type: TrackingType, framework: Framework) => {
  switch (domain) {
    case "demographics":
      return getDemographicsEntryConfigs(type, framework);
    case "restoration":
      return getRestorationEntryConfigs(type, framework);

    default:
      throw new Error(`Unsupported domain: ${domain}`);
  }
};
