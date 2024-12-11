import { createContext, ReactNode, useContext } from "react";

import { EntityName } from "@/types/common";

interface IEntityContext {
  entityUuid?: string;
  entityName?: EntityName;
}

const EntityContext = createContext<IEntityContext>({});

type EntityFrameworkProviderProps = { entityUuid: string; entityName: EntityName; children: ReactNode };

const EntityProvider = ({ children, entityUuid, entityName }: EntityFrameworkProviderProps) => (
  <EntityContext.Provider value={{ entityUuid, entityName }}>{children}</EntityContext.Provider>
);

export const useEntityContext = () => useContext(EntityContext);

export default EntityProvider;
