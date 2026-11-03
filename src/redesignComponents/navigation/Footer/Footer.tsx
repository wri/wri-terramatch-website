import { Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { Footer as WriFooter } from "@worldresources/wri-design-systems";
import Link from "next/link";
import type { ComponentProps, FC } from "react";

import { privacyPolicyLink, termsAndConditionsLink } from "@/constants/links";

export interface FooterProps {
  maxWidth?: ComponentProps<typeof WriFooter>["maxWidth"];
  className?: string;
}

const Footer: FC<FooterProps> = ({ maxWidth, className }) => {
  const t = useT();

  return (
    <Box
      className={className}
      css={{
        "& footer": {
          position: "relative",
          width: "100%",
          minHeight: "auto",
          bg: "primary.900",
          borderTopColor: "neutral.300"
        },
        // The WRI logo ships with grey fills; the design renders it light on the dark background.
        "& footer > div > div:first-of-type svg path": {
          fill: "neutral.200"
        },
        "& footer > div > div:nth-of-type(2)": {
          width: { base: "100%", md: "auto" },
          justifyContent: "center"
        },
        "& footer > div > div:last-of-type p": {
          color: "neutral.200",
          width: "auto"
        }
      }}
    >
      <WriFooter label={t("© TerraMatch")} maxWidth={maxWidth}>
        <Link href={privacyPolicyLink} target="_blank" rel="noopener noreferrer">
          <Text as="span" textStyle="300" color="neutral.200">
            {t("Privacy policy")}
          </Text>
        </Link>
        <Link href={termsAndConditionsLink} target="_blank" rel="noopener noreferrer">
          <Text as="span" textStyle="300" color="neutral.200">
            {t("Terms of service")}
          </Text>
        </Link>
      </WriFooter>
    </Box>
  );
};

export default Footer;
