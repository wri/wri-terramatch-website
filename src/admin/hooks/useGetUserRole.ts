import { useGetIdentity } from "react-admin";

export const useGetUserRole = () => {
  const { data } = useGetIdentity();
  const user: any = data || {};

  return {
    role: user.role,
    isSuperAdmin: user.role === "admin" || user.role === "admin-super",
    isPPCAdmin: user.role === "admin-ppc",
    isPPCTerrafundAdmin: user.role === "admin-terrafund"
  };
};
