import { Box, Flex, List, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

export interface MatchingPolygonsContentProps {
  existingUuids: string[];
}

const MatchingPolygonsContent: FC<MatchingPolygonsContentProps> = ({ existingUuids }) => {
  const t = useT();

  return (
    <Box px={4}>
      <Text textStyle="400" color="neutral.900">
        {t("These files match existing polygons.")}
      </Text>
      <Text textStyle="400-bold" color="neutral.900" display="flex" mb={3} gap={0.5}>
        {t("New versions")}
        <Text as="span" textStyle="400" color="neutral.900">
          {t(" will be created for:")}
        </Text>
      </Text>
      <Flex flexDirection="column" gap={4} bg="primary.100" py={2} px={3} rounded={4}>
        <List.Root as="ul" pl={4} spaceY={2} listStyleType="disc">
          {existingUuids.map(uuid => (
            <List.Item key={uuid} _marker={{ color: "neutral.900" }}>
              <Text textStyle="400" color="neutral.900">
                {uuid}
              </Text>
            </List.Item>
          ))}
        </List.Root>
      </Flex>
    </Box>
  );
};

export default MatchingPolygonsContent;
