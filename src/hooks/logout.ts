import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

import { removeAccessToken } from "@/admin/apiProvider/utils/token";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return () => {
    queryClient.getQueryCache().clear();
    queryClient.clear();
    removeAccessToken();
    router.push("/");
    window.location.replace("/");
  };
};
