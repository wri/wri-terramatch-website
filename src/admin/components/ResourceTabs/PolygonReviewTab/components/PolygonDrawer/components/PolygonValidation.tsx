import React, { useRef } from "react";

import Button from "@/components/elements/Button/Button";
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
      <Button variant="orange" className="mb-4 px-10">
        Check Polygon
      </Button>
      <div className="mb-1 flex items-center">
        <Text variant="text-14-bold" className="text-darkCustom">
          3 out of 14 &nbsp;
        </Text>
        <Text variant="text-14" className="text-darkCustom">
          criteria are not met
        </Text>
      </div>
      <Text variant="text-10-light" className="mb-4 text-blueCustom-900 opacity-80">
        Last check at 14:05 on March 5, 2024
      </Text>
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
