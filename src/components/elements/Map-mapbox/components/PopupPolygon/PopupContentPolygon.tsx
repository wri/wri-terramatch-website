import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import type { FC } from "react";

import ValidationTag from "@/redesignComponents/actions/Tags/ValidationTag/ValidationTag";
import { AreaHectaresIcon, CommentIcon, TreeCircleIcon } from "@/redesignComponents/foundations/Icons";

const PopupContentPolygon: FC = () => {
  const t = useT();

  return (
    <Flex padding="0.75rem" direction="column" gap={4} width="20rem">
      <Flex alignItems="center" gap="3.625rem" justifyContent="space-between">
        <Flex alignItems="center" gap={2}>
          <TreeCircleIcon boxSize={6} />
          <Text color="neutral.700" textStyle="400" textWrap="nowrap">
            {t("Trees Planted")}
          </Text>
        </Flex>
        <Text color="neutral.900" textStyle="400-bold">
          XXX,XXX
        </Text>
      </Flex>
      <Flex alignItems="center" gap="3.625rem" justifyContent="space-between">
        <Flex alignItems="center" gap={2}>
          <Flex
            h={6}
            w={6}
            alignItems="center"
            justifyContent="center"
            borderColor={"secondary.500"}
            borderWidth={"1px"}
            backgroundColor="secondary.300"
            borderRadius={"full"}
          >
            <AreaHectaresIcon boxSize={3.5} color="secondary.800" />
          </Flex>
          <Text color="neutral.700" textStyle="400" textWrap="nowrap">
            {t("Area (ha)")}
          </Text>
        </Flex>
        <Text color="neutral.900" textStyle="400-bold">
          XXX,XXX
        </Text>
      </Flex>
      <Flex alignItems="center" gap="3.625rem" justifyContent="space-between">
        <Flex alignItems="center" gap={2}>
          <CommentIcon boxSize={4} color="neutral.800" />
          <Text color="neutral.700" textStyle="400" textWrap="nowrap">
            {t("Comments")}
          </Text>
        </Flex>
        <Text color="neutral.900" textStyle="400-bold">
          2
        </Text>
      </Flex>
      <Flex alignItems="center" gap="3.625rem" justifyContent="space-between">
        <Flex alignItems="center" gap={2}>
          <Text color="neutral.700" textStyle="400" textWrap="nowrap">
            {t("Validation")}
          </Text>
        </Flex>
        <ValidationTag status="passed" />
      </Flex>
    </Flex>
  );
};
export default PopupContentPolygon;
