import { Box, Flex, Text } from "@chakra-ui/react";
import { FC } from "react";

import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import { type TagSubmissionProps } from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";

export interface PageHeaderProps {
  title: string;
  tag?: TagSubmissionProps;
  label?: string;
}

const PageHeader: FC<PageHeaderProps> = ({ title, tag, label }) => {
  return (
    <Box background="secondary.neutral" paddingX={4} paddingY={3} className="flex items-center justify-between">
      <Text fontSize="28px" lineHeight="36px" color="primary.900" fontWeight="bold">
        {title}
      </Text>
      <Flex gap={2} alignItems="center">
        <Text fontSize="14px" lineHeight="20px" fontWeight="bold" className="text-theme-neutral-900">
          {label}
        </Text>
        {tag != null && <TagSubmission {...tag} />}
      </Flex>
    </Box>
  );
};

export default PageHeader;
