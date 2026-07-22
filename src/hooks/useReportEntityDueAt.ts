import { ReportFullDto, SupportedEntity, useFullEntity } from "@/connections/Entity";
import { isEntityReport, v3EntityName } from "@/helpers/entity";
import { EntityName } from "@/types/common";

export const useReportEntityDueAt = (entityName: EntityName, entityUUID?: string) => {
  const [, { data: entity }] = useFullEntity(v3EntityName(entityName) as SupportedEntity, entityUUID as string);

  if (entityUUID == null || !isEntityReport(entityName)) return undefined;

  return (entity as ReportFullDto)?.dueAt ?? undefined;
};
