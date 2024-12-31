import { useT } from "@transifex/react";
import classNames from "classnames";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { TextVariants } from "@/types/common";

export interface GoalProgressCardItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  iconName: IconNames;
  label: string;
  value: number | string;
  classNameLabel?: string;
  classNameLabelValue?: string;
  variantLabel?: TextVariants;
  limit?: number;
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
  ...rest
}) => {
  const t = useT();
  const value = _val || 0;
  return (
    <div {...rest} className={classNames("flex w-full items-center", className)}>
      <Icon name={iconName} className="mr-4 h-10 w-10 min-w-10" />

      <Text
        variant={variantLabel ?? "text-16-light"}
        className={classNames("w-[13vw] whitespace-nowrap", classNameLabel)}
      >
        {label}
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
