import { Box, Flex, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { Meta, StoryObj } from "@storybook/react";

import {
  Applications,
  AreaHectares,
  Check,
  CheckApproved,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CloseFullscreen,
  Correct,
  Dashboard,
  Delete,
  Draft,
  Drag,
  Due,
  Edit,
  Expand,
  Incorrect,
  Indeterminate,
  Info,
  InformationRequired,
  Jobs,
  Landscape,
  Language,
  Messages,
  MoreVert,
  NewTab,
  NothingReported,
  Notification,
  Nursery,
  Opportunities,
  Organisation,
  Pending,
  PhotoAdd,
  Placeholder,
  Programme,
  Project,
  Regeneration,
  Rejected,
  Reports,
  Search,
  Seeds,
  Site,
  Species,
  SpeciesNative,
  SurvivalRate,
  Tree,
  UserAdd,
  Visibility,
  VisibilityOff
} from ".";

const meta: Meta = {
  title: "Redesign Components/Foundations/Icons",
  parameters: {
    layout: "padded"
  }
};

export default meta;
type Story = StoryObj;

const IconWrapper = ({ children, name }: { children: React.ReactNode; name: string }) => (
  <Flex alignItems="center" justifyContent="center" p={4} flexDirection="column">
    <Box mb={2}>{children}</Box>
    <Box fontSize="xs" color="gray.600">
      {name}
    </Box>
  </Flex>
);

const CategoryHeader = ({ title }: { title: string }) => (
  <Box mb={4}>
    <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={2}>
      <Text fontSize="lg" fontWeight="semibold" textAlign="center">
        {title}
      </Text>
    </Box>
  </Box>
);

export const AllIcons: Story = {
  render: () => (
    <SimpleGrid columns={4} gap={6}>
      <Box>
        <CategoryHeader title="Data Visualisation" />
        <VStack align="stretch" gap={4}>
          <IconWrapper name="Area / Hectares">
            <AreaHectares boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Jobs">
            <Jobs boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Landscape">
            <Landscape boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Regeneration">
            <Regeneration boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Seeds">
            <Seeds boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Species">
            <Species boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Species Native">
            <SpeciesNative boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Survival Rate">
            <SurvivalRate boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Tree">
            <Tree boxSize={8} />
          </IconWrapper>
        </VStack>
      </Box>

      <Box>
        <CategoryHeader title="Function" />
        <VStack align="stretch" gap={4}>
          <IconWrapper name="Check">
            <Check boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Chevron Down">
            <ChevronDown boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Chevron Right">
            <ChevronRight boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Chevron Up">
            <ChevronUp boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Close Fullscreen">
            <CloseFullscreen boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Correct">
            <Correct boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Delete">
            <Delete boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Drag">
            <Drag boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Edit">
            <Edit boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Expand">
            <Expand boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Incorrect">
            <Incorrect boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Indeterminate">
            <Indeterminate boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Information">
            <Info boxSize={8} />
          </IconWrapper>
          <IconWrapper name="More Vert">
            <MoreVert boxSize={8} />
          </IconWrapper>
          <IconWrapper name="New Tab">
            <NewTab boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Placeholder">
            <Placeholder boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Photo Add">
            <PhotoAdd boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Search">
            <Search boxSize={8} />
          </IconWrapper>
          <IconWrapper name="User Add">
            <UserAdd boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Visibility">
            <Visibility boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Visibility Off">
            <VisibilityOff boxSize={8} />
          </IconWrapper>
        </VStack>
      </Box>

      <Box>
        <CategoryHeader title="Navigation / Sections" />
        <VStack align="stretch" gap={4}>
          <IconWrapper name="Applications">
            <Applications boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Dashboard">
            <Dashboard boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Language">
            <Language boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Messages">
            <Messages boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Notification">
            <Notification boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Nursery">
            <Nursery boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Opportunities">
            <Opportunities boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Organisation">
            <Organisation boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Programme">
            <Programme boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Project">
            <Project boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Report">
            <Reports boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Site">
            <Site boxSize={8} />
          </IconWrapper>
        </VStack>
      </Box>

      <Box>
        <CategoryHeader title="Status" />
        <VStack align="stretch" gap={4}>
          <IconWrapper name="Check / Approved">
            <CheckApproved boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Draft">
            <Draft boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Due">
            <Due boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Information Required">
            <InformationRequired boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Nothing Reported">
            <NothingReported boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Pending">
            <Pending boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Rejected">
            <Rejected boxSize={8} />
          </IconWrapper>
        </VStack>
      </Box>
    </SimpleGrid>
  )
};

export const DataVisualisation: Story = {
  render: () => (
    <VStack align="stretch" gap={6}>
      <CategoryHeader title="Data Visualisation" />
      <SimpleGrid columns={[2, 3, 4, 6]} gap={4}>
        <IconWrapper name="Area / Hectares">
          <AreaHectares boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Jobs">
          <Jobs boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Landscape">
          <Landscape boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Regeneration">
          <Regeneration boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Seeds">
          <Seeds boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Species">
          <Species boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Species Native">
          <SpeciesNative boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Survival Rate">
          <SurvivalRate boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Tree">
          <Tree boxSize={8} />
        </IconWrapper>
      </SimpleGrid>
    </VStack>
  )
};

export const Function: Story = {
  render: () => (
    <VStack align="stretch" gap={6}>
      <CategoryHeader title="Function" />
      <SimpleGrid columns={[2, 3, 4, 6]} gap={4}>
        <IconWrapper name="Check">
          <Check boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Chevron Down">
          <ChevronDown boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Chevron Right">
          <ChevronRight boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Chevron Up">
          <ChevronUp boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Close Fullscreen">
          <CloseFullscreen boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Correct">
          <Correct boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Delete">
          <Delete boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Drag">
          <Drag boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Edit">
          <Edit boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Expand">
          <Expand boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Incorrect">
          <Incorrect boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Indeterminate">
          <Indeterminate boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Information">
          <Info boxSize={8} />
        </IconWrapper>
        <IconWrapper name="More Vert">
          <MoreVert boxSize={8} />
        </IconWrapper>
        <IconWrapper name="New Tab">
          <NewTab boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Placeholder">
          <Placeholder boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Photo Add">
          <PhotoAdd boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Search">
          <Search boxSize={8} />
        </IconWrapper>
        <IconWrapper name="User Add">
          <UserAdd boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Visibility">
          <Visibility boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Visibility Off">
          <VisibilityOff boxSize={8} />
        </IconWrapper>
      </SimpleGrid>
    </VStack>
  )
};

export const NavigationSections: Story = {
  render: () => (
    <VStack align="stretch" gap={6}>
      <CategoryHeader title="Navigation / Sections" />
      <SimpleGrid columns={[2, 3, 4, 6]} gap={4}>
        <IconWrapper name="Applications">
          <Applications boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Dashboard">
          <Dashboard boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Language">
          <Language boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Messages">
          <Messages boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Notification">
          <Notification boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Nursery">
          <Nursery boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Opportunities">
          <Opportunities boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Organisation">
          <Organisation boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Programme">
          <Programme boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Project">
          <Project boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Report">
          <Reports boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Site">
          <Site boxSize={8} />
        </IconWrapper>
      </SimpleGrid>
    </VStack>
  )
};

export const Status: Story = {
  render: () => (
    <VStack align="stretch" gap={6}>
      <CategoryHeader title="Status" />
      <SimpleGrid columns={[2, 3, 4, 6]} gap={4}>
        <IconWrapper name="Check / Approved">
          <CheckApproved boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Draft">
          <Draft boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Due">
          <Due boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Information Required">
          <InformationRequired boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Nothing Reported">
          <NothingReported boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Pending">
          <Pending boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Rejected">
          <Rejected boxSize={8} />
        </IconWrapper>
      </SimpleGrid>
    </VStack>
  )
};
