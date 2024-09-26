import classNames from "classnames";
import { useEffect, useState } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import Toggle from "@/components/elements/Toggle/Toggle";
import ToolTip from "@/components/elements/Tooltip/Tooltip";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import { DashboardDataProps } from "../dashboard/index.page";
import GraphicDashboard from "./graphicDashboard";
import ValueNumberDashboard from "./valueNumberDashboard";

const SecDashboard = ({
  title,
  type,
  secondOptionsData,
  className,
  classNameBody,
  classNameHeader,
  data
}: {
  title: string;
  type?: "legend" | "toggle";
  secondOptionsData?: any;
  className?: string;
  classNameBody?: string;
  classNameHeader?: string;
  data: DashboardDataProps;
}) => {
  const [toggleValue, setToggleValue] = useState(0);

  useEffect(() => {
    if (data.tableData) {
      setToggleValue(1);
    }
  }, []);

  return (
    <div className={className}>
      <div className={classNames("flex items-center justify-between", classNameHeader)}>
        <Text variant="text-14" className="flex items-center gap-1 uppercase text-darkCustom">
          {title}
          <ToolTip content={title} placement="top" width="w-56">
            <Icon name={IconNames.IC_INFO} className="h-3.5 w-3.5 text-darkCustom lg:h-5 lg:w-5" />
          </ToolTip>
        </Text>
        <When condition={type === "legend"}>
          <div className="flex gap-4">
            {secondOptionsData &&
              secondOptionsData.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-1">
                  <div className={classNames("h-2 w-2 rounded-full", item.color)} />
                  <Text variant="text-10" className="text-darkCustom">
                    {item.label}
                  </Text>
                </div>
              ))}
          </div>
        </When>
        <When condition={type === "toggle"}>
          <Toggle
            items={secondOptionsData}
            activeIndex={toggleValue}
            setActiveIndex={() => {
              setToggleValue(toggleValue === 0 ? 1 : 0);
            }}
          />
        </When>
      </div>
      <div className={classNames("mt-3 flex items-center justify-between", classNameBody)}>
        {data.value ? <ValueNumberDashboard value={data.value} unit={data.unit} /> : <></>}
        <When condition={data.value && data.unit}>
          <img src="/images/img-tree.png" alt="secondValue" className="h-9" />
        </When>
        <When condition={data.graphic}>
          <img src={data?.graphic} alt={data?.graphic} className="w-full" />
        </When>
        <When condition={!!data.tableData}>
          <When condition={toggleValue === 1}>
            {data.tableData && <GraphicDashboard data={data.tableData} maxValue={data.maxValue ?? 0} />}
          </When>
        </When>
      </div>
    </div>
  );
};

export default SecDashboard;
