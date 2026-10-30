import { useT } from "@transifex/react";
import { FC } from "react";

import PolygonReviewLauncherCard from "./PolygonReviewLauncherCard";

/**
 * Temporary react-admin bridge: opens the standalone polygon review index page from the RA "Polygons" menu item.
 * Delete this file when the react-admin panel is removed.
 */
const PolygonReviewIndexLauncher: FC = () => {
  const t = useT();

  return (
    <div className="p-6">
      <PolygonReviewLauncherCard
        href="/polygon-review"
        title={t("Explore Polygon Review page")}
        description={t(
          "Review, validate, and edit polygons across all projects in one place. It opens in a new browser tab."
        )}
      />
    </div>
  );
};

export default PolygonReviewIndexLauncher;
