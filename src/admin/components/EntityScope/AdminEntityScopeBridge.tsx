import { FC, PropsWithChildren, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { EntityScopeProvider } from "@/context/entityScope.provider";
import { resolveEntityScopeFromAdminLocation } from "@/context/entityScope.resolve";

const AdminEntityScopeBridge: FC<PropsWithChildren> = ({ children }) => {
  const { pathname, hash } = useLocation();

  const scope = useMemo(
    () => resolveEntityScopeFromAdminLocation(pathname) ?? resolveEntityScopeFromAdminLocation(hash),
    [hash, pathname]
  );

  if (scope == null) {
    return <>{children}</>;
  }

  return (
    <EntityScopeProvider entityName={scope.entityName} entityUuid={scope.entityUuid}>
      {children}
    </EntityScopeProvider>
  );
};

export default AdminEntityScopeBridge;
