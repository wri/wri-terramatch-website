import { IdProp, v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader, creationHook } from "@/connections/util/connectionShortcuts";
import { deleterAsync } from "@/connections/util/resourceDeleter";
import { resourceUpdater } from "@/connections/util/resourceMutator";
import {
  createAuditStatus,
  CreateAuditStatusPathParams,
  deleteAuditStatus,
  getAuditStatuses,
  GetAuditStatusesPathParams,
  GetAuditStatusesVariables,
  updateAuditStatus,
  UpdateAuditStatusPathParams,
  UpdateAuditStatusVariables
} from "@/generated/v3/entityService/entityServiceComponents";
import { AuditStatusDto, UpdateAuditStatusAttributes } from "@/generated/v3/entityService/entityServiceSchemas";
import ApiSlice from "@/store/apiSlice";

export type AuditStatusEntityType = GetAuditStatusesPathParams["entity"];

export type AuditStatusIndexProps = GetAuditStatusesPathParams & GetAuditStatusesVariables["queryParams"];

const auditStatusIndexConnection = v3Resource("auditStatuses", getAuditStatuses)
  .index<AuditStatusDto, AuditStatusIndexProps>(({ entity, uuid, types }) => ({
    pathParams: { entity, uuid },
    ...(types != null && types.length > 0 ? { queryParams: { types: [...types] } } : {})
  }))
  .enabledProp()
  .refetch(() => ApiSlice.pruneIndex("auditStatuses", ""))
  .buildConnection();

export const useAuditStatuses = connectionHook(auditStatusIndexConnection);
export const loadAuditStatuses = connectionLoader(auditStatusIndexConnection);

const auditStatusCreateConnection = v3Resource("auditStatuses", createAuditStatus)
  .create<AuditStatusDto, CreateAuditStatusPathParams>(({ entity, uuid }) => ({
    pathParams: { entity, uuid }
  }))
  .buildConnection();

export const useCreateAuditStatus = creationHook(auditStatusCreateConnection);

export type AuditStatusUpdateProps = Pick<UpdateAuditStatusPathParams, "entity" | "uuid">;

type UpdateAuditStatusConnectionVariables = UpdateAuditStatusVariables & {
  body: { data: { type: "auditStatuses"; id: string; attributes: UpdateAuditStatusAttributes } };
};

const auditStatusUpdateConnection = v3Resource("auditStatuses", updateAuditStatus)
  .singleResource<AuditStatusDto>(({ id, ...rest }: IdProp) => {
    const { entity, uuid } = rest as AuditStatusUpdateProps;
    return id == null || entity == null || uuid == null
      ? undefined
      : ({ pathParams: { entity, uuid, auditUuid: id } } as UpdateAuditStatusVariables);
  })
  .addProps<AuditStatusUpdateProps>()
  .update<UpdateAuditStatusAttributes, UpdateAuditStatusConnectionVariables>(updateAuditStatus)
  .buildConnection();

const updateAuditStatusUpdater = resourceUpdater(auditStatusUpdateConnection);

export const useUpdateAuditStatus = connectionHook(auditStatusUpdateConnection);

export const updateAuditStatusAsync = async (
  auditUuid: string,
  entity: AuditStatusEntityType,
  uuid: string,
  attributes: UpdateAuditStatusAttributes
): Promise<AuditStatusDto> => {
  const result = await updateAuditStatusUpdater(attributes, { id: auditUuid, entity, uuid });
  ApiSlice.pruneIndex("auditStatuses", "");
  return result;
};

export const createAuditStatusDeleter = (entity: AuditStatusEntityType, uuid: string) => {
  const baseDeleter = deleterAsync("auditStatuses", deleteAuditStatus, (auditUuid: string) => ({
    pathParams: { entity, uuid, auditUuid }
  }));

  return async function deleteAuditStatusResource(auditUuid: string): Promise<void> {
    await baseDeleter(auditUuid);
    ApiSlice.pruneIndex("auditStatuses", "");
  };
};

export const deleteAuditStatusAsync = async (
  auditUuid: string,
  entity: AuditStatusEntityType,
  uuid: string
): Promise<void> => {
  const deleter = createAuditStatusDeleter(entity, uuid);
  await deleter(auditUuid);
};

type AuditStatusUser = { firstName?: string | null; lastName?: string | null };

const isCommentByUser = (comment: AuditStatusDto, user?: AuditStatusUser): boolean => {
  if (user == null) {
    return false;
  }

  return comment.firstName === user.firstName && comment.lastName === user.lastName;
};

export const getUnreadCommentCount = (auditStatuses?: AuditStatusDto[], currentUser?: AuditStatusUser): number =>
  auditStatuses?.filter(a => a.type === "comment" && a.isRead === false && !isCommentByUser(a, currentUser)).length ??
  0;

export const formatAuditStatusEntityForDisplay = (entityType: AuditStatusEntityType): string => {
  if (entityType === "sitePolygons") {
    return "Polygon";
  }

  const words = entityType
    .replace(/([A-Z])/g, " $1")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .filter(word => word.length > 0);

  return words.join(" ");
};

export const v3EntityToAuditLogEntity = (entityType: AuditStatusEntityType): string => {
  const mapping: Record<AuditStatusEntityType, string> = {
    projects: "Project",
    sites: "Site",
    sitePolygons: "Polygon",
    nurseries: "Nursery",
    projectReports: "Project_Report",
    siteReports: "Site_Report",
    nurseryReports: "Nursery_Report",
    disturbanceReports: "Disturbance_Report",
    srpReports: "Srp_Report",
    financialReports: "Financial_Report"
  };

  return mapping[entityType] ?? "Project";
};
