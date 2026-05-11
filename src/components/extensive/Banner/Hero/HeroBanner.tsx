import Link from "next/link";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";

import Banner, { BannerProps } from "../Banner";

type HeroBannerProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> &
  BannerProps & {
    //URL it can start `/images/` to point to public directory
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
  };

const HeroBanner: FC<HeroBannerProps> = ({ title, subtitle, ctaLink, ctaText, ...rest }) => (
  <Banner {...rest}>
    {title != null && (
      <Text as="h1" variant="text-heading-700" className="mb-8 text-center uppercase text-white" containHtml>
        {title}
      </Text>
    )}
    {subtitle != null && (
      <Text as="h2" variant="text-heading-200" className="mb-8 max-w-lg text-center text-white">
        {subtitle}
      </Text>
    )}
    {ctaText != null && (
      <Button as={Link} href={ctaLink}>
        {ctaText ?? ""}
      </Button>
    )}
  </Banner>
);

export default HeroBanner;
