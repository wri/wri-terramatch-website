import { useT } from "@transifex/react";
import { FC } from "react";
import { useShowContext } from "react-admin";

import { getPolygonReviewUrl } from "@/pages/polygon-review/utils/polygonReviewUrl";

import PolygonReviewLauncherCard from "./PolygonReviewLauncherCard";

/**
 * Temporary react-admin bridge: opens the polygon review index from the RA site show tab, scoped to this site.
 * Delete this file when react-admin site show is removed.
 */
const PolygonReviewLauncher: FC = () => {
  const t = useT();
  const { isLoading, record } = useShowContext();

  if (isLoading || record?.uuid == null) return null;

  return (
    <PolygonReviewLauncherCard
      href={getPolygonReviewUrl({ siteUuid: record.uuid })}
      title={t("Polygon Review has moved")}
      description={t(
        "Review, validate, and edit site polygons in the new dedicated page. It opens in a new browser tab."
      )}
    />
  );
};

export default PolygonReviewLauncher;
