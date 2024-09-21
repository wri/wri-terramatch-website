import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

import { logout } from "@/connections/Login";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return () => {
    queryClient.getQueryCache().clear();
    queryClient.clear();
    logout();
    router.push("/");
    window.location.replace("/");
  };
};
