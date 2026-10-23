import { Framework, shouldHideNurseries, toFramework } from "@/context/framework.provider";
import type { EntityExportAllQueryParams } from "@/generated/v3/entityService/entityServiceComponents";
import type {
  NurseryLightDto,
  ProjectFullDto,
  ProjectLightDto
} from "@/generated/v3/entityService/entityServiceSchemas";
import { getEntityDetailPageLink } from "@/helpers/entity";
import { appendQueryParams } from "@/utils/appendQueryParams";
import { mapStatusToTagStateEntity } from "@/utils/mapStatusToTagStateEntity";

import type { NurseryIndexRow } from "./nurseryIndex.types";

export const NURSERY_INDEX_ORIGIN = "nurseries";

type NurseryWithProjectUuid = NurseryLightDto & { projectUuid?: string | null };

export const getNurseryDetailUrl = (nurseryUuid: string, fromNurseryIndex: boolean, tab?: string): string =>
  appendQueryParams(getEntityDetailPageLink("nurseries", nurseryUuid, tab), {
    origin: fromNurseryIndex ? NURSERY_INDEX_ORIGIN : undefined
  });

export const projectSupportsNurseries = (frameworkKey?: string | null) =>
  !shouldHideNurseries(toFramework(frameworkKey));

export const toNurseryIndexStatus = (status: string | null | undefined): NurseryIndexRow["status"] => {
  if (status == null || status.trim() === "") return null;

  const mapped = mapStatusToTagStateEntity(status)?.type;
  if (
    mapped === "draft" ||
    mapped === "pending-approval" ||
    mapped === "information-required" ||
    mapped === "approved"
  ) {
    return mapped;
  }

  return "draft";
};

export const toNurseryIndexRows = (
  nurseries: NurseryLightDto[],
  project?: Pick<ProjectLightDto, "uuid" | "frameworkKey">
): NurseryIndexRow[] =>
  nurseries
    .map(nursery => ({
      ...nursery,
      id: nursery.uuid,
      projectUuid: project?.uuid ?? (nursery as NurseryWithProjectUuid).projectUuid ?? null,
      projectFrameworkKey: project?.frameworkKey ?? nursery.frameworkKey,
      status: toNurseryIndexStatus(nursery.status)
    }))
    .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));

const getNurserySeedlingsGrownCount = (nursery: Pick<NurseryLightDto, "treesSeedlingsGrownCount">) =>
  nursery.treesSeedlingsGrownCount ?? 0;

export const sumNurserySeedlingsGrown = (nurseries: Array<Pick<NurseryLightDto, "treesSeedlingsGrownCount">>) =>
  nurseries.reduce((total, nursery) => total + getNurserySeedlingsGrownCount(nursery), 0);

const firstPositiveGoal = (...values: Array<number | null | undefined>) =>
  values.find(value => value != null && value > 0) ?? 0;

/** Seedlings goal for a project section header, taken from the full project when it's loaded. */
export const getSeedlingsGoal = (project?: ProjectFullDto | null) =>
  firstPositiveGoal(project?.nurserySeedlingsGoal, project?.seedsGrownGoal, project?.treesGrownGoal);

type NurseryExportFrameworkKey = NonNullable<EntityExportAllQueryParams["frameworkKey"]>;

export const groupNurseryUuidsByFramework = (nurseries: NurseryIndexRow[]) => {
  const grouped = new Map<NurseryExportFrameworkKey, string[]>();

  nurseries.forEach(nursery => {
    const framework = toFramework(nursery.projectFrameworkKey ?? nursery.frameworkKey);
    if (framework === Framework.UNDEFINED) {
      return;
    }

    const frameworkKey = framework as NurseryExportFrameworkKey;
    const uuids = grouped.get(frameworkKey) ?? [];
    uuids.push(nursery.uuid);
    grouped.set(frameworkKey, uuids);
  });

  return Array.from(grouped, ([frameworkKey, uuids]) => ({ frameworkKey, uuids }));
};
