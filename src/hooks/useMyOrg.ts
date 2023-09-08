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
  const monitoringOrganisations =
    userData?.my_monitoring_organisations?.filter(org => org.users_status !== "rejected") || [];

  if (userData?.my_organisation) {
    return userData?.my_organisation;
  } else if (monitoringOrganisations.length > 0) {
    return monitoringOrganisations[0];
  }
};
