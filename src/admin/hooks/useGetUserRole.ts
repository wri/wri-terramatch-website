import { useMemo } from "react";
import { useGetIdentity } from "react-admin";

export const getRoleData = (primaryRole: string) => ({
  role: primaryRole,
  isSuperAdmin: primaryRole === "admin-super",
  isPPCAdmin: primaryRole === "admin-ppc",
  isPPCTerrafundAdmin: primaryRole === "admin-terrafund",
  isFrameworkAdmin: primaryRole?.includes("admin-")
});

export const useGetUserRole = () => {
  const { data } = useGetIdentity();
  const user: any = data ?? {};
  return useMemo(() => getRoleData(user.primaryRole), [user.primaryRole]);
};
