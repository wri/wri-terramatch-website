import { Box, Flex, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { Meta, StoryObj } from "@storybook/react";

import {
  AgriculturalLandIcon,
  AgroforestyIcon,
  ApplicationsIcon,
  AreaHectaresIcon,
  ArrowForwardIcon,
  AssistedNaturalRegenIcon,
  AttachFileIcon,
  CalendarIcon,
  CheckApprovedIcon,
  CheckIcon,
  CheckIndeterminateIcon,
  ChevronDownAltIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CloseIcon,
  CompressIcon,
  CorrectIcon,
  DashboardIcon,
  DeleteIcon,
  DirectSeedingIcon,
  DisallowedIcon,
  DocumentIcon,
  DownloadIcon,
  DraftIcon,
  DragIcon,
  DueIcon,
  EditIcon,
  ExpandIcon,
  GrasslandIcon,
  IncorrectIcon,
  IndeterminateIcon,
  InfoIcon,
  InformationRequiredIcon,
  InformationRequiredSimpleIcon,
  JobsCircleIcon,
  JobsIcon,
  LandscapeIcon,
  LanguageIcon,
  LoadingIcon,
  MangroveIcon,
  MessagesIcon,
  MoreVertIcon,
  NaturalForestIcon,
  NewTabIcon,
  NothingReportedIcon,
  NotificationIcon,
  NurseryBuildingIcon,
  NurseryExpandingIcon,
  NurseryIcon,
  NurseryManagingIcon,
  OpenNaturalEcosystemIcon,
  OpportunitiesIcon,
  OrganizationIcon,
  PeatlandIcon,
  PendingIcon,
  PhotoAddIcon,
  PhotoLibraryIcon,
  PhotosIcon,
  PlaceholderIcon,
  PlusIcon,
  ProgrammeIcon,
  ProjectIcon,
  RegenerationIcon,
  RejectedIcon,
  ReportsIcon,
  SearchIcon,
  SeedlingsCircleIcon,
  SeedlingsIcon,
  SilvopastureIcon,
  SiteIcon,
  SpeciesIcon,
  SpeciesNativeIcon,
  SurvivalRateIcon,
  TreeCircleIcon,
  TreeIcon,
  TreePlantingIcon,
  UploadIcon,
  UrbanForestIcon,
  UserAddIcon,
  UserIcon,
  VideoIcon,
  VisibilityIcon,
  VisibilityOffIcon,
  WetlandIcon,
  WoodlotIcon
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
    <Box fontSize="xs" color="gray.600" textAlign="center">
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
    <SimpleGrid columns={5} gap={6}>
      <Box>
        <CategoryHeader title="Data Visualisation" />
        <VStack align="stretch" gap={4}>
          <IconWrapper name="Area / Hectares">
            <AreaHectaresIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Jobs / Workdays">
            <JobsIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Jobs Circle">
            <JobsCircleIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Landscape">
            <LandscapeIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Regeneration">
            <RegenerationIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Seedlings">
            <SeedlingsIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Seedlings Circle">
            <SeedlingsCircleIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Species">
            <SpeciesIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Species Native">
            <SpeciesNativeIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Survival Rate">
            <SurvivalRateIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Tree">
            <TreeIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Tree Circle">
            <TreeCircleIcon boxSize={8} />
          </IconWrapper>
        </VStack>
      </Box>

      <Box>
        <CategoryHeader title="Restoration & Land" />
        <VStack align="stretch" gap={4}>
          <IconWrapper name="Agroforesty">
            <AgroforestyIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Agricultural Land">
            <AgriculturalLandIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Assisted Natural Regen">
            <AssistedNaturalRegenIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Direct Seeding">
            <DirectSeedingIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Grassland">
            <GrasslandIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Mangrove">
            <MangroveIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Natural Forest">
            <NaturalForestIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Nursery Building">
            <NurseryBuildingIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Nursery Expanding">
            <NurseryExpandingIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Nursery Managing">
            <NurseryManagingIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Open Natural Ecosystem">
            <OpenNaturalEcosystemIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Peatland">
            <PeatlandIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Silvopasture">
            <SilvopastureIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Tree Planting">
            <TreePlantingIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Urban Forest">
            <UrbanForestIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Wetland">
            <WetlandIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Woodlot">
            <WoodlotIcon boxSize={8} />
          </IconWrapper>
        </VStack>
      </Box>

      <Box>
        <CategoryHeader title="Function" />
        <VStack align="stretch" gap={4}>
          <IconWrapper name="Arrow Forward">
            <ArrowForwardIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Attach File">
            <AttachFileIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Check">
            <CheckIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Check Indeterminate">
            <CheckIndeterminateIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Chevron Down Alt">
            <ChevronDownAltIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Chevron Down">
            <ChevronDownIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Chevron Right">
            <ChevronRightIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Chevron Up">
            <ChevronUpIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Close">
            <CloseIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Compress">
            <CompressIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Correct">
            <CorrectIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Disallowed">
            <DisallowedIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Delete">
            <DeleteIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Document">
            <DocumentIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Drag">
            <DragIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Edit">
            <EditIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Expand">
            <ExpandIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Incorrect">
            <IncorrectIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Indeterminate">
            <IndeterminateIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Information">
            <InfoIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Loading">
            <LoadingIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="More Vert">
            <MoreVertIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="New Tab">
            <NewTabIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Placeholder">
            <PlaceholderIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Plus">
            <PlusIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Photo">
            <PhotosIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Photo Add">
            <PhotoAddIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Photo Library">
            <PhotoLibraryIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Search">
            <SearchIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Upload">
            <UploadIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="User">
            <UserIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="User Add">
            <UserAddIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Video">
            <VideoIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Visibility">
            <VisibilityIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Visibility Off">
            <VisibilityOffIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Information Required Simple">
            <InformationRequiredSimpleIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Calendar">
            <CalendarIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Download">
            <DownloadIcon boxSize={8} />
          </IconWrapper>
        </VStack>
      </Box>

      <Box>
        <CategoryHeader title="Navigation / Sections" />
        <VStack align="stretch" gap={4}>
          <IconWrapper name="Applications">
            <ApplicationsIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Dashboard">
            <DashboardIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Language">
            <LanguageIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Messages">
            <MessagesIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Notification">
            <NotificationIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Nursery">
            <NurseryIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Opportunities">
            <OpportunitiesIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Organisation">
            <OrganizationIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Programme">
            <ProgrammeIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Project">
            <ProjectIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Report">
            <ReportsIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Site">
            <SiteIcon boxSize={8} />
          </IconWrapper>
        </VStack>
      </Box>

      <Box>
        <CategoryHeader title="Status" />
        <VStack align="stretch" gap={4}>
          <IconWrapper name="Check / Approved">
            <CheckApprovedIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Draft">
            <DraftIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Due">
            <DueIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Information Required">
            <InformationRequiredIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Nothing Reported">
            <NothingReportedIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Pending">
            <PendingIcon boxSize={8} />
          </IconWrapper>
          <IconWrapper name="Rejected">
            <RejectedIcon boxSize={8} />
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
          <AreaHectaresIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Jobs / Workdays">
          <JobsIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Jobs Circle">
          <JobsCircleIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Landscape">
          <LandscapeIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Regeneration">
          <RegenerationIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Seedlings">
          <SeedlingsIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Seedlings Circle">
          <SeedlingsCircleIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Species">
          <SpeciesIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Species Native">
          <SpeciesNativeIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Survival Rate">
          <SurvivalRateIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Tree">
          <TreeIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Tree Circle">
          <TreeCircleIcon boxSize={8} />
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
        <IconWrapper name="Arrow Forward">
          <ArrowForwardIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Attach File">
          <AttachFileIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Check">
          <CheckIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Check Indeterminate">
          <CheckIndeterminateIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Chevron Down Alt">
          <ChevronDownAltIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Chevron Down">
          <ChevronDownIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Chevron Right">
          <ChevronRightIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Chevron Up">
          <ChevronUpIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Close">
          <CloseIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Compress">
          <CompressIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Correct">
          <CorrectIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Disallowed">
          <DisallowedIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Delete">
          <DeleteIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Document">
          <DocumentIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Drag">
          <DragIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Edit">
          <EditIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Expand">
          <ExpandIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Incorrect">
          <IncorrectIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Indeterminate">
          <IndeterminateIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Information">
          <InfoIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Loading">
          <LoadingIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="More Vert">
          <MoreVertIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="New Tab">
          <NewTabIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Placeholder">
          <PlaceholderIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Plus">
          <PlusIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Photo Add">
          <PhotoAddIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Photo Library">
          <PhotoLibraryIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Photo">
          <PhotosIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Search">
          <SearchIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Upload">
          <UploadIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="User Add">
          <UserAddIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="User">
          <UserIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Video">
          <VideoIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Visibility">
          <VisibilityIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Visibility Off">
          <VisibilityOffIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Information Required Simple">
          <InformationRequiredSimpleIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Calendar">
          <CalendarIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Download">
          <DownloadIcon boxSize={8} />
        </IconWrapper>
      </SimpleGrid>
    </VStack>
  )
};

