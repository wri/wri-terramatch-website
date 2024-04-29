import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, useEffect, useState } from "react";
import { When } from "react-if";
import { twMerge as tw } from "tailwind-merge";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { Colors, TextVariants } from "@/types/common";

import Text from "../../Text/Text";

export interface labelProps {
  id: string;
  label: string;
}
export interface StepProgressbarProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  color?: Colors;
  value: number;
  labels?: labelProps[];
  labelVariant?: TextVariants;
  labelsPlaceTop?: boolean;
  classNameLabels?: string;
}

const StepProgressbar = ({
  value,
  color = "primary",
  labels = [],
  className,
  labelVariant = "text-12",
  labelsPlaceTop,
  classNameLabels,
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
  const widthProggresBar = 100 - 100 / labels.length;
  return (
    <div className={tw("relative w-full", className)}>
      <div className="flex w-full justify-between">
        {labels?.map((item, index) => (
          <div key={item.id} className={`flex w-[${100 / labels.length}%] flex-col items-center gap-4`}>
            <When condition={labelsPlaceTop}>
              <div className=" flex items-center">
                <Text
                  variant={labelVariant}
                  className={classNames(
                    tw(
                      lastSelected === index && "!font-bold",
                      index > lastSelected && "opacity-50",
                      "min-w-[64px] text-center",
                      classNameLabels
                    ),
                    {
                      "bottom-[calc(100%_+_16px)]": labelsPlaceTop,
                      "top-[calc(100%_+_16px)]": !labelsPlaceTop
                    }
                  )}
                >
                  {item.label}
                </Text>
              </div>
            </When>
            <div className="flex items-center">
              <Icon
                name={index > lastSelected ? IconNames.CHECK_PROGRESSBAR_NULL : IconNames.CHECK_PROGRESSBAR}
                className={`z-10 h-5 w-5 text-${color}`}
              />
            </div>
            <When condition={!labelsPlaceTop}>
              <div className=" flex items-center">
                <Text
                  variant={labelVariant}
                  className={classNames(
                    tw(
                      lastSelected === index && "!font-bold",
                      index > lastSelected && "opacity-50",
                      "min-w-[64px] text-center",
                      classNameLabels
                    ),
                    {
                      "bottom-[calc(100%_+_16px)]": labelsPlaceTop,
                      "top-[calc(100%_+_16px)]": !labelsPlaceTop
                    }
                  )}
                >
                  {item.label}
                </Text>
              </div>
            </When>
          </div>
        ))}
      </div>
      <div
        {...rest}
        className={`absolute ${labelsPlaceTop ? "bottom-[5px]" : "top-[5px]"}  h-[9px] rounded-full bg-neutral-200`}
        style={{ width: `${widthProggresBar}%`, left: `${50 / labels.length}%` }}
        role="progressbar"
      >
        <div className={`h-full bg-${color} rounded-full transition-all duration-300`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
};

export default StepProgressbar;
