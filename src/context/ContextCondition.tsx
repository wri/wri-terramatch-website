import { ReactNode } from "react";

import { withFrameworkShow } from "@/context/framework.provider";

/**
 * A simple component that displays children, but is wrapped in HOCs that add contextual conditional
 * control. Currently only uses `withFrameworkShow`, but if this pattern is repeated in the future,
 * further HOCs may be added.
 */
export const ContextCondition = withFrameworkShow(({ children }: { children: ReactNode }) => <>{children}</>);
