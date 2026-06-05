import { useRouter } from "next/router";
import { FC, PropsWithChildren, useMemo } from "react";

import { EntityScopeProvider } from "@/context/entityScope.provider";
import { resolveEntityScopeFromNextRouter } from "@/context/entityScope.resolve";
import { useIsAdmin } from "@/hooks/useIsAdmin";

const EntityScopeFromRouter: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const isAdminUser = useIsAdmin();

  const scope = useMemo(
    () => (isAdminUser ? null : resolveEntityScopeFromNextRouter(router.pathname, router.query)),
    [isAdminUser, router.pathname, router.query]
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

export default EntityScopeFromRouter;
