import { useT } from "@transifex/react";
import { FC } from "react";
import { useShowContext } from "react-admin";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { getSitePolygonReviewPath } from "@/utils/sitePolygonReviewPath";

/**
 * Temporary react-admin bridge: opens the standalone polygon review page from the RA site show tab.
 * Delete this file when react-admin site show is removed.
 */
const PolygonReviewLauncher: FC = () => {
  const t = useT();
  const { isLoading, record } = useShowContext();

  if (isLoading || record?.uuid == null) return null;

  return (
    <div className="flex w-full flex-col items-center gap-4 rounded-xl border-2 border-grey-350 bg-white p-10 shadow-monitored">
      <Text variant="text-16-bold" className="text-darkCustom">
        {t("Polygon Review has moved")}
      </Text>
      <Text variant="text-14-light" className="max-w-xl text-center text-darkCustom">
        {t("Review, validate, and edit site polygons in the new dedicated page. It opens in a new browser tab.")}
      </Text>
      <Button
        iconProps={{ name: IconNames.LINK, className: "h-4 w-4" }}
        onClick={() => {
          window.open(getSitePolygonReviewPath(record.uuid), "_blank", "noopener,noreferrer");
        }}
      >
        <Text variant="text-14-bold" className="text-white">
          {t("Open Polygon Review")}
        </Text>
      </Button>
    </div>
  );
};

export default PolygonReviewLauncher;
