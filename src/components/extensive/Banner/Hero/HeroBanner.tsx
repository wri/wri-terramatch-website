import Link from "next/link";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";

import Banner, { BannerProps } from "../Banner";

export interface HeroBannerProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    BannerProps {
  //URL it can start `/images/` to point to public directory
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

const HeroBanner = (props: HeroBannerProps) => {
  const { title, subtitle, ctaLink, ctaText, ...rest } = props;
  return (
    <Banner {...rest}>
      <When condition={!!title}>
        <Text as="h1" variant="text-heading-700" className="mb-8 text-center uppercase text-white" containHtml>
          {title}
        </Text>
      </When>
      <When condition={!!subtitle}>
        <Text as="h2" variant="text-heading-200" className="mb-8 max-w-lg text-center text-white">
          {subtitle}
        </Text>
      </When>
      <When condition={!!ctaText}>
        <Button as={Link} href={ctaLink}>
          {ctaText ?? ""}
        </Button>
      </When>
    </Banner>
  );
};

export default HeroBanner;
