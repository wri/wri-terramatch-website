import type { UserDto, UserProjectAffiliation } from "@/generated/v3/userService/userServiceSchemas";
import type { ApiDataStore, StoreResource } from "@/store/apiSlice";
import ApiSlice from "@/store/apiSlice";

const MONITORING_PARTNER_PROJECTS_REL = "monitoringPartnerProjects";

function projectRefsFromRelationship(
  userResource: StoreResource<UserDto> | undefined,
  relationshipKey: string
): { type: string; id: string }[] {
  const rows = userResource?.relationships?.[relationshipKey];
  if (!Array.isArray(rows)) return [];
  return rows
    .filter(
      (r): r is { type: string; id: string } =>
        r != null && typeof r === "object" && r.type != null && r.id != null && r.id !== ""
    )
    .map(r => ({ type: String(r.type), id: String(r.id) }));
}

function resolveProjectRefsToAffiliations(
  refs: { type: string; id: string }[],
  projectsMap: ApiDataStore["projects"]
): UserProjectAffiliation[] {
  const out: UserProjectAffiliation[] = [];
  for (const ref of refs) {
    if (ref.type !== "projects") continue;
    const attrs = projectsMap[ref.id]?.attributes;
    const uuid = typeof attrs?.uuid === "string" ? attrs.uuid : ref.id;
    const name = attrs?.name != null && String(attrs.name).trim() !== "" ? String(attrs.name) : ref.id;
    out.push({ uuid, name });
  }
  return out;
}

function monitoringPartnerAffiliationsFromStore(api: ApiDataStore, userId: string): UserProjectAffiliation[] {
  const refs = projectRefsFromRelationship(api.users[userId], MONITORING_PARTNER_PROJECTS_REL);
  return resolveProjectRefsToAffiliations(refs, api.projects);
}

export function userShowMonitoringProjectRows(record: Record<string, unknown> | undefined): UserProjectAffiliation[] {
  const raw = record?.monitoringPartnerProjects;
  return Array.isArray(raw) ? (raw as UserProjectAffiliation[]) : [];
}

export function enrichUserDtoWithProjectAffiliations(userId: string, attributes: UserDto): UserDto {
  const api = ApiSlice.currentState;
  const monitoringPartnerProjects = monitoringPartnerAffiliationsFromStore(api, userId);

  return {
    ...attributes,
    ...(monitoringPartnerProjects.length > 0 ? { monitoringPartnerProjects } : {})
  };
}
