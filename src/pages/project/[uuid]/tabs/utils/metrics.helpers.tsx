import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

export const renderMetricTooltip = (content: ReactNode) => (
  <Box fontSize="14px" lineHeight="20px">
    {content}
  </Box>
);
