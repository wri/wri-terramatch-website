import { Box, Flex } from "@chakra-ui/react";
import { FC } from "react";

import { Step } from "./Step";
import { ProgressStepsProps } from "./types";

export const ProgressSteps: FC<ProgressStepsProps> = ({ steps }) => {
  return (
    <Box>
      {steps.map((step, index) => (
        <Box key={step.index ?? index}>
          <Step {...step} />
          {index < steps.length - 1 && (
            <Flex ml={4} my={2}>
              <Box backgroundColor="neutral.400" height="12px" width="1px" rounded="full" />
            </Flex>
          )}
        </Box>
      ))}
    </Box>
  );
};
