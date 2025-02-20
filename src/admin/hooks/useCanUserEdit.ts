import { useMemo } from "react";

import { getRoleData, useGetUserRole } from "./useGetUserRole";

export const userCanEdit = (
  record: any,
  resource: string,
  { role, isSuperAdmin, isFrameworkAdmin }: ReturnType<typeof getRoleData>
) => {
  if (resource === "user") {
    if (isSuperAdmin) {
      return true;
    }
    if (record?.role === "admin-super") {
      return false;
    }
    if (record?.role === "project-developer" || record?.role === "project-manager") {
      return true;
    }
    if (isFrameworkAdmin) {
      return record?.role === role;
    }
  }
  return record != null;
};

export const useCanUserEdit = (record: any, resource: string) => {
  const roleData = useGetUserRole();
  return useMemo(() => userCanEdit(record, resource, roleData), [record, resource, roleData]);
};
