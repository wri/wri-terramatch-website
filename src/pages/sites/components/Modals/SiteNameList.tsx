import { Flex, List, Text } from "@chakra-ui/react";
import { FC } from "react";

interface SiteNameListProps {
  names: string[];
}

const SiteNameList: FC<SiteNameListProps> = ({ names }) => (
  <Flex flexDirection="column" gap={4} bg="neutral.200" py={2} px={3} rounded={4}>
    <List.Root as="ul" pl={4} spaceY={2} listStyleType="disc">
      {names.map((name, index) => (
        <List.Item key={`${name}-${index}`} _marker={{ color: "neutral.900" }}>
          <Text textStyle="400" color="neutral.900" as="span">
            {name}
          </Text>
        </List.Item>
      ))}
    </List.Root>
  </Flex>
);

export default SiteNameList;
