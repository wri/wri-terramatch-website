import { Dictionary, findLastIndex, kebabCase, uniq } from "lodash";
import { useMemo } from "react";

import { useTrackings } from "@/connections/EntityAssociation";
import { Framework, useFrameworkContext } from "@/context/framework.provider";
import { TrackingEntryDto } from "@/generated/v3/entityService/entityServiceSchemas";

import { getTypeMap, Status, TrackingDomain, TrackingEntity, TrackingType, useEntryTypeMap } from "./types";

type Position = "first" | "last" | undefined;

export type SectionRow = {
  entryIndex: number;
  typeName: string;
  label: string;
  userLabel?: string;
  amount: number;
};

const getInitialCounts = (framework: Framework, domain: TrackingDomain, type: TrackingType): Dictionary<number> =>
  Object.keys(getTypeMap(domain, type, framework)).reduce(
    (counts, type) => ({
      ...counts,
      [type]: 0
    }),
    {}
  );

const addToCounts = (counts: Dictionary<number>, { type, amount }: TrackingEntryDto) =>
  Object.keys(counts).includes(type) ? { ...counts, [type]: counts[type] + amount } : counts;

export function calculateTotals(
  entries: TrackingEntryDto[],
  framework: Framework,
  domain: TrackingDomain,
  type: TrackingType
) {
  const counts = entries.reduce(addToCounts, getInitialCounts(framework, domain, type));
  const typeMap = getTypeMap(domain, type, framework);
  const balancedCounts = Object.entries(counts)
    .filter(([type]) => typeMap[type].balanced)
    .map(([, count]) => count);
  const total = Math.max(...balancedCounts);
  const complete = uniq(balancedCounts).length === 1;

  const startedBalancedCount = balancedCounts.filter(count => count > 0).length;

  return { counts, total, complete, startedBalancedCount };
}

export function useTableStatus(
  domain: TrackingDomain,
  type: TrackingType,
  entries: TrackingEntryDto[]
): { total: number; status: Status; counts: Dictionary<number>; startedBalancedCount: number } {
  const { framework } = useFrameworkContext();
  return useMemo(() => {
    const { total, complete, counts, startedBalancedCount } = calculateTotals(entries, framework, domain, type);
    return {
      total,
      status: total === 0 ? "not-started" : complete ? "complete" : "in-progress",
      counts,
      startedBalancedCount
    };
  }, [entries, framework, domain, type]);
}

function mapRows(usesName: boolean, typeMap: Dictionary<string>, entries: TrackingEntryDto[]) {
  if (usesName) {
    return entries.map(
      ({ subtype, name, amount }, index): SectionRow => ({
        entryIndex: index,
        typeName: name ?? "unknown",
        label: typeMap[subtype!],
        userLabel: name ?? undefined,
        amount
      })
    );
  }

  return Object.keys(typeMap).map((typeName): SectionRow => {
    // Using findLastIndex to deal with a bug that should now be resolved, but there is some existing
    // data in update requests that is still affected. TM-1098
    const entryIndex = findLastIndex(entries, ({ subtype }) => subtype === typeName);
    return {
      entryIndex,
      typeName,
      label: typeMap[typeName],
      amount: entryIndex >= 0 ? entries[entryIndex].amount : 0
    };
  });
}

export function useSectionData(
  domain: TrackingDomain,
  type: TrackingType,
  entryType: string,
  entries: TrackingEntryDto[]
) {
  const trackingEntryTypes = useEntryTypeMap(domain, type);

  return useMemo(
    function () {
      const { title, addNameLabel, typeMap } = trackingEntryTypes[entryType];
      const rows = mapRows(addNameLabel != null, typeMap, entries);
      const total = rows.reduce((total, { amount }) => total + amount, 0);
      const entryTypes = Object.keys(trackingEntryTypes);
      const index = entryTypes.indexOf(entryType);
      const position: Position = index == 0 ? "first" : index == entryTypes.length - 1 ? "last" : undefined;
      return { title, rows, total, position };
    },
    [entries, entryType, trackingEntryTypes]
  );
}

export type CollectionsTotalProps = {
  entity: TrackingEntity;
  uuid: string;
  domain: TrackingDomain;
  trackingType: TrackingType;
  collections: readonly string[];
};
export default function useCollectionsTotal({
  entity,
  uuid,
  domain: trackingDomain,
  trackingType,
  collections
}: CollectionsTotalProps) {
  const [, { data: trackings }] = useTrackings({ entity, uuid });
  const { framework } = useFrameworkContext();
  return useMemo(() => {
    const apiType = kebabCase(trackingType);
    return trackings == null
      ? undefined
      : trackings
          .filter(
            ({ domain, type, collection }) =>
              domain === trackingDomain && type === apiType && collections.includes(collection)
          )
          .reduce(
            (total, { entries }) => total + calculateTotals(entries, framework, trackingDomain, trackingType).total,
            0
          );
  }, [trackingType, trackings, trackingDomain, collections, framework]);
}
