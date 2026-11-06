import { useT } from "@transifex/react";
import { FC } from "react";

import NoResults from "@/redesignComponents/content/NoResults/NoResults";

type PolygonNoResultsProps = {
  className?: string;
};

const PolygonNoResults: FC<PolygonNoResultsProps> = ({ className }) => {
  const t = useT();

  return (
    <NoResults
      className={className}
      title={t("No polygons found")}
      description={t(
        "We couldn’t find any polygons matching your search or filters. Try a different keyword, or adjust or clear your filters."
      )}
    />
  );
};

export default PolygonNoResults;
