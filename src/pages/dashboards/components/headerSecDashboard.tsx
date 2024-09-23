import classNames from "classnames";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import Toggle from "@/components/elements/Toggle/Toggle";

const HeaderSecDashboard = ({
  title,
  type,
  secondOptionsData
}: {
  title: string;
  type?: "legend" | "toggle";
  secondOptionsData?: any;
}) => {
  return (
    <div className="flex items-center justify-between">
      <Text variant="text-14" className="uppercase text-darkCustom ">
        {title}
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
  );
};

export default HeaderSecDashboard;
