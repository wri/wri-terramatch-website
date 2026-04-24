import { useT } from "@transifex/react";
import { Dictionary } from "lodash";
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
};

const TRACKING_LABELS: { [k in TrackingType]: TrackingLabelProperties } = {
  workdays: {
    sectionLabel: "Total",
    rowLabelSingular: "Workday",
    rowLabelPlural: "Workdays"
  },
  restorationPartners: {
    sectionLabel: "Total Restoration",
    rowLabelSingular: "Partner",
    rowLabelPlural: "Partners"
  },
  jobs: {
    sectionLabel: "Total",
    rowLabelSingular: "Job",
    rowLabelPlural: "Jobs"
  },
  employees: {
    sectionLabel: "Total",
    rowLabelSingular: "Employee",
    rowLabelPlural: "Employees"
  },
  volunteers: {
    sectionLabel: "Total",
    rowLabelSingular: "Volunteer",
    rowLabelPlural: "Volunteers"
  },
  allBeneficiaries: {
    sectionLabel: "Total",
    rowLabelSingular: "Beneficiary",
    rowLabelPlural: "Beneficiaries"
  },
  trainingBeneficiaries: {
    sectionLabel: "Total Training",
    rowLabelSingular: "Beneficiary",
    rowLabelPlural: "Beneficiaries"
  },
  indirectBeneficiaries: {
    sectionLabel: "Total Indirect",
    rowLabelSingular: "Beneficiary",
    rowLabelPlural: "Beneficiaries"
  },
  associates: {
    sectionLabel: "Total",
    rowLabelSingular: "Associate",
    rowLabelPlural: "Associates"
  },
  elpBeneficiaries: {
    sectionLabel: "Total ELP",
    rowLabelSingular: "Beneficiary",
    rowLabelPlural: "Beneficiaries"
  },
  livelihoodActivities: {
    sectionLabel: "Total Livelihood Activity",
    rowLabelSingular: "Beneficiary",
    rowLabelPlural: "Beneficiaries"
  },
  treesHistorical: {
    sectionLabel: "Total",
    rowLabelSingular: "Tree",
    rowLabelPlural: "Trees"
  },
  treesGoal: {
    sectionLabel: "Total",
    rowLabelSingular: "Tree",
    rowLabelPlural: "Trees"
  },
  hectaresHistorical: {
    sectionLabel: "Total",
    rowLabelSingular: "Hectare",
    rowLabelPlural: "Hectares"
  },
  hectaresGoal: {
    sectionLabel: "Total",
    rowLabelSingular: "Hectare",
    rowLabelPlural: "Hectares"
  }
};

export const useTrackingLabels = (type: TrackingType) => {
  const t = useT();

  const { framework } = useFrameworkContext();
  return useMemo(() => {
    const { sectionLabel, rowLabelSingular, rowLabelPlural } = TRACKING_LABELS[type];
    const props = {
      sectionLabel: t(sectionLabel),
      rowLabelSingular: t(rowLabelSingular),
      rowLabelPlural: t(rowLabelPlural)
    };
    if (type.endsWith("Beneficiaries") && framework === Framework.HBF) {
      return {
        ...props,
        rowLabelSingular: t("Partner"),
        rowLabelPlural: t("Partners")
      } as TrackingLabelProperties;
    }

    return props;
  }, [framework, type, t]);
};

export interface TrackingCollapseGridProps {
  title?: string;
  domain: TrackingDomain;
  type: TrackingType;
  entries: TrackingEntryDto[];
  variant: TrackingGridVariantProps;
  onChange?: (entries: TrackingEntryDto[]) => void;
}

const GENDERS: Dictionary<string> = {
  male: "Male",
  female: "Female",
  "non-binary": "Non-binary",
  unknown: "Unknown"
};

const CASTES: Dictionary<string> = {
  marginalized: "Marginalized"
};

const AGES: Dictionary<string> = {
  youth: "Youth (15-24)",
  adult: "Adult (24-64)",
  elder: "Elder (65+)",
  unknown: "Unknown"
};

const HBF_AGES: Dictionary<string> = {
  youth: "Youth (15-29)",
  "non-youth": "Non Youth (over 29)",
  unknown: "Unknown"
};

const JOBS_AGES: Dictionary<string> = {
  youth: "Youth (18-35)",
  "non-youth": "Non Youth (over 35)",
  unknown: "Unknown"
};

const ETHNICITIES: Dictionary<string> = {
  indigenous: "Indigenous",
  other: "Other",
  unknown: "Unknown"
};

const FARMERS: Dictionary<string> = {
  smallholder: "Smallholder",
  "large-scale": "Large scale"
};

const HBF_FARMERS: Dictionary<string> = {
  ...FARMERS,
  marginalized: "Marginalized"
};

