import classNames from "classnames";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import { withFrameworkShow } from "@/context/framework.provider";
import { TextVariants } from "@/types/common";

import LinearProgressBar from "../../ProgressBar/LinearProgressBar/LinearProgressBar";
import GoalProgressCardItem, { GoalProgressCardItemProps } from "./GoalProgressCardItem";

export interface GoalProgressCardProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  value?: number;
  limit?: number;
  label?: string;
  items?: GoalProgressCardItemProps[];
  hasProgress?: boolean;
  progressBarValue?: number;
  labelValue?: string;
  totalValue?: string | number;
  classNameLabel?: string;
  labelVariant?: TextVariants;
  classNameCard?: string;
  classNameLabelValue?: string;
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
  totalValue,
  classNameLabel,
  labelVariant,
  classNameCard,
  classNameLabelValue,
  ...rest
}) => {
  const value = _val ?? 0;

  // Calculates percentage and clamps between 0 and 100
  const progressValue = !limit ? 0 : Math.min(Math.max((value / limit) * 100, 0), 100);

  return (
    <div {...rest} className={classNames("flex items-center rounded-lg", className)}>
      {/* Left */}
      <When condition={hasProgress}>
        <div className={classNames("mr-6 w-full", classNameCard)}>
          <Text variant={labelVariant ?? "text-16-light"} className={classNames("mb-1 w-full", classNameLabel)}>
            {label}
          </Text>
          <When condition={!!totalValue}>
            <img src="/images/graphic-5.png" alt="arrow-right" className="size-32 lg:size-40 mb-2" />
          </When>
          <Text variant="text-24-bold" className={classNames("flex w-full items-baseline", classNameLabelValue)}>
            {value?.toLocaleString()}&nbsp;
            <When condition={!!limit || !!totalValue}>
              <Text variant="text-16-light">of {limit?.toLocaleString() ?? totalValue?.toLocaleString()}</Text>
            </When>
            <When condition={!!labelValue}>
              <Text variant="text-16-light">{labelValue}</Text>
            </When>
          </Text>

          <LinearProgressBar
            color="primary"
            value={progressValue}
            className={classNames("mt-2 bg-primary-200", {
              "opacity-0": !limit
            })}
          />
        </div>
      </When>
      {/* Right */}
      {items && (
        <div className={classNames("w-full space-y-3 pl-6", classNameCard)}>
          {items.map(item => (
            <GoalProgressCardItem key={item.label} {...item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default withFrameworkShow(GoalProgressCard);