export const RestorationAndLand: Story = {
  render: () => (
    <VStack align="stretch" gap={6}>
      <CategoryHeader title="Restoration & Land" />
      <SimpleGrid columns={[2, 3, 4, 6]} gap={4}>
        <IconWrapper name="Agroforesty">
          <AgroforestyIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Agricultural Land">
          <AgriculturalLandIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Assisted Natural Regen">
          <AssistedNaturalRegenIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Direct Seeding">
          <DirectSeedingIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Grassland">
          <GrasslandIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Mangrove">
          <MangroveIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Natural Forest">
          <NaturalForestIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Nursery Building">
          <NurseryBuildingIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Nursery Expanding">
          <NurseryExpandingIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Nursery Managing">
          <NurseryManagingIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Open Natural Ecosystem">
          <OpenNaturalEcosystemIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Peatland">
          <PeatlandIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Silvopasture">
          <SilvopastureIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Tree Planting">
          <TreePlantingIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Urban Forest">
          <UrbanForestIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Wetland">
          <WetlandIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Woodlot">
          <WoodlotIcon boxSize={8} />
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
          <ApplicationsIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Dashboard">
          <DashboardIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Language">
          <LanguageIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Messages">
          <MessagesIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Notification">
          <NotificationIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Nursery">
          <NurseryIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Opportunities">
          <OpportunitiesIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Organization">
          <OrganizationIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Programme">
          <ProgrammeIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Project">
          <ProjectIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Report">
          <ReportsIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Site">
          <SiteIcon boxSize={8} />
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
          <CheckApprovedIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Draft">
          <DraftIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Due">
          <DueIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Information Required">
          <InformationRequiredIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Nothing Reported">
          <NothingReportedIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Pending">
          <PendingIcon boxSize={8} />
        </IconWrapper>
        <IconWrapper name="Rejected">
          <RejectedIcon boxSize={8} />
        </IconWrapper>
      </SimpleGrid>
    </VStack>
  )
};
