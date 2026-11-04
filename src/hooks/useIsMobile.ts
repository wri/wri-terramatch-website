import { useMediaQuery } from "@chakra-ui/react";

export const MOBILE_MEDIA_QUERY = "(max-width: 1200px)";

export const useIsMobile = () => {
  const [isMobile] = useMediaQuery([MOBILE_MEDIA_QUERY], { fallback: [false] });
  return isMobile;
};
