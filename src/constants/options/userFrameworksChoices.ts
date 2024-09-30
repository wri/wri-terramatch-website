import { useMemo } from "react";

import { useMyUser } from "@/connections/User";
import { OptionInputType } from "@/types/common";

export const useUserFrameworkChoices = (): OptionInputType[] => {
  const [, { user }] = useMyUser();

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
