import { Dictionary } from "lodash";

export type Status = "complete" | "not-started" | "in-progress";

export const DEMOGRAPHIC_TYPES = ["gender", "age", "ethnicity"] as const;
export type DemographicType = (typeof DEMOGRAPHIC_TYPES)[number];

export interface Demographic {
  type: DemographicType;
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

const AGES: Dictionary<string> = {
  youth: "Youth (15-24)",
  adult: "Adult (24-64)",
  elder: "Elder (65+)",
  unknown: "Unknown"
};

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
