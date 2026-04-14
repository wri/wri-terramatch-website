import { Box, BoxProps } from "@chakra-ui/react";
import { FC } from "react";

const PPC_LOCKUP_SRC = "/images/logos/ppc-priceless-planet-mastercard-white-bg.png";

export const PpcProgramBannerLogo: FC<BoxProps> = props => (
  <Box as="figure" margin={0} display="block" maxW="240px" {...props}>
    <img
      src={PPC_LOCKUP_SRC}
      alt="Priceless Planet Coalition with Mastercard"
      className="h-auto max-h-[72px] w-full max-w-[220px] object-contain object-right"
      loading="lazy"
      decoding="async"
    />
  </Box>
);
