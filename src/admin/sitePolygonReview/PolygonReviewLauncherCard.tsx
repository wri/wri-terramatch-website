import { useT } from "@transifex/react";
import { FC } from "react";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";

type PolygonReviewLauncherCardProps = {
  href: string;
  title: string;
  description: string;
};

/**
 * Temporary react-admin bridge: opens a standalone polygon review page in a new browser tab.
 * Delete this file when the react-admin polygon review entry points are removed.
 */
const PolygonReviewLauncherCard: FC<PolygonReviewLauncherCardProps> = ({ href, title, description }) => {
  const t = useT();

  return (
    <div className="flex w-full flex-col items-center gap-4 rounded-xl border-2 border-grey-350 bg-white p-10 shadow-monitored">
      <Text variant="text-16-bold" className="text-darkCustom">
        {title}
      </Text>
      <Text variant="text-14-light" className="max-w-xl text-center text-darkCustom">
        {description}
      </Text>
      <Button
        iconProps={{ name: IconNames.LINK_PA, className: "h-4 w-4 !text-white" }}
        onClick={() => {
          window.open(href, "_blank", "noopener,noreferrer");
        }}
      >
        <Text variant="text-14-bold" className="text-white">
          {t("Open Polygon Review")}
        </Text>
      </Button>
    </div>
  );
};

export default PolygonReviewLauncherCard;
