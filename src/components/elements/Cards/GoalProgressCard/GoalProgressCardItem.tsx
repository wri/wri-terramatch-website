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
    <div {...rest} className={classNames("flex w-full items-center", className)}>
      <Icon name={iconName} className="mr-4 h-10 w-10" />

      <Text variant="text-16-light" className="w-[13vw] whitespace-nowrap">
        {label}
      </Text>

      <Text variant="text-14-bold" className="">
        {value}
      </Text>
    </div>
  );
};

export default GoalProgressCardItem;
