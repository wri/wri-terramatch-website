import { Flex, Text } from "@chakra-ui/react";
import { FC, Fragment } from "react";

import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

import ChartDot from "./ChartDot";

export type ChartTooltipRow = {
  label: string;
  value: string;
  color?: string;
  /** Renders a divider above this row. */
  dividerBefore?: boolean;
};

export type ChartTooltipProps = {
  title?: string;
  rows: ChartTooltipRow[];
  /** Renders the first row's value prominently above its label (single-value tooltips). */
  variant?: "list" | "highlight";
};

export const ChartTooltip: FC<ChartTooltipProps> = ({ title, rows, variant = "list" }) => (
  <Flex
    direction="column"
    gap={1}
    minWidth="5rem"
    maxWidth="16rem"
    padding={3}
    backgroundColor="neutral.100"
    borderWidth="1px"
    borderColor="neutral.300"
    borderRadius="md"
    boxShadow="lg"
  >
    {variant === "highlight" ? (
      <>
        <Text textStyle="300-bold" color="neutral.900">
          {rows[0]?.value}
        </Text>
        <Text textStyle="200" color="neutral.700">
          {title}
        </Text>
      </>
    ) : (
      <>
        {title != null && (
          <Text textStyle="300" color="neutral.900">
            {title}
          </Text>
        )}
        {rows.map(({ label, value, color, dividerBefore }) => (
          <Fragment key={label}>
            {dividerBefore === true && <SimpleDivider />}
            <Flex alignItems="center" gap="0.375rem">
              {color != null && <ChartDot color={color} size="small" />}
              <Flex flex={1} justifyContent="space-between" gap={3}>
                <Text textStyle="200" color="neutral.700" whiteSpace="nowrap">
                  {label}
                </Text>
                <Text textStyle="200-bold" color="neutral.900" whiteSpace="nowrap" textAlign="right">
                  {value}
                </Text>
              </Flex>
            </Flex>
          </Fragment>
        ))}
      </>
    )}
  </Flex>
);

export default ChartTooltip;
