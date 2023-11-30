import { UserRead, V2MonitoringOrganisationRead } from "@/generated/apiSchemas";
import { useUserData } from "@/hooks/useUserData";

export const useMyOrg = () => {
  const userData = useUserData();

  if (userData) {
    return getMyOrg(userData);
  } else {
    return null;
  }
};

export const getMyOrg = (userData: UserRead): V2MonitoringOrganisationRead | undefined => {
  //@ts-ignore
  return userData?.organisation;
};
