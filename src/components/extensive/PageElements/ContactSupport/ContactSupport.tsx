import { Flex, Text } from "@chakra-ui/react";
import { FC } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { ContactSupportIcon } from "@/redesignComponents/foundations/Icons";

const DEFAULT_EMAIL = "info@terramatch.org";

export interface ContactSupportProps {
  message: string;
  email?: string;
  subject?: string;
  suffix?: string;
}

const ContactSupport: FC<ContactSupportProps> = ({
  message,
  email = DEFAULT_EMAIL,
  subject = "Support Request for Project Report",
  suffix
}) => {
  const mailtoHref = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

  return (
    <Flex alignItems="flex-start" gap={2} backgroundColor="primary.100" padding={2} borderRadius={1}>
      <Flex paddingTop="3px" flexShrink={0}>
        <ContactSupportIcon boxSize={5} />
      </Flex>
      <Text color="neutral.900" textStyle="300" flex={1}>
        {message}{" "}
        <Button
          as="a"
          variant="borderless"
          size="small"
          href={mailtoHref}
          className="!inline-flex !h-auto !min-h-0 !px-0 !py-1 !align-baseline"
        >
          <Text as="span" textStyle="200-bold" color="neutral.900">
            {email}
          </Text>
        </Button>
        {suffix}
      </Text>
    </Flex>
  );
};

export default ContactSupport;
