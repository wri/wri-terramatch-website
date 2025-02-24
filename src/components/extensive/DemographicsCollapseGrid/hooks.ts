import { Dictionary, findLastIndex, uniq } from "lodash";
import { useMemo } from "react";

import { useDemographics } from "@/connections/EntityAssocation";
import { Framework, useFrameworkContext } from "@/context/framework.provider";
import { DemographicEntryDto } from "@/generated/v3/entityService/entityServiceSchemas";

import { DEMOGRAPHIC_TYPE_MAP, DemographicEntity, DemographicType, HBF_DEMOGRAPHIC_TYPE_MAP, Status } from "./types";

type Position = "first" | "last" | undefined;

export type SectionRow = {
  demographicIndex: number;
  typeName: string;
  label: string;
  userLabel?: string;
  amount: number;
};

const getInitialCounts = <T extends Framework>(framework: T): Dictionary<number> =>
  framework === Framework.HBF ? { gender: 0, age: 0, caste: 0 } : { gender: 0, age: 0, ethnicity: 0 };

const addToCounts = (counts: Dictionary<number>, { type, amount }: DemographicEntryDto) =>
  Object.keys(counts).includes(type) ? { ...counts, [type]: counts[type] + amount } : counts;

export function calculateTotals(entries: DemographicEntryDto[], framework: Framework) {
  const counts = entries.reduce(addToCounts, getInitialCounts(framework));
  const isHBF = framework === Framework.HBF;
  const total = isHBF ? counts.gender : Math.max(counts.age, counts.gender, counts.ethnicity);
  const complete = isHBF ? counts.gender > 0 : uniq([counts.age, counts.gender, counts.ethnicity]).length === 1;

  return { counts, total, complete };
}

export function useTableStatus(demographics: DemographicEntryDto[]): { total: number; status: Status } {
  const { framework } = useFrameworkContext();
  return useMemo(() => {
    const { total, complete } = calculateTotals(demographics, framework);
    return {
      total,
      status: total === 0 ? "not-started" : complete ? "complete" : "in-progress"
    };
  }, [demographics, framework]);
}

function mapRows(usesName: boolean, typeMap: Dictionary<string>, entries: DemographicEntryDto[]) {
  if (usesName) {
    return entries.map(
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
    const demographicIndex = findLastIndex(entries, ({ subtype }) => subtype === typeName);
    return {
      demographicIndex,
      typeName,
      label: typeMap[typeName],
      amount: demographicIndex >= 0 ? entries[demographicIndex].amount : 0
    };
  });
}

function getDemographicTypes<T extends Framework>(framework: T) {
  return framework === Framework.HBF ? HBF_DEMOGRAPHIC_TYPE_MAP : DEMOGRAPHIC_TYPE_MAP;
}

export function useSectionData(type: string, entries: DemographicEntryDto[]) {
  const { framework } = useFrameworkContext();
  const demographicTypes = getDemographicTypes(framework);

  return useMemo(
    function () {
      const { title, addNameLabel, typeMap } = demographicTypes[type];
      const rows = mapRows(addNameLabel != null, typeMap, entries);
      const total = rows.reduce((total, { amount }) => total + amount, 0);
      const entryTypes = Object.keys(demographicTypes);
      const index = entryTypes.indexOf(type);
      const position: Position = index == 0 ? "first" : index == entryTypes.length - 1 ? "last" : undefined;
      return { title, rows, total, position };
    },
    [entries, type, demographicTypes]
  );
}

export default function useCollectionsTotal(
  entity: DemographicEntity,
  uuid: string,
  type: DemographicType,
  collections: readonly string[]
) {
  const [, { associations: demographics }] = useDemographics({ entity, uuid });
  const { framework } = useFrameworkContext();
  return useMemo(() => {
    if (demographics == null) return;

    const counts = demographics
      .filter(demographic => demographic.type === type && collections.includes(demographic.collection))
      .reduce((counts, { entries }) => entries.reduce(addToCounts, counts), getInitialCounts(framework));

    return framework === Framework.HBF ? Math.max(counts.gender, counts.age, counts.caste) : counts.gender;
  }, [collections, demographics, framework, type]);
}
