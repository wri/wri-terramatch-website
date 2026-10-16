import { useMemo } from "react";

import { getRoleData, useGetUserRole } from "./useGetUserRole";

export const userCanEdit = (
  record: any,
  resource: string,
  { roles, isSuperAdmin, isFrameworkAdmin }: ReturnType<typeof getRoleData>
) => {
  if (resource === "user") {
    if (isSuperAdmin) {
      return true;
    }
    const recordRoles: string[] = record?.roles ?? [];
    if (recordRoles.includes("admin-super")) {
      return false;
    }
    if (recordRoles.includes("project-developer") || recordRoles.includes("project-manager")) {
      return true;
    }
    if (isFrameworkAdmin) {
      // A framework admin may only edit users whose roles they also hold.
      return recordRoles.every(role => roles.includes(role));
    }
  }
  return record != null;
};

export const useCanUserEdit = (record: any, resource: string) => {
  const roleData = useGetUserRole();
  return useMemo(() => userCanEdit(record, resource, roleData), [record, resource, roleData]);
};
