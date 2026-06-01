import { Box, BoxProps } from "@chakra-ui/react";
import { FC } from "react";

const PPC_LOCKUP_SRC = "/images/logos/ppc-priceless-planet-mastercard-endorsement.png";

export const PpcProgramBannerLogo: FC<BoxProps> = props => (
  <Box as="figure" margin={0} display="block" maxW="204px" {...props}>
    <img
      src={PPC_LOCKUP_SRC}
      alt="Priceless Planet Coalition with Mastercard"
      className="h-auto max-h-[72px] w-full max-w-[204px] object-contain object-right"
      loading="lazy"
      decoding="async"
    />
  </Box>
);
