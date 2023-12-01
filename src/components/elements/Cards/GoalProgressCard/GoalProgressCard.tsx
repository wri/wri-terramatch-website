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
}

const GoalProgressCard: FC<GoalProgressCardProps> = ({
  value: _val,
  limit,
  label,
  items,
  hasProgress = true,
  className,
  ...rest
}) => {
  const value = _val || 0;
  const valueText = !limit ? value : `${value}/${limit}`;

  // Calculates percentage and clamps between 0 and 100
  const progressValue = !limit ? 0 : Math.min(Math.max((value / limit) * 100, 0), 100);

  return (
    <div {...rest} className={classNames("flex items-center rounded-lg bg-primary-100 px-4 py-3 shadow", className)}>
      {/* Left */}
      <When condition={hasProgress}>
        <div className="mr-6 w-full">
          <Text variant="text-bold-caption-100">{label}</Text>
          <Text variant="text-bold-headline-1000">{valueText}</Text>
          <LinerProgressbar
            color="primary"
            value={progressValue}
            className={classNames("bg-primary-200", {
              "opacity-0": !progressValue
            })}
          />
        </div>
      </When>
      {/* Right */}
      {items && (
        <div className="space-y-3 p-3">
          {items.map(item => (
            <GoalProgressCardItem key={item.label} {...item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GoalProgressCard;
