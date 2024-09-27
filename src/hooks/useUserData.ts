import { loginConnection } from "@/connections/Login";
import { myUserConnection } from "@/connections/User";
import { useGetAuthMe } from "@/generated/apiComponents";
import { MeResponse } from "@/generated/apiSchemas";
import { useConnections } from "@/hooks/useConnection";
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
  Log.debug("myUserConnection", loaded, myUserResult);
  const { data: authMe } = useGetAuthMe<{ data: MeResponse }>(
    {},
    {
      enabled: !!token,
      staleTime: 300_000 //Data considered fresh for 5 min to prevent excess api call
    }
  );

  return authMe?.data || null;
};
