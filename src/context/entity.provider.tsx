import { createContext, ReactNode, useContext } from "react";

import { EntityName } from "@/types/common";

interface IEntityContext {
  entityUuid?: string;
  entityName?: EntityName;
  projectUuid?: string;
}

const EntityContext = createContext<IEntityContext>({});

type EntityFrameworkProviderProps = {
  entityUuid: string;
  entityName: EntityName;
  children: ReactNode;
  projectUuid?: string;
};

const EntityProvider = ({ children, entityUuid, entityName, projectUuid }: EntityFrameworkProviderProps) => (
  <EntityContext.Provider value={{ entityUuid, entityName, projectUuid }}>{children}</EntityContext.Provider>
);

export const useEntityContext = () => useContext(EntityContext);

export default EntityProvider;
