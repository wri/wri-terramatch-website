import { useMemo } from "react";

import { useUserData } from "@/hooks/useUserData";
import { OptionInputType } from "@/types/common";

export const useUserFrameworkChoices = (): OptionInputType[] => {
  const userData = useUserData();

  const frameworkChoices = useMemo(() => {
    return (
      userData?.frameworks?.map(
        f =>
          ({
            name: f.name,
            id: f.slug
          } as OptionInputType)
      ) ?? []
    );
  }, [userData]);

  return frameworkChoices;
};
