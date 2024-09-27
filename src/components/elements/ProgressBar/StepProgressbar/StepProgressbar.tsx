import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, useEffect, useState } from "react";
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

  return (
    <div className={tw("px-4", className)}>
      <div className="relative w-full">
        <div
          className={classNames("w-full", {
            "mt-12 lg:mb-16 wide:mb-20": labelsPlaceTop,
            "mb-12 lg:mb-16 wide:mb-20": !labelsPlaceTop
          })}
        >
          <div className="flex w-full justify-between">
            {labels?.map((item, index) => (
              <div key={item.id}>
                <div className="relative flex flex-col items-center">
                  <Icon
                    name={index > lastSelected ? IconNames.CHECK_PROGRESSBAR_NULL : IconNames.CHECK_PROGRESSBAR}
                    className={`z-10 h-5 w-5 lg:h-6 lg:w-6 wide:h-7 wide:w-7 text-${color}`}
                  />
                  <Text
                    variant={labelVariant}
                    className={classNames(
                      tw(
                        lastSelected === index && "!font-bold",
                        index > lastSelected && "opacity-50",
                        "wide:text-12 absolute min-w-[64px] text-center",
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
              </div>
            ))}
          </div>
        </div>

        <div
          {...rest}
          className={`absolute left-[10px] top-[5px] h-[9px] w-[calc(100%_-_20px)] rounded-full bg-neutral-200 lg:left-[12px] lg:top-2 lg:w-[calc(100%_-_24px)] wide:left-[14px] wide:top-[10px] wide:w-[calc(100%_-_28px)]`}
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
