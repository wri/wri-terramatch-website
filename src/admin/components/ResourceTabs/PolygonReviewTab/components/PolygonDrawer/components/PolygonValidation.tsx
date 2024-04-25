import React, { useRef } from "react";

import Text from "@/components/elements/Text/Text";
import Icon from "@/components/extensive/Icon/Icon";
import { IconNames } from "@/components/extensive/Icon/Icon";

export interface ICriteriaCheckItemProps {
  id: string;
  status: boolean;
  label: string;
}

export interface ICriteriaCheckProps {
  menu: ICriteriaCheckItemProps[];
}
const PolygonValidation = (props: ICriteriaCheckProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div>
      <div className="mb-3 flex items-center">
        <Text variant="text-14-bold" className="text-grey-300">
          3 out of 14 &nbsp;
        </Text>
        <Text variant="text-14" className="text-grey-300">
          criteria are not met
        </Text>
      </div>

      <div ref={containerRef} className="flex max-h-[168px] flex-col gap-3 overflow-auto">
        {props.menu.map(item => (
          <div key={item.id} className="flex items-center gap-2">
            <Icon name={item.status ? IconNames.ROUND_GREEN_TICK : IconNames.ROUND_RED_CROSS} className="h-4 w-4" />
            <Text variant="text-14-light">{item.label}</Text>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PolygonValidation;
