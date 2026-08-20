import { Box, Flex } from "@chakra-ui/react";
import { FC } from "react";

import { LoadingIcon } from "@/redesignComponents/foundations/Icons";

export interface LoadingMapProps {
  loading: boolean;
}

const LoadingMap: FC<LoadingMapProps> = ({ loading }) => {
  return loading ? (
    <Box bg="black/25" position="absolute" top={0} left={0} right={0} bottom={0} zIndex={10}>
      <Flex alignItems="center" justifyContent="center" height="100%" width="100%">
        <LoadingIcon boxSize={7} color="neutral.100" animation="spin 1s linear infinite" />
      </Flex>
    </Box>
  ) : null;
};

export default LoadingMap;
