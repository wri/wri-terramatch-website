import { Box, Flex, Text } from "@chakra-ui/react";
import { ButtonProps } from "@chakra-ui/react";
import { ReactNode } from "react";

import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";

interface ProjectOverviewTabProps {
  project: ProjectFullDto;
}

interface OverviewItemProps {
  title: string;
  buttonProps?: ButtonProps;
  children?: ReactNode;
}

const OverviewItem = ({ title, buttonProps, children }: OverviewItemProps) => {
  return (
    <Flex direction="column" gap={4} flex={1}>
      <Flex alignItems="center" justifyContent="space-between">
        <Text>{title}</Text>
        {buttonProps ? <Button {...buttonProps} /> : null}
      </Flex>
      {children}
    </Flex>
  );
};

const ProjectOverviewTab = ({ project }: ProjectOverviewTabProps) => {
  return (
    <PageBody>
      <Flex direction="column" gap={5}>
        <Flex gap={7}>
          <OverviewItem title="Map" />
          <OverviewItem title="Project Set Up" />
        </Flex>
        <OverviewItem title="Key Indicators & Insights">
          <Flex gap={2} flex={1}>
            <Box>Box 1</Box>
            <Box>Box 2</Box>
            <Box>Box 3</Box>
            <Box>Box 4</Box>
          </Flex>
        </OverviewItem>
        <Flex gap={7}>
          <OverviewItem title="Team Members">
            <Box>Box 1</Box>
          </OverviewItem>
          <OverviewItem title="Latest Images">
            <Box>Box 1</Box>
          </OverviewItem>
          <OverviewItem title="Project Onboarding">
            <Box>Box 1</Box>
          </OverviewItem>
        </Flex>
      </Flex>
    </PageBody>
  );
};

export default ProjectOverviewTab;
