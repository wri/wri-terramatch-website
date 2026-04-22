import type { UserDto, UserProjectAffiliation } from "@/generated/v3/userService/userServiceSchemas";
import type { ApiDataStore, StoreResource } from "@/store/apiSlice";
import ApiSlice from "@/store/apiSlice";

export const MONITORING_PROJECT_ATTRIBUTE_KEYS = [
  "monitoringPartnerProjects",
  "monitoring_projects",
  "monitoring_partner_projects"
] as const;

export const MANAGED_PROJECT_ATTRIBUTE_KEYS = ["managedProjects", "managed_projects"] as const;

const MONITORING_RELATIONSHIP_KEYS = [
  "monitoringPartnerProjects",
  "monitoring_partner_projects",
  "monitoringProjects",
  "monitoring_projects"
] as const;

const MANAGED_RELATIONSHIP_KEYS = ["managedProjects", "managed_projects"] as const;

export function normalizeProjectAffiliations(raw: unknown): UserProjectAffiliation[] {
  if (!Array.isArray(raw)) return [];

  const out: UserProjectAffiliation[] = [];
  for (const item of raw) {
    if (item == null || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const uuid =
      typeof o.uuid === "string"
        ? o.uuid
        : typeof o.project_uuid === "string"
        ? o.project_uuid
        : typeof o.projectUuid === "string"
        ? o.projectUuid
        : undefined;
    const name =
      typeof o.name === "string"
        ? o.name
        : typeof o.project_name === "string"
        ? o.project_name
        : typeof o.projectName === "string"
        ? o.projectName
        : undefined;
    if (uuid != null && name != null) out.push({ uuid, name });
  }
  return out;
}

export function projectAffiliationsFromRecord(
  record: Record<string, unknown>,
  keys: readonly string[]
): UserProjectAffiliation[] {
  for (const key of keys) {
    const normalized = normalizeProjectAffiliations(record[key]);
    if (normalized.length > 0) return normalized;
  }
  return [];
}

function fillNamesFromProjectStore(
  list: UserProjectAffiliation[],
  projectsMap: ApiDataStore["projects"]
): UserProjectAffiliation[] {
  return list.map(p => ({
    uuid: p.uuid,
    name: p.name.trim() !== "" ? p.name : String(projectsMap[p.uuid]?.attributes?.name ?? p.uuid)
  }));
}

function affiliationsFromAttributesUsingProjectsStore(
  record: Record<string, unknown>,
  keys: readonly string[],
  projectsMap: ApiDataStore["projects"]
): UserProjectAffiliation[] {
  for (const key of keys) {
    const raw = record[key];
    if (raw == null) continue;

    if (Array.isArray(raw) && raw.length > 0 && raw.every((x): x is string => typeof x === "string")) {
      return raw.map(uuid => ({
        uuid,
        name: String(projectsMap[uuid]?.attributes?.name ?? uuid)
      }));
    }

    const normalized = normalizeProjectAffiliations(raw);
    if (normalized.length > 0) return fillNamesFromProjectStore(normalized, projectsMap);
  }
  return [];
}

function relationshipRefs(
  userResource: StoreResource<UserDto> | undefined,
  keys: readonly string[]
): { type: string; id: string }[] {
  if (userResource?.relationships == null) return [];
  const refs: { type: string; id: string }[] = [];
  for (const key of keys) {
    const rel = userResource.relationships[key];
    if (!Array.isArray(rel)) continue;
    for (const r of rel) {
      if (r?.type != null && r?.id != null) refs.push({ type: r.type, id: String(r.id) });
    }
  }
  return refs;
}

function resolveProjectRefs(
  refs: { type: string; id: string }[],
  projectsMap: ApiDataStore["projects"]
): UserProjectAffiliation[] {
  const out: UserProjectAffiliation[] = [];
  for (const ref of refs) {
    if (ref.type !== "projects") continue;
    const attrs = projectsMap[ref.id]?.attributes;
    const uuid = attrs?.uuid ?? ref.id;
    const name = attrs?.name ?? ref.id;
    out.push({ uuid, name: String(name) });
  }
  return out;
}

function monitoringAffiliationsWithApi(
  api: ApiDataStore,
  userId: string,
  attributes: UserDto
): UserProjectAffiliation[] {
  const record = attributes as Record<string, unknown>;
  const fromAttrs = affiliationsFromAttributesUsingProjectsStore(
    record,
    MONITORING_PROJECT_ATTRIBUTE_KEYS,
    api.projects
  );
  if (fromAttrs.length > 0) return fromAttrs;
  return resolveProjectRefs(relationshipRefs(api.users[userId], MONITORING_RELATIONSHIP_KEYS), api.projects);
}

function managedAffiliationsWithApi(api: ApiDataStore, userId: string, attributes: UserDto): UserProjectAffiliation[] {
  const record = attributes as Record<string, unknown>;
  const fromAttrs = affiliationsFromAttributesUsingProjectsStore(record, MANAGED_PROJECT_ATTRIBUTE_KEYS, api.projects);
  if (fromAttrs.length > 0) return fromAttrs;
  return resolveProjectRefs(relationshipRefs(api.users[userId], MANAGED_RELATIONSHIP_KEYS), api.projects);
}

export type UserShowProjectAffiliationKind = "monitoring" | "managed";

export function userShowProjectRows(
  record: Record<string, unknown> | undefined,
  kind: UserShowProjectAffiliationKind
): UserProjectAffiliation[] {
  const keys = kind === "monitoring" ? MONITORING_PROJECT_ATTRIBUTE_KEYS : MANAGED_PROJECT_ATTRIBUTE_KEYS;
  return projectAffiliationsFromRecord(record ?? {}, keys);
}

export function enrichUserDtoWithProjectAffiliations(userId: string, attributes: UserDto): UserDto {
  const api = ApiSlice.currentState;
  const monitoring = monitoringAffiliationsWithApi(api, userId, attributes);
  const managed = managedAffiliationsWithApi(api, userId, attributes);

  return {
    ...attributes,
    ...(monitoring.length > 0 ? { monitoringPartnerProjects: monitoring } : {}),
    ...(managed.length > 0 ? { managedProjects: managed } : {})
  };
}
