import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import { withFrameworkShow } from "@/context/framework.provider";
import { InformationRequired } from "@/redesignComponents/foundations/Icons";
import { TextVariants } from "@/types/common";

import { GoalProgressCardItemProps } from "./GoalProgressCardItem";

export interface KeyIndicatorsInsightsCardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
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

const KeyIndicatorsInsightsCard: FC<KeyIndicatorsInsightsCardProps> = ({
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

  return (
    <Flex gap={2} alignItems="center">
      {graph ? (
        <div className="flex w-[calc(33.33%-16px)] min-w-[120px] shrink-0 items-center justify-center">{chart}</div>
      ) : null}
      <Flex direction="column" gap={2}>
        <Flex gap={1} alignItems="center">
          <Text fontSize="16px" color="neutral.900" lineHeight="24px">
            {label}
          </Text>
          <InformationRequired color="neutral.800" boxSize="14px" />
        </Flex>
        {value > 0 ? (
          <Flex gap={1} alignItems="center">
            <Text fontSize="20px" fontWeight="bold" color="neutral.900" lineHeight="28px">
              {value?.toLocaleString()}
            </Text>
            {limit ||
              (totalValue && (
                <Text fontSize="18px" color="neutral.800" lineHeight="28px">
                  {t("of")}
                </Text>
              ))}
            <Text fontSize="18px" color="neutral.800" lineHeight="28px">
              {limit?.toLocaleString() ?? totalValue?.toLocaleString()}
              {hectares ? ` ${t("ha")}` : ""}
            </Text>
          </Flex>
        ) : (
          <Text fontSize="18px" fontWeight="bold" color="neutral.600" lineHeight="28px">
            {t("N/A")}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

export default withFrameworkShow(KeyIndicatorsInsightsCard);
