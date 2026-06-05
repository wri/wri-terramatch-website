import { createContext, FC, PropsWithChildren, useContext, useMemo } from "react";

import { FormEntity } from "@/connections/Form";
import { v3EntityName } from "@/helpers/entity";
import { EntityName } from "@/types/common";

export type EntityScopeValue = {
  entityType: FormEntity;
  entityName: EntityName;
  entityUuid: string;
};

const EntityScopeContext = createContext<EntityScopeValue | null>(null);

type EntityScopeProviderProps = PropsWithChildren<{
  entityName: EntityName;
  entityUuid: string;
}>;

export const EntityScopeProvider: FC<EntityScopeProviderProps> = ({ entityName, entityUuid, children }) => {
  const value = useMemo<EntityScopeValue>(
    () => ({
      entityName,
      entityUuid,
      entityType: v3EntityName(entityName) as FormEntity
    }),
    [entityName, entityUuid]
  );

  return <EntityScopeContext.Provider value={value}>{children}</EntityScopeContext.Provider>;
};

export const useEntityScope = (): EntityScopeValue => {
  const context = useContext(EntityScopeContext);
  if (context == null) {
    throw new Error(
      "useEntityScope requires EntityScopeProvider (entity detail route, admin show/edit, or explicit wrapper)."
    );
  }
  return context;
};