const RACES: Dictionary<string> = {
  "black-or-pardo": "Black or Pardo",
  "white-or-amarelo": "White or Amarelo",
  indigenous: "Indigenous",
  unknown: "Unknown"
};

const TRADITIONAL_COMMUNITIES: Dictionary<string> = {
  member: "Member",
  "non-member": "Non-member",
  unknown: "Unknown"
};

const LIVELIHOODS: Dictionary<string> = {
  "oil-processing": "Oil Processing from Tree Crops",
  "soil-water-conservation": "Soil and Water Conservation Practices",
  "small-animals": "Small Animal Farming",
  "farmer-field-schools": "Farmer Field Schools",
  "home-gardens": "Home Gardens",
  cookstoves: "Energy-saving Cookstoves",
  "fruits-vegetables": "Non-tree Fruit and Vegetable Farming",
  "cover-crops": "Cover Crops, Fodder Crops & Intercropping",
  "savings-loans": "Village Savings & Loans Associations or Local Cooperatives",
  beekeeping: "Beekeeping & Apiary Management",
  other: "Other"
};

type TypeMapValue = {
  title: string;
  displayTrackingType?: string;
  typeMap: Dictionary<string>;
  // If true, this field is required to balance with other "balanced" fields for a tracking
  // input to be considered complete.
  balanced: boolean;
  addNameLabel?: string;
  // If included, these types should only be included in the UI display if they already exists in the
  // underlying data.
  onlyIfPresent?: string[];
};

const BASE_DEMOGRAPHIC_TYPE_MAP: Dictionary<TypeMapValue> = {
  gender: {
    title: "Gender",
    typeMap: GENDERS,
    balanced: true
  },
  age: {
    title: "Age",
    typeMap: AGES,
    balanced: true
  }
};

const DEMOGRAPHIC_TYPE_MAP: Dictionary<TypeMapValue> = {
  ...BASE_DEMOGRAPHIC_TYPE_MAP,
  ethnicity: {
    title: "Ethnicity",
    typeMap: ETHNICITIES,
    addNameLabel: "Add Ethnic Group",
    balanced: true
  }
};

const HBF_DEMOGRAPHIC_TYPE_MAP: Dictionary<TypeMapValue> = {
  gender: {
    title: "Gender",
    typeMap: GENDERS,
    balanced: true
  },
  age: {
    title: "Age",
    typeMap: HBF_AGES,
    balanced: false
  },
  caste: {
    title: "Caste",
    typeMap: CASTES,
    balanced: false
  }
};

const JOBS_DEMOGRAPHICS_TYPE_MAP: Dictionary<TypeMapValue> = {
  gender: {
    title: "Gender",
    typeMap: GENDERS,
    balanced: true
  },
  age: {
    title: "Age",
    typeMap: JOBS_AGES,
    balanced: true
  }
};

const HBF_JOBS_DEMOGRAPHICS_TYPE_MAP: Dictionary<TypeMapValue> = {
  ...HBF_DEMOGRAPHIC_TYPE_MAP,
  age: {
    title: "Age",
    typeMap: HBF_AGES,
    balanced: false
  }
};

const FF_VOLUNTEERS_DEMOGRAPHICS_TYPE_MAP: Dictionary<TypeMapValue> = {
  ...BASE_DEMOGRAPHIC_TYPE_MAP,
  "traditional-community": {
    title: "Traditional Community",
    typeMap: TRADITIONAL_COMMUNITIES,
    balanced: true
  }
};

const FF_JOBS_DEMOGRAPHICS_TYPE_MAP: Dictionary<TypeMapValue> = {
  ...BASE_DEMOGRAPHIC_TYPE_MAP,
  race: {
    title: "Race",
    typeMap: RACES,
    balanced: true
  },
  "traditional-community": {
    title: "Traditional Community",
    typeMap: TRADITIONAL_COMMUNITIES,
    balanced: true
  }
};

const BENEFICIARIES_TRAINING_DEMOGRAPHICS_TYPE_MAP: Dictionary<TypeMapValue> = {
  gender: {
    title: "Gender",
    typeMap: GENDERS,
    balanced: true
  },
  age: {
    title: "Age",
    typeMap: JOBS_AGES,
    balanced: true
  }
};

const BENEFICIARIES_DEMOGRAPHICS_TYPE_MAP: Dictionary<TypeMapValue> = {
  ...BENEFICIARIES_TRAINING_DEMOGRAPHICS_TYPE_MAP,
  farmer: {
    title: "Farmer",
    typeMap: FARMERS,
    balanced: false
  }
};

