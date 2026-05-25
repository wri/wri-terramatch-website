import { useT } from "@transifex/react";
import classNames from "classnames";
import { useState } from "react";

import {
  POLYGON_APPROVED,
  POLYGON_DRAFT,
  POLYGON_INFORMATION_REQUIRED,
  POLYGON_PENDING_APPROVAL
} from "@/constants/polygonStatuses";

import Text from "../../Text/Text";
import TooltipLineProgressBarMonitored from "../../Tooltip/TooltipLineProgressBarMonitored";

const STATUS_COLOR_BY_KEY: Record<string, string> = {
  [POLYGON_DRAFT]: "bg-neutral-500 hover:shadow-[#E3E3E3]",
  [POLYGON_PENDING_APPROVAL]: "bg-primary hover:shadow-[#2398D833]",
  [POLYGON_INFORMATION_REQUIRED]: "bg-tertiary-600 hover:shadow-[#ffe7d7]",
  [POLYGON_APPROVED]: "bg-success-600 hover:shadow-[#d4f3eb]"
};

const DEFAULT_COLOR = "bg-neutral-500 hover:shadow-[#E3E3E3]";

export interface dataProps {
  count: number;
  status: string;
  status_key: string;
}

export interface LinearProgressBarMonitoredProps {
  data: dataProps[];
}

const LinearProgressBarMonitored = ({ data }: LinearProgressBarMonitoredProps) => {
  const [statusHover, setStatusHover] = useState<string>("");
  const [colorHover, setColorHover] = useState<string>(DEFAULT_COLOR);
  const [tooltipValue, setTooltipValue] = useState<string>("");
  const [isHover, setIsHover] = useState<boolean>(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const t = useT();
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

  const openTooltip = (e: React.MouseEvent<HTMLDivElement>, item: dataProps, colorClass: string) => {
    const percentage = totalCount > 0 ? ((item.count / totalCount) * 100).toFixed(0) : "0";
    const value = `${percentage}% (${item.count} Polygons)`;
    setTooltipValue(value);
    setStatusHover(item.status);
    setColorHover(colorClass);
    setIsHover(true);
    setPosition({ top: e.pageY - 70, left: e.pageX });
  };

  const exitTooltip = () => {
    setIsHover(false);
  };

  return (
    <div className="flex w-full gap-1 lg:gap-[6px]">
      <div
        style={
          isHover
            ? { position: "fixed", top: `${position.top}px`, left: `${position.left}px`, transform: "translateX(-50%)" }
            : { display: "none" }
        }
      >
        <TooltipLineProgressBarMonitored value={tooltipValue} label={statusHover} colorClass={colorHover} />
      </div>
      {data.map((item, index) => {
        const percentage = totalCount > 0 ? (item.count / totalCount) * 100 : 0;
        const colorClass = STATUS_COLOR_BY_KEY[item.status_key] ?? DEFAULT_COLOR;
        const status = item.status === "Information Required" ? "Info Required" : item.status;
        return (
          <div key={index} style={{ width: `${percentage}%` }}>
            <div
              className={classNames(
                "h-[6px] w-full cursor-pointer rounded-sm hover:shadow-item-monitored lg:h-[8px] wide:h-[10px]",
                colorClass
              )}
              onMouseEnter={e => openTooltip(e, item, colorClass)}
              onMouseLeave={exitTooltip}
            />
            {percentage > 10 && (
              <Text variant="text-12" className="break-words pt-1 text-darkCustom-300">
                {t(status)}
              </Text>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LinearProgressBarMonitored;
