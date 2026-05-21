import { useT } from "@transifex/react";
import React from "react";

import Text from "@/components/elements/Text/Text";
import Tooltip from "@/components/elements/Tooltip/Tooltip";
import Icon from "@/components/extensive/Icon/Icon";
import { IconNames } from "@/components/extensive/Icon/Icon";

export const NoDataState = () => {
  const t = useT();
  return (
    <div className="z-10 flex h-[75%] w-full flex-col items-center justify-center gap-2 rounded-xl border border-grey-1000">
      <Text variant="text-32-semibold" className="text-blueCustom">
        {t("No Data to Display")}
      </Text>
      <div className="flex items-center gap-1">
        <Text variant="text-14" className="text-darkCustom">
          {t("RUN ANALYSIS ON PROJECT POLYGONS TO SEE DATA")}
        </Text>
        <Tooltip content={t("Tooltip")}>
          <Icon name={IconNames.IC_INFO} className="h-4 w-4" />
        </Tooltip>
      </div>
    </div>
  );
};
