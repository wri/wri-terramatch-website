import { Box, Flex, Text } from "@chakra-ui/react";
import classNames from "classnames";
import { FC } from "react";

import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import { type TagSubmissionProps } from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";

export interface PageHeaderProps {
  title: string;
  tag?: TagSubmissionProps;
  label?: string;
  className?: string;
}

const PageHeader: FC<PageHeaderProps> = ({ title, tag, label, className }) => {
  return (
    <Box
      background="secondary.neutral"
      paddingX={6}
      paddingY={4}
      className={classNames("flex items-center justify-between", className)}
    >
      <Text textStyle="800-bold" color="primary.900">
        {title}
      </Text>
      <Flex gap={2} alignItems="center">
        <Text textStyle="200-bold" color="neutral.900">
          {label}
        </Text>
        {tag != null && <TagSubmission {...tag} />}
      </Flex>
    </Box>
  );
};

export default PageHeader;
