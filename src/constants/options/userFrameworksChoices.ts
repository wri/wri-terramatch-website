import { useMemo } from "react";

import { myUserConnection } from "@/connections/User";
import { useConnection } from "@/hooks/useConnection";
import { OptionInputType } from "@/types/common";

export const useUserFrameworkChoices = (): OptionInputType[] => {
  const [, { user }] = useConnection(myUserConnection);

  return useMemo(() => {
    return (
      user?.frameworks?.map(
        f =>
          ({
            name: f.name,
            id: f.slug
          } as OptionInputType)
      ) ?? []
    );
  }, [user]);
};
