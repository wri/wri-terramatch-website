import { useT } from "@transifex/react";
import classNames from "classnames";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { getPercentage } from "@/utils/dashboardUtils";

import { DashboardTableDataProps } from "../index.page";

const GraphicIconDashboard = ({ data, maxValue }: { data: DashboardTableDataProps[]; maxValue: number }) => {
  const t = useT();

  const colorIconLabel = (label: string): { color: string; icon: keyof typeof IconNames } => {
    switch (label) {
      case "Agroforest":
        return { color: "bg-secondary-600", icon: "IC_AGROFOREST" };
      case "Natural Forest":
        return { color: "bg-green-60", icon: "IC_NATURAL_FOREST" };
      case "Mangrove":
        return { color: "bg-green-35", icon: "IC_MANGROVE" };
      case "Woodlot / Plantation":
        return { color: "bg-yellow-600", icon: "IC_WOODLOT" };
      case "Open Natural Ecosystem":
        return { color: "bg-green-40", icon: "IC_OPEN_NATURAL_ECOSYSTEM" };
      case "Riparian Area / Wetland":
        return { color: "bg-primary-350", icon: "IC_RIPARIAN_AREA" };
      case "Urban Forest":
        return { color: "bg-blueCustom", icon: "IC_URBAN_FOREST" };
      case "Silvopasture":
        return { color: "bg-yellow-550", icon: "IC_SILVOPASTURE" };
      case "Peatland":
        return { color: "bg-primary", icon: "IC_PEATLAND" };
      default:
        return { color: "bg-tertiary-800", icon: "IC_AGROFOREST" };
    }
  };

  return (
    <div className="grid w-full gap-4">
      <When condition={data.length > 0}>
        <div className="relative flex h-9 w-full rounded bg-blueCustom-30 first:rounded-l first-of-type:rounded-l lg:h-10">
          {data.map((item, index) => {
            const percentage = getPercentage(item.value, maxValue);
            return (
              <div
                className={classNames(
                  "relative h-9 w-0 lg:h-10",
                  colorIconLabel(item.label).color,
                  index === 0 && "rounded-l",
                  index === data.length - 1 && "rounded-r"
                )}
                style={{ width: `${percentage}%` }}
                key={index}
              />
            );
          })}
        </div>
        <div className="w-full">
          {data.map((item, index) => {
            const percentage = getPercentage(item.value, maxValue);
            return (
              <div key={index} className={`${index + 1 !== data.length && "border-b"} w-full border-grey-350 py-2`}>
                <div className="mb-1 flex w-full justify-between">
                  <div className="flex gap-1">
                    <Icon name={IconNames[colorIconLabel(item.label).icon]} />
                    <Text variant="text-14-light" className="text-darkCustom">
                      {t(item.label)}
                    </Text>
                  </div>
                  <Text variant="text-14" className="text-darkCustom">
                    {t(item.valueText)}
                  </Text>
                </div>
                <div className="relative h-4 rounded bg-blueCustom-30 lg:h-5">
                  <div
                    className={classNames("relative h-4 w-0 rounded lg:h-5", colorIconLabel(item.label).color)}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </When>
    </div>
  );
};

export default GraphicIconDashboard;
