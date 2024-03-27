import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, useEffect, useState } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { Colors } from "@/types/common";

import Text from "../../Text/Text";

export interface labelProps {
  id: string;
  label: string;
}
export interface StepProgressbarProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  color?: Colors;
  value: number;
  labels?: labelProps[];
}

const StepProgressbar = ({ value, color = "primary", labels = [], className, ...rest }: StepProgressbarProps) => {
  const [lastSelected, setLastSelected] = useState<number>(-1);
  const differentialThreshold = 100 / (labels.length - 1);
  useEffect(() => {
    for (let index = 0; index < labels.length; index++) {
      if (index * differentialThreshold <= value) {
        setLastSelected(index);
      }
    }
  }, [labels.length, value, differentialThreshold]);

  return (
    <div className="relative w-full">
      <div className="w-full">
        <div className="flex w-full justify-between">
          {labels?.map((item, index) => (
            <div key={item.id}>
              <div className="flex flex-col items-center">
                <Icon name={IconNames.CHECK_PROGRESSBAR} className="z-10 h-5 w-5" />
                <Text
                  variant="text-12"
                  className={classNames(
                    lastSelected == index && "!font-bold",
                    index > lastSelected && "opacity-50",
                    "max-w-[80px] text-center first:w-20 last:w-20"
                  )}
                >
                  {item.label}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        {...rest}
        className={`absolute top-[5px] left-10 h-[9px] w-[calc(100%_-_80px)] rounded-full bg-neutral-200 ${
          className || ""
        }`}
        role="progressbar"
      >
        <div className={`h-full bg-${color} rounded-full transition-all duration-300`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
};

export default StepProgressbar;
