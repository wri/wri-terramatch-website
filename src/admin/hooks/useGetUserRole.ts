import { useGetIdentity } from "react-admin";

export const useGetUserRole = () => {
  const { data } = useGetIdentity();
  const user: any = data || {};

  return {
    role: user.primaryRole,
    isSuperAdmin: user.primaryRole === "admin-super",
    isPPCAdmin: user.primaryRole === "admin-ppc",
    isPPCTerrafundAdmin: user.primaryRole === "admin-terrafund",
    isFrameworkAdmin: user.primaryRole && user.primaryRole.includes("admin-")
  };
};
