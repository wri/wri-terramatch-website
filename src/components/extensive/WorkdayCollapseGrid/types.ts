import { Dictionary } from "lodash";

export type Status = "complete" | "not-started" | "in-progress";

export const DEMOGRAPHIC_TYPES = ["gender", "age", "ethnicity"] as const;
export const HBF_DEMOGRAPHIC_TYPES = ["gender", "age", "caste"] as const;
export type DemographicType = (typeof DEMOGRAPHIC_TYPES)[number];
export type HBFDemographicType = (typeof HBF_DEMOGRAPHIC_TYPES)[number];

export interface Demographic {
  type: DemographicType | HBFDemographicType;
  subtype?: string;
  name?: string;
  amount: number;
}

export interface WorkdayGridVariantProps {
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

export interface WorkdayCollapseGridProps {
  title?: string;
  demographics: Demographic[];
  variant: WorkdayGridVariantProps;
  onChange?: (demographics: Demographic[]) => void;
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

const HBF_AGES = Object.fromEntries(Object.entries(AGES).filter(([key]) => key === "youth"));

const ETHNICITIES: Dictionary<string> = {
  indigenous: "Indigenous",
  other: "Other",
  unknown: "Unknown"
};

export const DEMOGRAPHIC_TYPE_MAP: Dictionary<{
  title: string;
  typeMap: Dictionary<string>;
  addSubtypeLabel?: string;
}> = {
  gender: {
    title: "Gender",
    typeMap: GENDERS
  },
  age: {
    title: "Age",
    typeMap: AGES
  },
  ethnicity: {
    title: "Ethnicity",
    typeMap: ETHNICITIES,
    addSubtypeLabel: "Add Ethnic Group"
  }
};

export const HBF_DEMOGRAPHIC_TYPE_MAP: Dictionary<{
  title: string;
  typeMap: Dictionary<string>;
  addSubtypeLabel?: string;
}> = {
  gender: {
    title: "Gender",
    typeMap: HBF_GENDERS
  },
  age: {
    title: "Age",
    typeMap: HBF_AGES
  },
  caste: {
    title: "Caste",
    typeMap: CASTES
  }
};
