import classNames from "classnames";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

export interface GoalProgressCardItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  iconName: IconNames;
  label: string;
  value: number;
}

const GoalProgressCardItem: FC<GoalProgressCardItemProps> = ({ iconName, label, value: _val, className, ...rest }) => {
  const value = _val || 0;
  return (
    <div {...rest} className={classNames("flex items-center justify-between", className)}>
      <Icon name={iconName} className="mr-4 h-5 w-5 fill-primary-500" />

      <Text variant="text-bold-caption-200" className="mr-auto whitespace-nowrap">
        {label}
      </Text>

      <Text variant="text-bold-subtitle-500" className="ml-4">
        {value}
      </Text>
    </div>
  );
};

export default GoalProgressCardItem;
