import { useT } from "@transifex/react";
import { FC } from "react";
import { useShowContext } from "react-admin";

import PolygonReviewLauncherCard from "./PolygonReviewLauncherCard";

/**
 * Temporary react-admin bridge: opens the standalone polygon review page from the RA site show tab.
 * Delete this file when react-admin site show is removed.
 */
const PolygonReviewLauncher: FC = () => {
  const t = useT();
  const { isLoading, record } = useShowContext();

  if (isLoading || record?.uuid == null) return null;

  return (
    <PolygonReviewLauncherCard
      href={`/site/${record.uuid}/polygon-review`}
      title={t("Polygon Review has moved")}
      description={t(
        "Review, validate, and edit site polygons in the new dedicated page. It opens in a new browser tab."
      )}
    />
  );
};

export default PolygonReviewLauncher;
