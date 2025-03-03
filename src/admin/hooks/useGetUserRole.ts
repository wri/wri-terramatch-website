import { useMemo } from "react";
import { useGetIdentity } from "react-admin";

import { TMUserIdentity } from "@/admin/apiProvider/authProvider";

export const getRoleData = (primaryRole?: string) => ({
  role: primaryRole,
  isSuperAdmin: primaryRole === "admin-super",
  isPPCAdmin: primaryRole === "admin-ppc",
  isPPCTerrafundAdmin: primaryRole === "admin-terrafund",
  isFrameworkAdmin: primaryRole?.includes("admin-")
});

export const useGetUserRole = () => {
  const user = useGetIdentity().data as TMUserIdentity | undefined;
  return useMemo(() => getRoleData(user?.primaryRole), [user?.primaryRole]);
};
