import { Dictionary, find, uniq } from "lodash";
import { useMemo } from "react";

import { Demographic, DEMOGRAPHIC_TYPE_MAP, DEMOGRAPHIC_TYPES, DemographicType, Status } from "./types";

export type Position = "first" | "last" | null;

export interface SectionRow {
  label: string;
  userLabel?: string;
  amount: number;
}

export function useTableStatus(demographics: Demographic[]): { total: number; status: Status } {
  return useMemo(
    function () {
      const counts = demographics.reduce(
        function (counts, { type, amount }) {
          counts[type] += amount;
          return counts;
        },
        { gender: 0, age: 0, ethnicity: 0 }
      );

      const total = Math.max(counts.age, counts.gender, counts.ethnicity);
      const countsMatch = uniq([counts.age, counts.gender, counts.ethnicity]).length === 1;

      let status: Status = "in-progress";
      if (total === 0) {
        status = "not-started";
      } else if (countsMatch) {
        status = "complete";
      }

      return { total, status };
    },
    [demographics]
  );
}

function mapRows(usesSubtype: boolean, typeMap: Dictionary<string>, demographics: Demographic[]) {
  if (usesSubtype) {
    return demographics.map(({ subtype, name, amount }) => ({
      label: typeMap[subtype!],
      userLabel: name,
      amount
    }));
  }

  return Object.keys(typeMap).map(
    (typeName): SectionRow => ({
      label: typeMap[typeName],
      amount: find(demographics, ({ name }) => name === typeName)?.amount ?? 0
    })
  );
}

export function useSectionData(type: DemographicType, demographics: Demographic[]) {
  return useMemo(
    function () {
      const { title, usesSubtype, typeMap } = DEMOGRAPHIC_TYPE_MAP[type];
      const rows = mapRows(usesSubtype, typeMap, demographics);
      const total = rows.reduce((total, { amount }) => total + amount, 0);
      const index = DEMOGRAPHIC_TYPES.indexOf(type);
      const position: Position = index == 0 ? "first" : index == DEMOGRAPHIC_TYPES.length - 1 ? "last" : null;
      const subtypes = usesSubtype ? typeMap : undefined;
      return { title, rows, total, position, subtypes };
    },
    [demographics, type]
  );
}
