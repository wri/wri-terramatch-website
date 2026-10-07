import { Flex, Text } from "@chakra-ui/react";
import { FC } from "react";

import ChartDot from "./ChartDot";

export type ChartLegendItem = {
  label: string;
  color: string;
};

export type ChartLegendProps = {
  items: ChartLegendItem[];
};

export const ChartLegend: FC<ChartLegendProps> = ({ items }) => (
  <Flex as="ul" wrap="wrap" justifyContent="center" columnGap={4} rowGap={2}>
    {items.map(({ label, color }) => (
      <Flex as="li" key={label} alignItems="center" gap="0.375rem">
        <ChartDot color={color} />
        <Text textStyle="300" color="neutral.800" whiteSpace="nowrap">
          {label}
        </Text>
      </Flex>
    ))}
  </Flex>
);

export default ChartLegend;
