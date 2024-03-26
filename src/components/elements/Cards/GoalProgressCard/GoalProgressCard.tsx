import classNames from "classnames";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";

import LinerProgressbar from "../../ProgressBar/LinerProgressbar/LinerProgressbar";
import GoalProgressCardItem, { GoalProgressCardItemProps } from "./GoalProgressCardItem";

export interface GoalProgressCardProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  value?: number;
  limit?: number;
  label: string;
  items?: GoalProgressCardItemProps[];
  hasProgress?: boolean;
  progressBarValue?: number;
  labelValue?: string;
}

const GoalProgressCard: FC<GoalProgressCardProps> = ({
  value: _val,
  limit,
  label,
  items,
  progressBarValue,
  hasProgress = true,
  className,
  labelValue,
  ...rest
}) => {
  const value = _val || 0;
  const valueText = value;

  // Calculates percentage and clamps between 0 and 100
  const progressValue = !limit ? 0 : Math.min(Math.max((value / limit) * 100, 0), 100);

  return (
    <div {...rest} className={classNames("flex items-center rounded-lg", className)}>
      {/* Left */}
      <When condition={hasProgress}>
        <div className="mr-6 w-full">
          <Text variant="text-16-light" className="mb-1 w-full">
            {label}
          </Text>
          <Text variant="text-24-bold" className="flex w-full items-baseline">
            {valueText}&nbsp;
            <When condition={!!limit}>
              <Text variant="text-16-light">of {limit}</Text>
            </When>
            <Text variant="text-16-light">{labelValue}</Text>
          </Text>
          <LinerProgressbar
            color="primary"
            value={progressValue}
            className={classNames("mt-2 bg-primary-200", {
              "opacity-0": !progressValue
            })}
          />
        </div>
      </When>
      {/* Right */}
      {items && (
        <div className="w-full space-y-3 pl-6 ">
          {items.map(item => (
            <GoalProgressCardItem key={item.label} {...item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GoalProgressCard;
