import { Box, Flex, FlexProps, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { IButtonProps } from "@/redesignComponents/actions/Buttons/Button/Button";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import MetricCard from "@/redesignComponents/data-display/MetricCard";
import { AreaHectares, ChevronRight, Edit, Jobs, Seeds, Tree } from "@/redesignComponents/foundations/Icons";
import { ProgressSteps } from "@/redesignComponents/status/ProgressIndicator/ProgressSteps";
import { StepProps } from "@/redesignComponents/status/ProgressIndicator/types";
interface ProjectOverviewTabProps {
  project: ProjectFullDto;
}

interface OverviewItemProps {
  title: string;
  buttonProps?: IButtonProps;
  children?: ReactNode;
  flexProps?: FlexProps;
}

const OverviewItem = (props: OverviewItemProps) => {
  const { title, buttonProps, children, flexProps } = props;

  return (
    <Flex direction="column" gap={4} flex={1} {...flexProps}>
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="primary.900" fontSize="20px" lineHeight="28px">
          {title}
        </Text>
        {buttonProps ? <Button {...buttonProps} /> : null}
      </Flex>
      {children}
    </Flex>
  );
};

const exampleSteps: StepProps[] = [
  {
    index: 1,
    status: "completed",
    label: "Label",
    actions: (
      <Button variant="borderless" size="small" leftIcon={<Edit boxSize={3} />}>
        Edit
      </Button>
    )
  },
  {
    index: 2,
    status: "completed",
    label: "Label",
    actions: (
      <Button variant="borderless" size="small" leftIcon={<Edit boxSize={3} />}>
        Edit
      </Button>
    )
  },
  {
    index: 3,
    status: "completed",
    label: "Label",
    actions: (
      <Button variant="borderless" size="small" leftIcon={<Edit boxSize={3} />}>
        Edit
      </Button>
    )
  },
  {
    index: 4,
    status: "error",
    label: "Label",
    actions: (
      <Button variant="borderless" size="small" leftIcon={<Edit boxSize={3} />}>
        Edit
      </Button>
    )
  },
  {
    index: 5,
    status: "active",
    label: "Label",
    actions: (
      <Button variant="borderless" size="small" leftIcon={<Edit boxSize={3} />}>
        Edit
      </Button>
    )
  },
  {
    index: 6,
    status: "disabled",
    label: "Label",
    actions: (
      <Button variant="borderless" size="small" leftIcon={<Edit boxSize={3} />}>
        Edit
      </Button>
    )
  },
  {
    index: 7,
    status: "disabled",
    label: "Label",
    actions: (
      <Button variant="borderless" size="small" leftIcon={<Edit boxSize={3} />}>
        Edit
      </Button>
    )
  }
];

const ProjectOverviewTab = ({ project }: ProjectOverviewTabProps) => {
  return (
    <PageBody>
      <Flex direction="column" gap={5} paddingX={6}>
        <Flex gap={7}>
          <OverviewItem
            title="Project Map"
            flexProps={{ flex: 3 }}
            buttonProps={{
              variant: "secondary",
              size: "small",
              children: "View Sites",
              rightIcon: <ChevronRight />
            }}
          >
            <Box>MAP</Box>
          </OverviewItem>
          <OverviewItem
            flexProps={{ flex: 1 }}
            title="Project Set Up"
            buttonProps={{
              variant: "primary",
              size: "small",
              children: "Continue Editing",
              rightIcon: <ChevronRight />
            }}
          >
            <ProgressSteps steps={exampleSteps} />
          </OverviewItem>
        </Flex>
        <OverviewItem title="Key Indicators & Insights" flexProps={{ paddingY: 2 }}>
          <Flex gap={2} flex={1} justify="space-between">
            <MetricCard
              title="Trees Planted"
              progress={50}
              goal={100}
              variant="donutChart"
              icon={<Tree />}
              color="secondary.600"
            />
            <MetricCard
              title="Seedlings Grown"
              progress={50}
              goal={150}
              variant="donutChart"
              icon={<Seeds />}
              color="secondary.600"
            />
            <MetricCard
              title="Hectares Restored"
              progress={50}
              goal={200}
              variant="donutChart"
              icon={<AreaHectares />}
              color="secondary.700"
            />
            <MetricCard title="Jobs Created" progress={50} goal={300} variant="donutChart" icon={<Jobs />} />
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
