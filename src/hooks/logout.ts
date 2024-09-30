import { useQueryClient } from "@tanstack/react-query";

import { logout } from "@/connections/Login";

export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.getQueryCache().clear();
    queryClient.clear();
    logout();
  };
};
