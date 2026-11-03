import { Flex, Text } from "@chakra-ui/react";
import { type FC, type HTMLAttributes } from "react";

export interface NoResultsProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
}

const NoResults: FC<NoResultsProps> = ({ title, description, className, ...props }) => (
  <Flex flexDir="column" gap={1.5} h="full" p={4} className={className} {...props}>
    <Text textStyle="600-bold" color="neutral.900">
      {title}
    </Text>
    <Text textStyle="400" color="neutral.800">
      {description}
    </Text>
  </Flex>
);

export default NoResults;
