import { useT } from "@transifex/react";
import classNames from "classnames";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { withFrameworkShow } from "@/context/framework.provider";
import { TextVariants } from "@/types/common";

import LinearProgressBar from "../../ProgressBar/LinearProgressBar/LinearProgressBar";
import ToolTip from "../../Tooltip/Tooltip";
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
  chart?: JSX.Element;
  hectares?: boolean;
  graph?: boolean;
  tooltipTitle?: string;
  tootipContent?: string;
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
  chart,
  hectares = false,
  graph = true,
  tooltipTitle,
  tootipContent,
  ...rest
}) => {
  const t = useT();
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
            <When condition={!!tooltipTitle || !!tootipContent}>
              <ToolTip title={tooltipTitle} content={tootipContent || ""} width="w-60" trigger="click">
                <Icon name={IconNames.IC_INFO} className="ml-1 text-neutral-500" />
              </ToolTip>
            </When>
          </Text>
          {graph ? <div className="flex w-[calc(33.33%-16px)] min-w-[200px] items-center">{chart}</div> : null}
          <Text variant="text-24-bold" className={classNames("flex w-full items-baseline", classNameLabelValue)}>
            {value?.toLocaleString()}&nbsp;
            <When condition={!!limit || !!totalValue}>
              <Text variant="text-16-light">
                {t("of")} {limit?.toLocaleString() ?? totalValue?.toLocaleString()} {hectares ? t("ha") : null}
              </Text>
            </When>
            <When condition={!!labelValue}>
              <Text variant="text-16-light">{labelValue}</Text>
            </When>
          </Text>

          <LinearProgressBar
            color="primary"
            value={progressValue}
            className={classNames("mt-2  bg-primary-200", {
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
