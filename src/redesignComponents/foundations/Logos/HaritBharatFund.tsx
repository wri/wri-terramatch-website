import { Box, BoxProps } from "@chakra-ui/react";
import { FC } from "react";

const HBF_LOGO_SRC = "/images/logos/harit-bharat-fund.png";

/**
 * Harit Bharat Fund (HBF) program logo for project banner.
 */
export const HaritBharatFund: FC<BoxProps> = props => (
  <Box as="figure" margin={0} display="block" w="80px" maxW="80px" {...props}>
    <img
      src={HBF_LOGO_SRC}
      alt="Harit Bharat Fund — Accelerating India's Land Restoration Economy for People, Nature and Climate"
      className="h-auto max-h-[132px] w-full max-w-[80px] object-contain object-right"
      loading="lazy"
      decoding="async"
    />
  </Box>
);
