import { useMediaQuery } from "@chakra-ui/react";

export const useResolutions = () => {
  const [isLargerResolution] = useMediaQuery(["(min-width: 1700px)"]);
  const [isSmallResolution] = useMediaQuery(["(min-width: 1400px)"]);

  return { isLargerResolution, isSmallResolution };
};
