import { Box, Text } from "@chakra-ui/react";
import { FC } from "react";

import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import { type TagSubmissionProps } from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission.type";

export interface PageHeaderProps {
  title: string;
  tag: TagSubmissionProps;
}

const PageHeader: FC<PageHeaderProps> = ({ title, tag }) => {
  return (
    <Box background="secondary.neutral" paddingX={4} paddingY={3} className="flex items-center justify-between">
      <Text fontSize="28px" lineHeight="36px" color="primary.900" fontWeight="bold">
        {title}
      </Text>
      <TagSubmission {...tag} />
    </Box>
  );
};

export default PageHeader;
