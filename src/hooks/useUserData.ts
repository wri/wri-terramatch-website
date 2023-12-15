import { useAuthContext } from "@/context/auth.provider";
import { useGetAuthMe } from "@/generated/apiComponents";
import { UserRead } from "@/generated/apiSchemas";

/**
 * To easily access user data
 * @returns UserRead
 */
export const useUserData = () => {
  const { token } = useAuthContext();
  const { data: authMe } = useGetAuthMe<{ data: UserRead }>(
    {},
    {
      enabled: !!token,
      staleTime: 300_000 //Data considered fresh for 5 min to prevent excess api call
    }
  );

  return authMe?.data || null;
};
