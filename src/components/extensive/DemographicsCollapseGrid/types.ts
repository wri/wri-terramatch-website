import { Dictionary } from "lodash";
import { useMemo } from "react";

import { Framework, useFrameworkContext } from "@/context/framework.provider";
import { DemographicCollections } from "@/generated/v3/entityService/entityServiceConstants";
import { DemographicDto, DemographicEntryDto } from "@/generated/v3/entityService/entityServiceSchemas";

export type DemographicEntity = "projectReports" | "siteReports";

export type Status = "complete" | "not-started" | "in-progress";

export type WorkdayCollection =
  | (typeof DemographicCollections.WORKDAYS_PROJECT)[number]
  | (typeof DemographicCollections.WORKDAYS_SITE)[number];
export type RestorationPartnerCollection = (typeof DemographicCollections.RESTORATION_PARTNERS_PROJECT)[number];
export type JobsCollection = (typeof DemographicCollections.JOBS_PROJECT)[number];
export type VolunteersCollection = (typeof DemographicCollections.VOLUNTEERS_PROJECT)[number];
export type AllBeneficiariesCollection = (typeof DemographicCollections.BENEFICIARIES_PROJECT_ALL)[number];
export type TrainingBeneficiariesCollection = (typeof DemographicCollections.BENEFICIARIES_PROJECT_TRAINING)[number];

export interface DemographicGridVariantProps {
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

export type DemographicType = KebabToCamelCase<DemographicDto["type"]>;

type DemographicLabelProperties = {
  sectionLabel: string;
  rowLabelSingular: string;
  rowLabelPlural: string;
};

const DEMOGRAPHIC_LABELS: { [k in DemographicType]: DemographicLabelProperties } = {
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
  }
};

export const useDemographicLabels = (type: DemographicType) => {
  const { framework } = useFrameworkContext();
  return useMemo(() => {
    const props = DEMOGRAPHIC_LABELS[type];
    if (type.endsWith("Beneficiaries") && framework === Framework.HBF) {
      return {
        ...props,
        rowLabelSingular: "Partner",
        rowLabelPlural: "Partners"
      } as DemographicLabelProperties;
    }

    return props;
  }, [framework, type]);
};

export interface DemographicsCollapseGridProps {
  title?: string;
  type: DemographicType;
  entries: DemographicEntryDto[];
  variant: DemographicGridVariantProps;
  onChange?: (demographics: DemographicEntryDto[]) => void;
}

const GENDERS: Dictionary<string> = {
  male: "Male",
  female: "Female",
  "non-binary": "Non-binary",
  unknown: "Unknown"
};

const HBF_GENDERS = Object.fromEntries(Object.entries(GENDERS).filter(([key]) => key !== "unknown"));

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
  youth: "Youth (15-29)"
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

type TypeMapValue = {
  title: string;
  typeMap: Dictionary<string>;
  // If true, this field is required to balance with other "balanced" fields for a demographic
  // input to be considered complete.
  balanced: boolean;
  addNameLabel?: string;
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
    typeMap: HBF_GENDERS,
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

export const getTypeMap = (type: DemographicType, framework: Framework) => {
  if (["jobs", "volunteers", "employees", "associates"].includes(type)) {
    switch (framework) {
      case Framework.HBF:
        return HBF_JOBS_DEMOGRAPHICS_TYPE_MAP;
      case Framework.FF:
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
          return FF_BENEFICIARIES_DEMOGRAPHICS_TYPE_MAP;
        default:
          return BENEFICIARIES_TRAINING_DEMOGRAPHICS_TYPE_MAP;
      }
    } else {
      switch (framework) {
        case Framework.HBF:
          return HBF_BENEFICIARIES_DEMOGRAPHICS_TYPE_MAP;
        case Framework.FF:
          return FF_BENEFICIARIES_DEMOGRAPHICS_TYPE_MAP;
        default:
          return BENEFICIARIES_DEMOGRAPHICS_TYPE_MAP;
      }
    }
  } else {
    switch (framework) {
      case Framework.HBF:
        return HBF_DEMOGRAPHIC_TYPE_MAP;
      default:
        return DEMOGRAPHIC_TYPE_MAP;
    }
  }
};

export const useEntryTypeMap = (type: DemographicType) => {
  const { framework } = useFrameworkContext();
  return useMemo(() => getTypeMap(type, framework), [type, framework]);
};

export const useEntryTypes = (type: DemographicType) => {
  const { framework } = useFrameworkContext();
  return useMemo(() => Object.keys(getTypeMap(type, framework)), [framework, type]);
};

export const useEntryTypeDefinition = (type: DemographicType, entryType: string) => {
  const { framework } = useFrameworkContext();
  return useMemo(() => getTypeMap(type, framework)[entryType], [entryType, framework, type]);
};
