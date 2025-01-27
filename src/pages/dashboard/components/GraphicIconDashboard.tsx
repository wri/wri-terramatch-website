import { useT } from "@transifex/react";
import classNames from "classnames";
import { MouseEvent, useState } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { getPercentage } from "@/utils/dashboardUtils";

import { DashboardTableDataProps } from "../index.page";

const GraphicIconDashboard = ({
  data,
  maxValue,
  title,
  className
}: {
  data: DashboardTableDataProps[];
  maxValue: number;
  title?: string;
  className?: string;
}) => {
  const t = useT();
  const [tooltip, setTooltip] = useState<{
    text: string | null;
    label: string | null;
    position: { top: number; left: number } | null;
  }>({
    text: null,
    label: null,
    position: null
  });

  const colorIconLabel = (label: string): { color: string; icon: keyof typeof IconNames } => {
    switch (label) {
      case "Agroforest":
        return { color: "bg-secondary-600", icon: "IC_AGROFOREST" };
      case "Natural Forest":
        return { color: "bg-green-60", icon: "IC_NATURAL_FOREST" };
      case "Mangrove":
        return { color: "bg-green-35", icon: "IC_MANGROVE" };
      case "Woodlot or Plantation":
        return { color: "bg-yellow-600", icon: "IC_WOODLOT" };
      case "Open Natural Ecosystem":
        return { color: "bg-green-40", icon: "IC_OPEN_NATURAL_ECOSYSTEM" };
      case "Riparian Area or Wetland":
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

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>, label: string, valueText: string) => {
    setTooltip({
      text: valueText,
      label,
      position: {
        top: event.clientY - 70,
        left: event.clientX
      }
    });
  };

  const handleMouseLeave = () => {
    setTooltip({
      text: null,
      label: null,
      position: null
    });
  };

  return (
    <div className={classNames("relative grid w-full gap-4", className)}>
      <When condition={title}>
        <Text variant="text-14" className="text-14 mb-1 uppercase text-darkCustom">
          {title}
        </Text>
      </When>
      <When condition={data.length > 0}>
        <div className="relative flex h-9 w-full rounded bg-blueCustom-30 first:rounded-l first-of-type:rounded-l lg:h-10">
          {data.map((item, index) => {
            const percentage = getPercentage(item.value, maxValue);
            return (
              <div
                className={classNames(
                  "relative h-9 w-0 hover:border hover:border-white lg:h-10",
                  colorIconLabel(item.label).color,
                  index === 0 && "rounded-l",
                  index === data.length - 1 && "rounded-r"
                )}
                style={{ width: `${percentage}%` }}
                key={index}
                onMouseMove={e => handleMouseMove(e, item.label, item.valueText)}
                onMouseLeave={handleMouseLeave}
              />
            );
          })}
        </div>
        {tooltip.text && tooltip.position && (
          <div
            className="shadow-md fixed z-10 w-auto rounded border border-darkCustom bg-white p-2"
            style={{
              left: `${tooltip.position.left}px`,
              top: `${tooltip.position.top}px`,
              transform: "translateX(-50%)"
            }}
          >
            <p className="text-12-bold text-darkCustom">{`${t(tooltip.label)} `}</p>
            <span className="text-12-light text-darkCustom">{t(tooltip.text)}</span>
          </div>
        )}
        <div className="w-full">
          {data.map((item, index) => {
            const percentage = getPercentage(item.value, maxValue);
            return (
              <div key={index} className={`${index + 1 !== data.length ? "border-b" : ""} w-full border-grey-350 py-2`}>
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
                <div
                  className="relative h-4 rounded bg-blueCustom-30 lg:h-5"
                  onMouseMove={e => handleMouseMove(e, item.label, item.valueText)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div
                    className={classNames(
                      "relative h-4 w-0 rounded hover:border hover:border-white lg:h-5",
                      colorIconLabel(item.label).color
                    )}
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
