import { Box, Flex, FlexProps, Text } from "@chakra-ui/react";
import { Divider } from "@mui/material";
import { ReactNode } from "react";

import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { IButtonProps } from "@/redesignComponents/actions/Buttons/Button/Button";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ImageGalleryCard from "@/redesignComponents/content/ContentCard/ImageGalleryCard/ImageGalleryCard";
import ProfileListCard, { IProfile } from "@/redesignComponents/content/ContentCard/ProfileListCard/ProfileListCard";
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

const sampleProfiles: IProfile[] = [
  {
    id: "1",
    name: "John Doe",
    image: "https://i.pravatar.cc/300?img=1"
  },
  {
    id: "2",
    name: "Jane Smith",
    image: "https://i.pravatar.cc/300?img=2"
  },
  {
    id: "3",
    name: "Michael Johnson",
    image: "https://i.pravatar.cc/300?img=3"
  },
  {
    id: "4",
    name: "Sarah Williams",
    image: "https://i.pravatar.cc/300?img=4"
  }
];

const sampleImages = [
  "/public/images/placeholder-1.jpg",
  "/public/images/placeholder-2.jpg",
  "/public/images/placeholder-3.jpg",
  "/public/images/placeholder-4.jpg"
];

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
        <OverviewItem
          title="Key Indicators & Insights"
          flexProps={{ paddingY: 2 }}
          buttonProps={{
            variant: "secondary",
            size: "small",
            children: "View Progress & Goals",
            rightIcon: <ChevronRight />
          }}
        >
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
          <OverviewItem
            title="Team Members"
            buttonProps={{
              variant: "secondary",
              size: "small",
              children: "Manage Team",
              rightIcon: <ChevronRight />
            }}
          >
            <ProfileListCard
              items={[
                {
                  title: "Team Members",
                  profiles: sampleProfiles,
                  onProfileClick: profile => {
                    console.log("Profile clicked:", profile);
                  }
                }
              ]}
            />
          </OverviewItem>
          <OverviewItem
            title="Latest Images"
            buttonProps={{
              variant: "secondary",
              size: "small",
              children: "View Gallery",
              rightIcon: <ChevronRight />
            }}
          >
            <ImageGalleryCard images={sampleImages} />
          </OverviewItem>
          <OverviewItem title="Project Onboarding">
            <Flex direction="column" gap={6} padding={5} backgroundColor="neutral.100" borderRadius={1}>
              <Text color="neutral.900" fontSize="14px" lineHeight="20px">
                <Text fontWeight="bold">Monitoring, Reporting, and Verification</Text>
                process overview. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vestibulum in
                lorem in rutrum. Vestibulum in dictum turpis, id congue augue. Nam pretium viverra ante, vel posuere
                arcu porttitor quis. Pellentesque a porttitor purus, a molestie orci.
              </Text>
              <Flex direction="column" gap={2}>
                <Text color="neutral.900" fontSize="18px" lineHeight="28px" fontWeight="bold">
                  Helpful Links
                </Text>
                <Divider />
                <Flex direction="column" gap={3} paddingTop={3} alignItems="flex-start">
                  <Button variant="borderless" size="small" rightIcon={<ChevronRight />}>
                    Key tasks and responsibilities
                  </Button>
                  <Button variant="borderless" size="small" rightIcon={<ChevronRight />}>
                    Expected deliverables
                  </Button>
                  <Button variant="borderless" size="small" rightIcon={<ChevronRight />}>
                    Reporting cadence & deadlines
                  </Button>
                  <Button variant="borderless" size="small" rightIcon={<ChevronRight />}>
                    Check supporting guides and materials
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </OverviewItem>
        </Flex>
      </Flex>
    </PageBody>
  );
};

export default ProjectOverviewTab;
