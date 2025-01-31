import { useMemo } from "react";

import { useGetUserRole } from "./useGetUserRole";

export const useCanUserEdit = (record: any, resource: string) => {
  const { isFrameworkAdmin, isSuperAdmin, role } = useGetUserRole();

  const canEdit = useMemo(() => {
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
        if (record?.role === role) {
          return true;
        }
        return false;
      }
    }
    return !!record;
  }, [record, resource, isFrameworkAdmin, isSuperAdmin]);
  return canEdit;
};
