import { useT } from "@transifex/react";
import { Else, If, Then } from "react-if";

import { ICriteriaCheckItem } from "@/admin/components/ResourceTabs/PolygonReviewTab/components/PolygonDrawer/PolygonDrawer";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import Text from "../../Text/Text";

const PolygonCheck = ({ polygonValidationData }: { polygonValidationData: ICriteriaCheckItem[] }) => {
  const t = useT();

  return (
    <div className="relative flex w-[231px] flex-col gap-2 rounded-xl p-3">
      <div className="absolute top-0 left-0 -z-10 h-full w-full rounded-xl bg-[#FFFFFF33] backdrop-blur-md" />
      <Text variant="text-10-bold" className="text-white">
        {t("Polygon Checks")}
      </Text>
      <If condition={polygonValidationData.length > 0}>
        <Then>
          {polygonValidationData.map(polygon => (
            <div key={polygon.id} className="flex items-center gap-2">
              <Icon
                name={polygon.status ? IconNames.ROUND_GREEN_TICK : IconNames.ROUND_RED_CROSS}
                className="h-4 w-4"
              />
              <Text variant="text-10-light" className="text-white">
                {t(polygon.label)}
              </Text>
            </div>
          ))}
        </Then>
        <Else>
          <Text variant="text-10-light" className="text-white">
            {t("No criteria checked yet")}
          </Text>
        </Else>
      </If>
    </div>
  );
};

export default PolygonCheck;
