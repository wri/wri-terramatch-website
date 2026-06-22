import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ChevronRightIcon from "@/redesignComponents/foundations/Icons/Function/ChevronRightIcon";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";
import { useOnboardingCardAnalyticsContext } from "@/utils/analytics/onboardingCardAnalytics.context";

interface AboutProps {
  title?: string;
  description: ReactNode;
  links: {
    title: string;
    link: string;
  }[];
  className?: string;
  onLinkClick?: (link: { title: string; link: string }) => void;
}
const About: FC<AboutProps> = ({ title, description, links, className, onLinkClick }) => {
  const t = useT();
  const onboardingAnalytics = useOnboardingCardAnalyticsContext();

  return (
    <Flex className={twMerge("rounded-1 bg-theme-neutral-100 min-h-0 flex-col gap-2 p-5", className)}>
      {title && (
        <Text color="neutral.900" textStyle="400-bold">
          {title}
        </Text>
      )}
      {description}
      <Flex className="min-h-0 flex-[1] shrink-0 flex-col gap-2">
        <Text color="neutral.900" textStyle="500-bold">
          {t("Helpful Links")}
        </Text>
        <SimpleDivider />
        <Flex direction="column" paddingTop={1.5} alignItems="flex-start">
          {links.map(link => (
            <Button
              variant="borderless"
              size="small"
              rightIcon={<ChevronRightIcon />}
              key={link.title}
              className="justify-start truncate !whitespace-nowrap mobile:max-w-full mobile:[text-wrap:auto]"
              onClick={() => {
                onLinkClick?.({ title: link.title, link: link.link });
                onboardingAnalytics?.trackLinkClick(link.title, link.link);
                window.open(link.link, "_blank");
              }}
            >
              {t(link.title)}
            </Button>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default About;
