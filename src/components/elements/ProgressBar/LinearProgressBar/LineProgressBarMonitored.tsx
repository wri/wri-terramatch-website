import classNames from "classnames";
import { useState } from "react";

import Text from "../../Text/Text";
import TooltipLineProgressBarMonitored from "../../Tooltip/TooltipLineProgressBarMonitored";

export interface dataProps {
  count: number;
  status: string;
}

export interface LinearProgressBarMonitoredProps {
  data: dataProps[];
}

const LinearProgressBarMonitored = ({ data }: LinearProgressBarMonitoredProps) => {
  const [statusHover, setStatusHover] = useState<string>("");
  const [tooltipValue, setTooltipValue] = useState<string>("");
  const [isHover, setIsHover] = useState<boolean>(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

  const colorBg: { [key: string]: string } = {
    Draft: "bg-neutral-500 hover:shadow-[#E3E3E3]",
    Submitted: "bg-primary hover:shadow-[#2398D833]",
    "Needs Info": "bg-tertiary-600 hover:shadow-[#ffe7d7]",
    Approved: "bg-success-600 hover:shadow-[#d4f3eb]"
  };

  const openTooltip = (e: React.MouseEvent<HTMLDivElement>, item: dataProps) => {
    const percentage = totalCount > 0 ? ((item.count / totalCount) * 100).toFixed(0) : "0";
    const value = `${percentage}% (${item.count} Polygons)`;
    setTooltipValue(value);
    setStatusHover(item.status);
    setIsHover(true);
    setPosition({ top: e.pageY - 70, left: e.pageX });
  };

  const exitTooltip = () => {
    setIsHover(false);
  };

  return (
    <div className="flex w-full gap-1 lg:gap-[6px]">
      <div
        className=""
        style={
          isHover
            ? { position: "fixed", top: `${position.top}px`, left: `${position.left}px`, transform: "translateX(-50%)" }
            : { display: "none" }
        }
      >
        <TooltipLineProgressBarMonitored value={tooltipValue} label={statusHover} />
      </div>
      {data.map((item, index) => {
        const percentage = totalCount > 0 ? (item.count / totalCount) * 100 : 0;
        return (
          <div key={index} style={{ width: `${percentage}%` }}>
            <div
              className={classNames(
                "h-[6px] w-full cursor-pointer rounded-sm hover:shadow-item-monitored lg:h-[8px] wide:h-[10px]",
                colorBg[item.status]
              )}
              onMouseEnter={e => openTooltip(e, item)}
              onMouseLeave={exitTooltip}
            />
            {percentage > 10 && (
              <Text variant="text-12" className="pt-1 text-darkCustom-300">
                {item.status}
              </Text>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LinearProgressBarMonitored;
