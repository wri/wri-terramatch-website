import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import { LoadingIcon } from "@/redesignComponents/foundations/Icons";

export interface LoadingTableProps {
  text: string;
}

const LoadingTable: FC<LoadingTableProps> = ({ text }) => {
  const t = useT();
  return (
    <Flex alignItems="center" justifyContent="center" gap={2} pt={12} height="100%">
      <LoadingIcon boxSize={7} color="primary.700" animation="spin 1s linear infinite" />
      <Text textStyle="500" color="neutral.800">
        {t(text)}
      </Text>
    </Flex>
  );
};

export default LoadingTable;
