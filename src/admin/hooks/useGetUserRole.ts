import { useMemo } from "react";
import { useGetIdentity } from "react-admin";

import { TMUserIdentity } from "@/admin/apiProvider/authProvider";

export const getRoleData = (roles: string[] = []) => ({
  roles,
  isSuperAdmin: roles.includes("admin-super"),
  isFrameworkAdmin: roles.some(role => role.startsWith("admin-"))
});

export const useGetUserRole = () => {
  const user = useGetIdentity().data as TMUserIdentity | undefined;
  return useMemo(() => getRoleData(user?.roles), [user?.roles]);
};
