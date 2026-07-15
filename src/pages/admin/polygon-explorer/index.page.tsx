import { useRouter } from "next/router";
import { useEffect } from "react";

import { useMyUser } from "@/connections/User";
import { MapAreaProvider } from "@/context/mapArea.provider";

import PolygonExplorerPage from "./PolygonExplorerPage";

/**
 * TEMPORARY internal tool (see README.md in this folder). Admin-only, read-only viewer
 * for all site polygons. Delete this folder to remove the feature entirely.
 */
const PolygonExplorerRoute = () => {
  const router = useRouter();
  const [isUserLoaded, { isAdmin }] = useMyUser();

  const isAccessDenied = isUserLoaded && !isAdmin;
  useEffect(() => {
    if (isAccessDenied) {
      void router.replace("/admin");
    }
  }, [isAccessDenied, router]);

  if (!isUserLoaded || isAccessDenied) return null;

  return (
    <MapAreaProvider>
      <PolygonExplorerPage />
    </MapAreaProvider>
  );
};

export default PolygonExplorerRoute;
