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
  labelsPlaceTop?: boolean;
}

const StepProgressbar = ({
  value,
  color = "primary",
  labels = [],
  className,
  labelsPlaceTop,
  ...rest
}: StepProgressbarProps) => {
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
    <div className="px-4">
      <div className="relative w-full">
        <div
          className={classNames("w-full", {
            "mt-12": labelsPlaceTop,
            "mb-12": !labelsPlaceTop
          })}
        >
          <div className="flex w-full justify-between">
            {labels?.map((item, index) => (
              <div key={item.id} className="">
                <div className="relative flex flex-col items-center">
                  <Icon
                    name={index > lastSelected ? IconNames.CHECK_PROGRESSBAR_NULL : IconNames.CHECK_PROGRESSBAR}
                    className="z-10 h-5 w-5"
                  />
                  <Text
                    variant="text-12"
                    className={classNames(
                      lastSelected == index && "!font-bold",
                      index > lastSelected && "opacity-50",
                      "absolute min-w-[64px] text-center",
                      {
                        "bottom-[calc(100%_+_16px)]": labelsPlaceTop,
                        "top-[calc(100%_+_16px)]": !labelsPlaceTop
                      }
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
          className={`absolute top-[5px] h-[9px] w-full rounded-full bg-neutral-200 ${className || ""}`}
          role="progressbar"
        >
          <div
            className={`h-full bg-${color} rounded-full transition-all duration-300`}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StepProgressbar;
