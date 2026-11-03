import { Flex, Text } from "@chakra-ui/react";
import { FC } from "react";

import { LoadingIcon } from "@/redesignComponents/foundations/Icons";

type IndexLoadingRowProps = {
  label: string;
  minHeight?: string;
};

const IndexLoadingRow: FC<IndexLoadingRowProps> = ({ label, minHeight = "4rem" }) => (
  <Flex minHeight={minHeight} alignItems="center" justifyContent="center" gap={3}>
    <LoadingIcon boxSize={6} className="animate-spin" color="primary.700" />
    <Text textStyle="400" color="neutral.800">
      {label}
    </Text>
  </Flex>
);

export default IndexLoadingRow;
