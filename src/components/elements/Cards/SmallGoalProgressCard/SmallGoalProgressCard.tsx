import classNames from "classnames";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import Text from "@/components/elements/Text/Text";

import LinearProgressBar from "../../ProgressBar/LinearProgressBar/LinearProgressBar";

export interface SmallGoalProgressCardProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  value: number;
  limit?: number;
  label: string;
}

const SmallGoalProgressCard: FC<SmallGoalProgressCardProps> = ({ value, limit, label, className, ...rest }) => {
  const valueText = !limit ? value : `${value}/${limit}`;

  // Calculates percentage and clamps between 0 and 100
  const progressValue = !limit ? 0 : Math.min(Math.max((value / limit) * 100, 0), 100);

  return (
    <div {...rest} className={classNames("flex w-full items-center justify-between", className)}>
      {/* Left */}
      <Text variant="text-bold-subtitle-500">{label}</Text>

      {/* Right */}
      <div className="ml-4 flex min-w-[100px] flex-col items-end">
        <Text variant="text-light-subtitle-400">{valueText}</Text>
        <LinearProgressBar color="primary" value={progressValue} className="bg-primary-200" />
      </div>
    </div>
  );
};

export default SmallGoalProgressCard;
