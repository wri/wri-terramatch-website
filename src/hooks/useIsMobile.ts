import { useMediaQuery } from "@chakra-ui/react";

// Matches the `mobile` screen in tailwind.config.js.
export const MOBILE_MEDIA_QUERY = "(max-width: 1200px)";

export const useIsMobile = () => {
  const [isMobile] = useMediaQuery([MOBILE_MEDIA_QUERY], { fallback: [false] });
  return isMobile;
};
