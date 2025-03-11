import { useT } from "@transifex/react";
import classNames from "classnames";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { TextVariants } from "@/types/common";

import ToolTip from "../../Tooltip/Tooltip";

export interface GoalProgressCardItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  iconName: IconNames;
  label: string;
  value: number | string;
  classNameLabel?: string;
  classNameLabelValue?: string;
  variantLabel?: TextVariants;
  limit?: number;
  tooltipContent?: string;
}

const GoalProgressCardItem: FC<GoalProgressCardItemProps> = ({
  iconName,
  label,
  value: _val,
  className,
  classNameLabel,
  classNameLabelValue,
  variantLabel,
  limit,
  tooltipContent,
  ...rest
}) => {
  const t = useT();
  const value = _val || 0;
  return (
    <div {...rest} className={classNames("flex w-full items-center", className)}>
      <Icon name={iconName} className="mr-4 h-10 w-10 min-w-[40px]" />

      <Text
        variant={variantLabel ?? "text-16-light"}
        className={classNames("flex w-[13vw] items-center whitespace-nowrap", classNameLabel)}
      >
        {label}
        <When condition={!!tooltipContent}>
          <ToolTip
            content={tooltipContent ?? ""}
            title={label}
            width={"w-60"}
            className="whitespace-normal"
            trigger="click"
          >
            <Icon name={IconNames.IC_INFO} className="ml-1 w-6 text-neutral-500" />
          </ToolTip>
        </When>
      </Text>

      <Text variant="text-14-bold" className={classNames("flex w-full justify-end", classNameLabelValue)}>
        {value?.toLocaleString()}
        <When condition={!!limit}>
          <Text variant="text-16-light" className="ml-2">
            {t("of")} {limit}
          </Text>
        </When>
      </Text>
    </div>
  );
};

export default GoalProgressCardItem;
