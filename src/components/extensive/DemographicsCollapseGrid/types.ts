import { Dictionary } from "lodash";
import { useMemo } from "react";

import { Framework, useFrameworkContext } from "@/context/framework.provider";
import { DemographicDto, DemographicEntryDto } from "@/generated/v3/entityService/entityServiceSchemas";

export type DemographicEntity = "project-reports" | "site-reports";

export type Status = "complete" | "not-started" | "in-progress";

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

type DemographicalTypeProperties = {
  sectionLabel: string;
  rowLabelSingular: string;
  rowLabelPlural: string;
};

export const DEMOGRAPHIC_TYPES: { [k in DemographicType]: DemographicalTypeProperties } = {
  workdays: {
    sectionLabel: "Total Workdays",
    rowLabelSingular: "Day",
    rowLabelPlural: "Days"
  },
  restorationPartners: {
    sectionLabel: "Total Restoration Partners",
    rowLabelSingular: "Person",
    rowLabelPlural: "People"
  },
  jobs: {
    sectionLabel: "Total Jobs",
    rowLabelSingular: "Job",
    rowLabelPlural: "Jobs"
  }
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

type TypeMapValue = {
  title: string;
  typeMap: Dictionary<string>;
  addNameLabel?: string;
};

const DEMOGRAPHIC_TYPE_MAP: Dictionary<TypeMapValue> = {
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
    addNameLabel: "Add Ethnic Group"
  }
};

const HBF_DEMOGRAPHIC_TYPE_MAP: Dictionary<TypeMapValue> = {
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

const JOBS_DEMOGRAPHICS_TYPE_MAP: Dictionary<TypeMapValue> = {
  gender: {
    title: "Gender",
    typeMap: GENDERS
  },
  age: {
    title: "Age",
    typeMap: JOBS_AGES
  }
};

const getTypeMap = (type: DemographicType, framework: Framework) => {
  if (framework === Framework.HBF) return HBF_DEMOGRAPHIC_TYPE_MAP;
  else return type === "jobs" ? JOBS_DEMOGRAPHICS_TYPE_MAP : DEMOGRAPHIC_TYPE_MAP;
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
