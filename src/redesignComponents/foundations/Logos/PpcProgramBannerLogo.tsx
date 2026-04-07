import { Box, BoxProps } from "@chakra-ui/react";
import { FC } from "react";

/** Brand asset: endorsed lockup (typically designed for dark background). */
const PPC_LOCKUP_SRC = "/images/logos/ppc-priceless-planet-mastercard-lockup.png";

/**
 * Priceless Planet Coalition + Mastercard endorsed lockup for PPC project banner (horizontal).
 * Dark backdrop keeps the official black-background artwork legible on the light banner strip.
 */
export const PpcProgramBannerLogo: FC<BoxProps> = props => (
  <Box as="figure" margin={0} display="block" maxW="240px" rounded="md" bg="black" px={2} py={1.5} {...props}>
    <img
      src={PPC_LOCKUP_SRC}
      alt="Priceless Planet Coalition with Mastercard"
      className="h-auto max-h-[72px] w-full max-w-[220px] object-contain object-right"
      loading="lazy"
      decoding="async"
    />
  </Box>
);
