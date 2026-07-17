import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import parse, { DOMNode, domToReact, Element, HTMLReactParserOptions } from "html-react-parser";
import { twMerge } from "tailwind-merge";

import ContactSupport from "@/components/extensive/PageElements/ContactSupport/ContactSupport";
import PageItem, { PageItemProps } from "@/components/extensive/PageElements/PageItem/PageItem";
import { useAboutSection } from "@/connections/AboutSection";
import { useFrameworkContext } from "@/context/framework.provider";
import { AboutSectionIndexQueryParams } from "@/generated/v3/entityService/entityServiceComponents";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ChevronRightIcon from "@/redesignComponents/foundations/Icons/Function/ChevronRightIcon";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";
import { useOnboardingCardAnalyticsContext } from "@/utils/analytics/onboardingCardAnalytics.context";

type AboutPageItemProps = Pick<PageItemProps, "flexProps" | "className"> & {
  type: NonNullable<AboutSectionIndexQueryParams["type"]>;
  contentClassName?: string;
  descriptionMaxWidth?: string;
};

const parserReplacements: HTMLReactParserOptions["replace"] = domNode => {
  if (!(domNode instanceof Element)) return undefined;

  const { name, children } = domNode;
  switch (name) {
    case "ul":
      return (
        <Box as="ul" listStyleType="disc" marginInlineStart={3} paddingLeft={4}>
          {domToReact(children as DOMNode[], { replace: parserReplacements })}
        </Box>
      );

    case "li":
      return (
        <Box as="li">
          <Text color="neutral.900" textStyle="300">
            {domToReact(children as DOMNode[], { replace: parserReplacements })}
          </Text>
        </Box>
      );

    case "p":
      return (
        <Text color="neutral.900" textStyle="300">
          {domToReact(children as DOMNode[], { replace: parserReplacements })}
        </Text>
      );
  }
};

const AboutPageItem = ({ type, flexProps, className, contentClassName, descriptionMaxWidth }: AboutPageItemProps) => {
  const { framework } = useFrameworkContext();
  const [loaded, { data: aboutSection }] = useAboutSection({ type, framework });
  const t = useT();
  const onboardingAnalytics = useOnboardingCardAnalyticsContext();

  if (!loaded || aboutSection == null) return null;
  return (
    <PageItem title={aboutSection.header} className={className} flexProps={flexProps}>
      <Flex className={twMerge("rounded-1 bg-theme-neutral-100 min-h-0 flex-col gap-2 p-5", contentClassName)}>
        {aboutSection.title && (
          <Text color="neutral.900" textStyle="400-bold">
            {aboutSection.title}
          </Text>
        )}
        <Flex direction="column" gap={5} maxWidth={descriptionMaxWidth}>
          {parse(aboutSection.description, { replace: parserReplacements })}
          <ContactSupport message={aboutSection.contactSupportMessage} subject={aboutSection.contactSupportSubject} />
        </Flex>
        <Flex className="min-h-0 flex-[1] shrink-0 flex-col gap-2">
          <Text color="neutral.900" textStyle="500-bold">
            {t("Helpful Links")}
          </Text>
          <SimpleDivider />
          <Flex direction="column" paddingTop={1.5} alignItems="flex-start">
            {aboutSection.links.map(link => (
              <Button
                variant="borderless"
                size="small"
                rightIcon={<ChevronRightIcon />}
                key={link.title}
                className="justify-start truncate !whitespace-nowrap mobile:max-w-full mobile:[text-wrap:auto]"
                onClick={() => {
                  onboardingAnalytics?.trackLinkClick(link.title, link.url);
                  window.open(link.url, "_blank");
                }}
              >
                {link.title}
              </Button>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </PageItem>
  );
};

export default AboutPageItem;
