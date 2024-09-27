import { loginConnection } from "@/connections/Login";
import { organisationConnection } from "@/connections/Organisation";
import { myUserConnection } from "@/connections/User";
import { useGetAuthMe } from "@/generated/apiComponents";
import { MeResponse } from "@/generated/apiSchemas";
import { useConnection } from "@/hooks/useConnection";
import { useConnections } from "@/hooks/useConnections";
import Log from "@/utils/log";

/**
 * To easily access user data
 * @returns MeResponse
 *
 * TODO This hooks will be replaced in TM-1312, and the user data will be cached instead of re-fetched
 *   every 5 minutes for every component that uses this hook.
 */
export const useUserData = () => {
  const [loaded, [{ token }, myUserResult]] = useConnections([loginConnection, myUserConnection]);
  const organisationId = myUserResult?.userRelationships?.org?.[0]?.id;
  const [, organisationResult] = useConnection(organisationConnection, { organisationId });
  Log.debug("myUserConnection", loaded, myUserResult, organisationResult);
  const { data: authMe } = useGetAuthMe<{ data: MeResponse }>(
    {},
    {
      enabled: !!token,
      staleTime: 300_000 //Data considered fresh for 5 min to prevent excess api call
    }
  );

  return authMe?.data || null;
};
