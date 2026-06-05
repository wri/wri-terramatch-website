import { Flex, Toast, Toaster } from "@chakra-ui/react";
import type { FC } from "react";

import { polygonProgressToaster } from "./polygonOperationToasts";

/**
 * Renders the polygon progress toaster at the bottom of the screen.
 * Must be mounted once in the app tree (already added to _app.tsx).
 * The toaster is controlled via polygonProgressToaster from polygonOperationToasts.
 */
const PolygonProgressToaster: FC = () => (
  <Toaster toaster={polygonProgressToaster}>
    {toast => (
      <Toast.Root width={{ md: "sm" }}>
        <Flex flexDirection="row" gap="3" alignItems="center">
          {(toast.meta?.icon as React.ReactNode) ?? null}
          <Toast.Title>{toast.title}</Toast.Title>
        </Flex>
      </Toast.Root>
    )}
  </Toaster>
);

export default PolygonProgressToaster;
