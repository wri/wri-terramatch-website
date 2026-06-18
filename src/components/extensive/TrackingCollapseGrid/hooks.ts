import { Dictionary, findLastIndex, kebabCase, startCase, uniq } from "lodash";
import { useMemo } from "react";

import { useTrackings } from "@/connections/EntityAssociation";
import { Framework, useFrameworkContext } from "@/context/framework.provider";
import { TrackingEntryDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { isNotNull } from "@/utils/array";

import {
  getEntryConfigs,
  Status,
  TrackingDomain,
  TrackingEntity,
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

const getInitialCounts = (
  framework: Framework,
  domain: TrackingDomain,
  trackingType: TrackingType
): Dictionary<number> =>
  getEntryConfigs(domain, trackingType, framework)
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

export function calculateTotals(
  entries: TrackingEntryDto[],
  framework: Framework,
  domain: TrackingDomain,
  type: TrackingType
) {
  const counts = entries.reduce(addToCounts, getInitialCounts(framework, domain, type));
  const entryConfigs = getEntryConfigs(domain, type, framework);
  const balancedCounts = Object.entries(counts)
    .filter(([type]) => entryConfigs.find(entryConfig => entryConfig.type === type)?.balanced)
    .map(([, count]) => count);
  const total = Math.max(...balancedCounts);
  const complete = uniq(balancedCounts).length === 1;

  return { counts, total, complete };
}

export function useTableStatus(
  domain: TrackingDomain,
  type: TrackingType,
  entries: TrackingEntryDto[]
): { total: number; status: Status; counts: Dictionary<number> } {
  const { framework } = useFrameworkContext();
  return useMemo(() => {
    const { total, complete, counts } = calculateTotals(entries, framework, domain, type);
    return {
      total,
      status: total === 0 ? "not-started" : complete ? "complete" : "in-progress",
      counts
    };
  }, [entries, framework, domain, type]);
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

export const useEntryConfigs = (domain: TrackingDomain, type: TrackingType) => {
  const { framework } = useFrameworkContext();
  return useMemo(() => getEntryConfigs(domain, type, framework), [domain, type, framework]);
};

export const useEntryTypes = (domain: TrackingDomain, type: TrackingType) => {
  const { framework } = useFrameworkContext();
  return useMemo(() => getEntryConfigs(domain, type, framework).map(({ type }) => type), [framework, domain, type]);
};

export const useEntryConfig = (domain: TrackingDomain, type: TrackingType, entryType: string) => {
  const { framework } = useFrameworkContext();
  return useMemo(
    () => getEntryConfigs(domain, type, framework).find(({ type }) => type === entryType),
    [entryType, framework, domain, type]
  );
};

export function useSectionData(
  domain: TrackingDomain,
  type: TrackingType,
  entryType: string,
  entries: TrackingEntryDto[]
) {
  const entryConfigs = useEntryConfigs(domain, type);

  return useMemo(() => {
    const entryConfig = entryConfigs.find(({ type }) => type === entryType);
    if (entryConfig == null) {
      throw new Error(`Entry type ${entryType} not found for domain ${domain} and type ${type}`);
    }

    const { title, addNameLabel, subTypes, onlyIfPresent, displayTrackingType } = entryConfig;
    const rows = mapRows(addNameLabel != null, subTypes, entries, onlyIfPresent);
    const total = rows.reduce((total, { amount }) => total + amount, 0);
    const entryTypes = Object.keys(entryConfigs);
    const index = entryTypes.indexOf(entryType);
    const position: Position = index == 0 ? "first" : index == entryTypes.length - 1 ? "last" : undefined;
    return {
      title,
      rows,
      total,
      position,
      displayTrackingType: displayTrackingType ?? type.includes("Beneficiaries") ? "Beneficiaries" : startCase(type)
    };
  }, [domain, entries, entryType, entryConfigs, type]);
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
