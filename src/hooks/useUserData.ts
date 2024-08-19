import { useAuthContext } from "@/context/auth.provider";
import { useGetAuthMe } from "@/generated/apiComponents";
import { MeResponse } from "@/generated/apiSchemas";

/**
 * To easily access user data
 * @returns MeResponse
 */
export const useUserData = () => {
  const { token } = useAuthContext();
  const { data: authMe } = useGetAuthMe<{ data: MeResponse }>(
    {},
    {
      enabled: !!token,
      staleTime: 300_000 //Data considered fresh for 5 min to prevent excess api call
    }
  );

  return authMe?.data || null;
};
