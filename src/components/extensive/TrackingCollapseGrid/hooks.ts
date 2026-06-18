import { Dictionary, findLastIndex, kebabCase, startCase, uniq } from "lodash";
import { useMemo } from "react";

import { useTrackings } from "@/connections/EntityAssociation";
import { useFrameworkContext } from "@/context/framework.provider";
import { TrackingEntryDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { isNotNull } from "@/utils/array";

import {
  getDefaultEntryConfigs,
  Status,
  TrackingDomain,
  TrackingEntity,
  TrackingEntryConfig,
  TrackingEntrySubtypeConfig,
  TrackingType
} from "./types";

type Position = "first" | "last" | undefined;

export type SectionRow = {
  entryIndex: number;
  typeName: string;
  label: string;
  userLabel?: string;
  amount: number;
};

const getInitialCounts = (entryConfigs: TrackingEntryConfig[]): Dictionary<number> =>
  entryConfigs
    .map(({ type }) => type)
    .reduce(
      (counts, type) => ({
        ...counts,
        [type]: 0
      }),
      {}
    );

const addToCounts = (counts: Dictionary<number>, { type, amount }: TrackingEntryDto) =>
  Object.keys(counts).includes(type) ? { ...counts, [type]: counts[type] + amount } : counts;

export function calculateTotals(entryConfigs: TrackingEntryConfig[], entries: TrackingEntryDto[]) {
  const counts = entries.reduce(addToCounts, getInitialCounts(entryConfigs));
  const balancedCounts = Object.entries(counts)
    .filter(([type]) => entryConfigs.find(entryConfig => entryConfig.type === type)?.balanced)
    .map(([, count]) => count);
  const total = Math.max(...balancedCounts);
  const complete = uniq(balancedCounts).length === 1;

  return { counts, total, complete };
}

export function useTableStatus(
  entryConfigs: TrackingEntryConfig[],
  entries: TrackingEntryDto[]
): { total: number; status: Status; counts: Dictionary<number> } {
  return useMemo(() => {
    const { total, complete, counts } = calculateTotals(entryConfigs, entries);
    return {
      total,
      status: total === 0 ? "not-started" : complete ? "complete" : "in-progress",
      counts
    };
  }, [entryConfigs, entries]);
}

function mapRows(
  usesName: boolean,
  subTypes: TrackingEntrySubtypeConfig[],
  entries: TrackingEntryDto[],
  onlyIfPresent?: string[]
) {
  if (usesName) {
    return entries.map(
      ({ subtype, name, amount }, index): SectionRow => ({
        entryIndex: index,
        typeName: name ?? "unknown",
        label: subTypes.find(config => config.subtype === subtype)?.label ?? "unknown",
        userLabel: name ?? undefined,
        amount
      })
    );
  }

  return subTypes
    .map(({ subtype, label }): SectionRow | undefined => {
      // Using findLastIndex to deal with a bug that should now be resolved, but there is some existing
      // data in update requests that is still affected. TM-1098
      const entryIndex = findLastIndex(entries, entry => entry.subtype === subtype);
      if (entryIndex < 0 && onlyIfPresent != null && onlyIfPresent.includes(subtype)) return undefined;
      return {
        entryIndex,
        typeName: subtype,
        label,
        amount: entryIndex >= 0 ? entries[entryIndex].amount : 0
      };
    })
    .filter(isNotNull);
}

export const useSectionData = (
  entryConfigs: TrackingEntryConfig[],
  type: TrackingType,
  entryType: string,
  entries: TrackingEntryDto[]
) =>
  useMemo(() => {
    const entryConfig = entryConfigs.find(({ type }) => type === entryType);
    if (entryConfig == null) {
      throw new Error(`Entry type ${entryType} not found`);
    }

    const { title, addNameLabel, subTypes, onlyIfPresent, displayTrackingType } = entryConfig;
    const rows = mapRows(addNameLabel != null, subTypes, entries, onlyIfPresent);
    const total = rows.reduce((total, { amount }) => total + amount, 0);
    const index = entryConfigs.findIndex(({ type }) => type === entryType);
    const position: Position = index == 0 ? "first" : index == entryConfigs.length - 1 ? "last" : undefined;
    return {
      title,
      rows,
      total,
      position,
      displayTrackingType: displayTrackingType ?? type.includes("Beneficiaries") ? "Beneficiaries" : startCase(type)
    };
  }, [entries, entryType, entryConfigs, type]);

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
            (total, { entries }) =>
              total + calculateTotals(getDefaultEntryConfigs(trackingDomain, trackingType, framework), entries).total,
            0
          );
  }, [trackingType, trackings, trackingDomain, collections, framework]);
}
