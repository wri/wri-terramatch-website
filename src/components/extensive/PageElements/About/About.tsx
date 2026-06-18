import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ChevronRightIcon from "@/redesignComponents/foundations/Icons/Function/ChevronRightIcon";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

interface AboutProps {
  title?: string;
  description: ReactNode;
  links: {
    title: string;
    link: string;
  }[];
  className?: string;
}
const About: FC<AboutProps> = ({ title, description, links, className }) => {
  const t = useT();

  return (
    <Flex className={twMerge("rounded-1 min-h-0 flex-col gap-2 bg-theme-neutral-100 p-5", className)}>
      {title && (
        <Text color="neutral.900" textStyle="400-bold">
          {title}
        </Text>
      )}
      {description}
      <Flex className="min-h-0 shrink-0 flex-col gap-2">
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
              className="mobile:max-w-full mobile:[text-wrap:auto]"
              onClick={() => window.open(link.link, "_blank")}
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
