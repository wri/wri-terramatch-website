import { useMyUser } from "@/connections/User";

export const useIsAdmin = () => {
  const [, { isAdmin }] = useMyUser();
  return isAdmin;
};
