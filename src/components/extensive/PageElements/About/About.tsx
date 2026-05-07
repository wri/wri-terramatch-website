import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, ReactNode } from "react";

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
}
const About: FC<AboutProps> = ({ title, description, links }) => {
  const t = useT();

  return (
    <Flex direction="column" gap={2} padding={5} backgroundColor="neutral.100" borderRadius={1} minHeight={0}>
      {title && (
        <Text color="neutral.900" textStyle="400-bold">
          {title}
        </Text>
      )}
      {description}
      <Flex direction="column" gap={2} minHeight={0}>
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
