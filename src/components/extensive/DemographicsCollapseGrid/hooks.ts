import { Dictionary, findLastIndex, kebabCase, uniq } from "lodash";
import { useMemo } from "react";

import { useDemographics } from "@/connections/EntityAssociation";
import { Framework, useFrameworkContext } from "@/context/framework.provider";
import { DemographicEntryDto } from "@/generated/v3/entityService/entityServiceSchemas";

import { DemographicEntity, DemographicType, getTypeMap, Status, useEntryTypeMap } from "./types";

type Position = "first" | "last" | undefined;

export type SectionRow = {
  demographicIndex: number;
  typeName: string;
  label: string;
  userLabel?: string;
  amount: number;
};

const getInitialCounts = <T extends Framework>(framework: T, type: DemographicType): Dictionary<number> =>
  Object.keys(getTypeMap(type, framework)).reduce(
    (counts, type) => ({
      ...counts,
      [type]: 0
    }),
    {}
  );

const addToCounts = (counts: Dictionary<number>, { type, amount }: DemographicEntryDto) =>
  Object.keys(counts).includes(type) ? { ...counts, [type]: counts[type] + amount } : counts;

export function calculateTotals(entries: DemographicEntryDto[], framework: Framework, type: DemographicType) {
  const counts = entries.reduce(addToCounts, getInitialCounts(framework, type));
  const typeMap = getTypeMap(type, framework);
  const balancedCounts = Object.entries(counts)
    .filter(([type]) => typeMap[type].balanced)
    .map(([, count]) => count);
  const total = Math.max(...balancedCounts);
  const complete = uniq(balancedCounts).length === 1;

  return { counts, total, complete };
}

export function useTableStatus(
  type: DemographicType,
  entries: DemographicEntryDto[]
): { total: number; status: Status } {
  const { framework } = useFrameworkContext();
  return useMemo(() => {
    const { total, complete } = calculateTotals(entries, framework, type);
    return {
      total,
      status: total === 0 ? "not-started" : complete ? "complete" : "in-progress"
    };
  }, [entries, framework, type]);
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

export function useSectionData(type: DemographicType, entryType: string, entries: DemographicEntryDto[]) {
  const demographicTypes = useEntryTypeMap(type);

  return useMemo(
    function () {
      const { title, addNameLabel, typeMap } = demographicTypes[entryType];
      const rows = mapRows(addNameLabel != null, typeMap, entries);
      const total = rows.reduce((total, { amount }) => total + amount, 0);
      const entryTypes = Object.keys(demographicTypes);
      const index = entryTypes.indexOf(entryType);
      const position: Position = index == 0 ? "first" : index == entryTypes.length - 1 ? "last" : undefined;
      return { title, rows, total, position };
    },
    [entries, entryType, demographicTypes]
  );
}

export type CollectionsTotalProps = {
  entity: DemographicEntity;
  uuid: string;
  demographicType: DemographicType;
  collections: readonly string[];
};
export default function useCollectionsTotal({ entity, uuid, demographicType, collections }: CollectionsTotalProps) {
  const [, { associations: demographics }] = useDemographics({ entity, uuid });
  const { framework } = useFrameworkContext();
  return useMemo(() => {
    const apiType = kebabCase(demographicType);
    return demographics == null
      ? undefined
      : demographics
          .filter(demographic => demographic.type === apiType && collections.includes(demographic.collection))
          .reduce((total, { entries }) => total + calculateTotals(entries, framework, demographicType).total, 0);
  }, [collections, demographics, framework, demographicType]);
}
