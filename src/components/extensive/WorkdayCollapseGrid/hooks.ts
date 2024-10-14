import { Dictionary, findLastIndex, uniq } from "lodash";
import { useMemo } from "react";

import { Framework } from "@/context/framework.provider";

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

export interface SectionRow {
  demographicIndex: number;
  typeName: string;
  label: string;
  userLabel?: string;
  amount: number;
}

export function calculateTotals(demographics: Demographic[]) {
  const counts = demographics.reduce(
    function (counts, { type, amount }) {
      counts[type] += amount;
      return counts;
    },
    { gender: 0, age: 0, ethnicity: 0, caste: 0 }
  );

  const total = Math.max(counts.age, counts.gender, counts.ethnicity, counts.caste);
  const countsMatch = uniq([counts.age, counts.gender, counts.ethnicity, counts.caste]).length === 1;
  return { counts, total, countsMatch };
}

export function useTableStatus(framework: Framework, demographics: Demographic[]): { total: number; status: Status } {
  return useMemo(
    function () {
      const { counts, total, countsMatch } = calculateTotals(demographics);

      let status: Status = "in-progress";
      if (total === 0) {
        status = "not-started";
      } else if (countsMatch || (framework === Framework.HBF && counts.gender !== 0)) {
        status = "complete";
      }

      return { total: framework === Framework.HBF ? counts.gender : total, status };
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
export type FrameworkDemographicTypes<T extends Framework> = T extends Framework.HBF
  ? HBFDemographicType
  : DemographicType;

function getDemographicTypes<T extends Framework>(framework: T): Readonly<string[]> {
  return framework === Framework.HBF ? HBF_DEMOGRAPHIC_TYPES : DEMOGRAPHIC_TYPES;
}

function getDemographicTypesMap<T extends Framework>(framework: T) {
  return framework === Framework.HBF ? HBF_DEMOGRAPHIC_TYPE_MAP : DEMOGRAPHIC_TYPE_MAP;
}

export function useSectionData<T extends Framework>(
  framework: T,
  type: FrameworkDemographicTypes<T>,
  demographics: Demographic[]
) {
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
