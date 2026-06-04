import { kebabCase } from "lodash";
import type { ParsedUrlQuery } from "querystring";

import { pluralEntityName } from "@/helpers/entity";
import { EntityName, SingularEntityName } from "@/types/common";

export type ResolvedEntityScope = {
  entityName: EntityName;
  entityUuid: string;
};

const toScope = (segment: string, entityUuid: string): ResolvedEntityScope => ({
  entityName: pluralEntityName(kebabCase(segment) as SingularEntityName),
  entityUuid
});

export const resolveEntityScopeFromNextRouter = (
  pathname: string,
  query: ParsedUrlQuery
): ResolvedEntityScope | null => {
  const entityUuid = query.uuid as string | undefined;
  if (entityUuid == null) {
    return null;
  }

  if (pathname === "/entity/[entityName]/edit/[uuid]") {
    return toScope(query.entityName as string, entityUuid);
  }

  const reportRoute = pathname.match(/^\/reports\/([^/]+)\/\[uuid\]$/);
  if (reportRoute != null) {
    return toScope(reportRoute[1]!, entityUuid);
  }

  const resourceRoute = pathname.match(/^\/([^/]+)\/\[uuid\]$/);
  if (resourceRoute != null) {
    return toScope(resourceRoute[1]!, entityUuid);
  }

  return null;
};

export const resolveEntityScopeFromAdminLocation = (location: string): ResolvedEntityScope | null => {
  const path = location.replace(/^#/, "").split("?")[0] ?? "";
  const match = path.match(/\/([^/]+)\/([^/]+)/);

  return match == null ? null : toScope(match[1]!, match[2]!);
};
