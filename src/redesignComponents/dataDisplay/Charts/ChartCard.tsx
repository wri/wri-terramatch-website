import { Flex, FlexProps, Text } from "@chakra-ui/react";
import { FC, PropsWithChildren } from "react";

export type ChartCardProps = {
  title: string;
  subtitle?: string;
} & Omit<FlexProps, "title">;

export const ChartCard: FC<PropsWithChildren<ChartCardProps>> = ({ title, subtitle, children, ...flexProps }) => (
  <Flex
    direction="column"
    gap={3}
    padding={4}
    backgroundColor="neutral.100"
    borderWidth="1px"
    borderColor="neutral.300"
    borderRadius="lg"
    minWidth={0}
    {...flexProps}
  >
    <Flex direction="column" gap={1}>
      <Text as="h3" textStyle="400-bold" color="primary.900">
        {title}
      </Text>
      {subtitle != null && (
        <Text textStyle="200" color="neutral.700">
          {subtitle}
        </Text>
      )}
    </Flex>
    {children}
  </Flex>
);

export default ChartCard;