const HBF_BENEFICIARIES_TRAINING_DEMOGRAPHICS_TYPE_MAP: Dictionary<TypeMapValue> = {
  gender: {
    title: "Gender",
    typeMap: GENDERS,
    balanced: true
  },
  age: {
    title: "Age",
    typeMap: HBF_AGES,
    balanced: false
  }
};

const HBF_BENEFICIARIES_DEMOGRAPHICS_TYPE_MAP: Dictionary<TypeMapValue> = {
  ...HBF_BENEFICIARIES_TRAINING_DEMOGRAPHICS_TYPE_MAP,
  farmer: {
    title: "Farmer",
    typeMap: HBF_FARMERS,
    balanced: false
  },
  caste: {
    title: "Caste",
    typeMap: CASTES,
    balanced: false
  }
};

const FF_BENEFICIARIES_DEMOGRAPHICS_TYPE_MAP: Dictionary<TypeMapValue> = {
  ...BENEFICIARIES_TRAINING_DEMOGRAPHICS_TYPE_MAP,
  "traditional-community": {
    title: "Traditional Community",
    typeMap: TRADITIONAL_COMMUNITIES,
    balanced: true
  }
};

const LIVELIHOODS_TYPE_MAP: Dictionary<TypeMapValue> = {
  livelihoods: {
    title: "Livelihood Activity",
    displayTrackingType: "Beneficiaries",
    typeMap: LIVELIHOODS,
    balanced: true
  }
};

const getDemographicsTypeMap = (type: TrackingType, framework: Framework) => {
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

const HISTORICAL_YEARS: Dictionary<string> = {
  "3-year": "Last 3 Years",
  older: "More than 3 Years Ago",
  unknown: "Unknown"
};

const GOAL_YEARS: Dictionary<string> = {
  "1-year": "First Year",
  "2-year": "Second Year",
  unknown: "Unknown"
};

const GOAL_STRATEGY: Dictionary<string> = {
  anr: "Assisted Natural Regeneration",
  "direct-seeding": "Direct Seeding",
  "tree-planting": "Tree Planting",
  unknown: "Unknown"
};

const FF_LAND_USE: Dictionary<string> = {
  agroforest: "Agroforest",
  "natural-forest": "Natural Forest",
  "riparian-area-or-wetland": "Riparian Area or Wetland",
  silvopasture: "Silvopasture",
  "urban-forest": "Urban Forest",
  "woodlot-or-plantation": "Woodlot or Plantation",
  unknown: "Unknown"
};

const LAND_USE: Dictionary<string> = {
  agroforest: "Agroforest",
  "natural-forest": "Natural Forest",
  "riparian-area-or-wetland": "Riparian Area or Wetland",
  silvopasture: "Silvopasture",
  "urban-forest": "Urban Forest",
  "woodlot-or-plantation": "Woodlot or Plantation",
  mangrove: "Mangrove",
  peatland: "Peatland",
  "open-natural-ecosystem": "Open Natural Ecosystem",
  unknown: "Unknown"
};

const HISTORICAL: Dictionary<TypeMapValue> = {
  years: {
    title: "Years",
    typeMap: HISTORICAL_YEARS,
    balanced: true,
    onlyIfPresent: ["unknown"]
  }
};

const TREES_GOAL: Dictionary<TypeMapValue> = {
  years: {
    title: "Years",
    typeMap: GOAL_YEARS,
    balanced: true
  },
  strategy: {
    title: "Strategy",
    typeMap: GOAL_STRATEGY,
    balanced: false
  }
};

const HECTARES_GOAL: Dictionary<TypeMapValue> = {
  ...TREES_GOAL,
  strategy: {
    ...TREES_GOAL.strategy,
    balanced: true
  },
  "land-use": {
    title: "Land Use",
    typeMap: LAND_USE,
    balanced: true
  }
};

const FF_HECTARES_GOAL: Dictionary<TypeMapValue> = {
  ...HECTARES_GOAL,
  "land-use": {
    title: "Land Use",
    typeMap: FF_LAND_USE,
    balanced: true
  }
};

const getRestorationTypeMap = (type: TrackingType, framework: Framework) => {
  if (type === "treesGoal") {
    return TREES_GOAL;
  } else if (type === "hectaresGoal") {
    return framework === Framework.FF_1 ? FF_HECTARES_GOAL : HECTARES_GOAL;
  } else return HISTORICAL;
};

export const getTypeMap = (
  domain: TrackingDomain,
  type: TrackingType,
  framework: Framework
): Dictionary<TypeMapValue> => {
  switch (domain) {
    case "demographics":
      return getDemographicsTypeMap(type, framework);
    case "restoration":
      return getRestorationTypeMap(type, framework);

    default:
      throw new Error(`Unsupported domain: ${domain}`);
  }
};
