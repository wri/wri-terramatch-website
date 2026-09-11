import { useT } from "@transifex/react";
import { FC } from "react";
import { useShowContext } from "react-admin";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";

interface PolygonReviewLauncherProps {
  // Which entity's show view this launcher lives on. Defaults to "site" so existing usage is unchanged.
  entity?: "site" | "project";
}

/**
 * react-admin bridge: opens the standalone polygon review page from a RA show tab. Used on both the
 * site show (site polygons) and the project show (all polygons across the project's sites).
 */
const PolygonReviewLauncher: FC<PolygonReviewLauncherProps> = ({ entity = "site" }) => {
  const t = useT();
  const { isLoading, record } = useShowContext();

  if (isLoading || record?.uuid == null) return null;

  const description =
    entity === "project"
      ? t("Review, validate, and approve polygons across every site in this project. It opens in a new browser tab.")
      : t("Review, validate, and edit site polygons in the new dedicated page. It opens in a new browser tab.");

  return (
    <div className="flex w-full flex-col items-center gap-4 rounded-xl border-2 border-grey-350 bg-white p-10 shadow-monitored">
      <Text variant="text-16-bold" className="text-darkCustom">
        {entity === "project" ? t("Project Polygon Review") : t("Polygon Review has moved")}
      </Text>
      <Text variant="text-14-light" className="max-w-xl text-center text-darkCustom">
        {description}
      </Text>
      <Button
        iconProps={{ name: IconNames.LINK_PA, className: "h-4 w-4 !text-white" }}
        onClick={() => {
          window.open(`/${entity}/${record.uuid}/polygon-review`, "_blank", "noopener,noreferrer");
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
