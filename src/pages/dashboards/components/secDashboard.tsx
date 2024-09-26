import classNames from "classnames";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import Toggle from "@/components/elements/Toggle/Toggle";
import ToolTip from "@/components/elements/Tooltip/Tooltip";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import { DashboardDataProps } from "../dashboard/index.page";
import ValueNumberDashboard from "./valueNumberDashboard";

const SecDashboard = ({
  title,
  type,
  secondOptionsData,
  data
}: {
  title: string;
  type?: "legend" | "toggle";
  secondOptionsData?: any;
  data?: DashboardDataProps;
}) => {
  return (
    <div>
      <div className="flex items-center justify-between">
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
                  <div className={classNames("h-2 w-2 rounded-full", `bg-${item.color}`)} />
                  <Text variant="text-10" className="text-darkCustom">
                    {item.label}
                  </Text>
                </div>
              ))}
          </div>
        </When>
        <When condition={type === "toggle"}>
          <Toggle items={secondOptionsData} activeIndex={0} setActiveIndex={() => {}} />
        </When>
      </div>
      <div className="mt-3 flex items-center justify-between">
        {data && data.value ? <ValueNumberDashboard value={data.value} unit={data.unit} /> : <></>}
        <When condition={data && data.value && data.unit}>
          <img src="/images/img-tree.png" alt="secondValue" className="h-9" />
        </When>
        <When condition={data && data.graphic}>
          <img src={data?.graphic} alt="graphic" className="w-full" />
        </When>
      </div>
    </div>
  );
};

export default SecDashboard;
