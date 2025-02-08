import { useMemo } from "react";

import { useGetUserRole } from "./useGetUserRole";

export const useCanUserEdit = (record: any, resource: string) => {
  const { isFrameworkAdmin, isSuperAdmin, role } = useGetUserRole();

  return useMemo(() => {
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
    return !!record;
  }, [resource, record, isSuperAdmin, isFrameworkAdmin, role]);
};
