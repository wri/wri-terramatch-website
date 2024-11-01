import { Dictionary, findLastIndex, uniq } from "lodash";
import { useMemo } from "react";

import { Framework, useFrameworkContext } from "@/context/framework.provider";

import {
  Demographic,
  DEMOGRAPHIC_TYPE_MAP,
  DEMOGRAPHIC_TYPES,
  DemographicType,
  HBF_DEMOGRAPHIC_TYPE_MAP,
  HBF_DEMOGRAPHIC_TYPES,
  HBFDemographicType,
  Status
} from "./types";

export type Position = "first" | "last" | null;

interface DemographicCounts {
  gender: number;
  age: number;
  ethnicity: number;
}

interface HBFDemographicCounts {
  gender: number;
  age: number;
  caste: number;
}

function isHBFDemographicCounts(
  counts: HBFDemographicCounts | DemographicCounts,
  framework: Framework
): counts is HBFDemographicCounts {
  return framework === Framework.HBF;
}

export type FrameworkDemographicCountTypes<T extends Framework> = T extends Framework.HBF
  ? HBFDemographicCounts
  : DemographicCounts;

function getInitialCounts<T extends Framework>(framework: T) {
  return framework === Framework.HBF
    ? ({
        gender: 0,
        age: 0,
        caste: 0
      } as HBFDemographicCounts)
    : ({
        gender: 0,
        age: 0,
        ethnicity: 0
      } as DemographicCounts);
}

export interface SectionRow {
  demographicIndex: number;
  typeName: string;
  label: string;
  userLabel?: string;
  amount: number;
}

export function calculateTotals(demographics: Demographic[], framework: Framework) {
  const initialCounts = getInitialCounts(framework);
  const counts = demographics.reduce(function (counts, { type, amount }) {
    const typedType = type as keyof FrameworkDemographicCountTypes<typeof framework>;
    counts[typedType] += amount;
    return counts;
  }, initialCounts);

  let total: number = 0;
  let complete: boolean = false;

  if (isHBFDemographicCounts(counts, framework)) {
    total = counts.gender;
    complete = counts.gender > 0;
  } else {
    total = Math.max(counts.age, counts.gender, counts.ethnicity);
    complete = uniq([counts.age, counts.gender, counts.ethnicity]).length === 1;
  }

  return { counts, total, complete };
}

export function useTableStatus(demographics: Demographic[]): { total: number; status: Status } {
  const { framework } = useFrameworkContext();
  return useMemo(
    function () {
      const { total, complete } = calculateTotals(demographics, framework);

      let status: Status = "in-progress";
      if (total === 0) {
        status = "not-started";
      } else if (complete) {
        status = "complete";
      }

      return { total, status };
    },
    [demographics, framework]
  );
}

function mapRows(usesSubtype: boolean, typeMap: Dictionary<string>, demographics: Demographic[]) {
  if (usesSubtype) {
    return demographics.map(
      ({ subtype, name, amount }, index): SectionRow => ({
        demographicIndex: index,
        typeName: name ?? "unknown",
        label: typeMap[subtype!],
        userLabel: name,
        amount
      })
    );
  }

  return Object.keys(typeMap).map((typeName): SectionRow => {
    // Using findLastIndex to deal with a bug that should now be resolved, but there is some existing
    // data in update requests that is still affected. TM-1098
    const demographicIndex = findLastIndex(demographics, ({ name }) => name === typeName);
    return {
      demographicIndex,
      typeName,
      label: typeMap[typeName],
      amount: demographicIndex >= 0 ? demographics[demographicIndex].amount : 0
    };
  });
}

function getDemographicTypes<T extends Framework>(framework: T): Readonly<string[]> {
  return framework === Framework.HBF ? HBF_DEMOGRAPHIC_TYPES : DEMOGRAPHIC_TYPES;
}

function getDemographicTypesMap<T extends Framework>(framework: T) {
  return framework === Framework.HBF ? HBF_DEMOGRAPHIC_TYPE_MAP : DEMOGRAPHIC_TYPE_MAP;
}

export function useSectionData(type: DemographicType | HBFDemographicType, demographics: Demographic[]) {
  const { framework } = useFrameworkContext();
  const demographicTypes = getDemographicTypes(framework);
  const demographicTypesMap = getDemographicTypesMap(framework);

  return useMemo(
    function () {
      const { title, addSubtypeLabel, typeMap } = demographicTypesMap[type];
      const usesSubtype = addSubtypeLabel != null;
      const rows = mapRows(usesSubtype, typeMap, demographics);
      const total = rows.reduce((total, { amount }) => total + amount, 0);
      const index = demographicTypes.indexOf(type);
      const position: Position = index == 0 ? "first" : index == DEMOGRAPHIC_TYPES.length - 1 ? "last" : null;
      const subtypes = usesSubtype ? typeMap : undefined;
      return { title, rows, total, position, subtypes };
    },
    [demographics, type, demographicTypes, demographicTypesMap]
  );
}
