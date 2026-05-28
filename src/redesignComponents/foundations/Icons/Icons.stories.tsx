import { Box, Flex, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { Meta, StoryObj } from "@storybook/react";
import type { ElementType } from "react";

import {
  AgriculturalLandIcon,
  AgroforestyIcon,
  ApplicationsIcon,
  AreaHectaresCircleIcon,
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
  CommentIcon,
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
  FilterIcon,
  GoogleViewIcon,
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
  MapViewIcon,
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
  RefreshIcon,
  RegenerationIcon,
  RejectedIcon,
  ReportsIcon,
  SatelliteViewIcon,
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
  UndoIcon,
  UploadIcon,
  UrbanForestIcon,
  UserAddIcon,
  UserIcon,
  VideoIcon,
  VisibilityIcon,
  VisibilityOffIcon,
  WarningIcon,
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

type IconEntry = {
  name: string;
  Icon: ElementType;
};

type IconCategory = {
  title: string;
  icons: IconEntry[];
};

const DATA_VISUALISATION_ICONS: IconEntry[] = [
  { name: "Area / Hectares", Icon: AreaHectaresIcon },
  { name: "Area Hectares Circle", Icon: AreaHectaresCircleIcon },
  { name: "Jobs / Workdays", Icon: JobsIcon },
  { name: "Jobs Circle", Icon: JobsCircleIcon },
  { name: "Landscape", Icon: LandscapeIcon },
  { name: "Regeneration", Icon: RegenerationIcon },
  { name: "Seedlings", Icon: SeedlingsIcon },
  { name: "Seedlings Circle", Icon: SeedlingsCircleIcon },
  { name: "Species", Icon: SpeciesIcon },
  { name: "Species Native", Icon: SpeciesNativeIcon },
  { name: "Survival Rate", Icon: SurvivalRateIcon },
  { name: "Tree", Icon: TreeIcon },
  { name: "Tree Circle", Icon: TreeCircleIcon }
];

const RESTORATION_AND_LAND_ICONS: IconEntry[] = [
  { name: "Agroforesty", Icon: AgroforestyIcon },
  { name: "Agricultural Land", Icon: AgriculturalLandIcon },
  { name: "Assisted Natural Regen", Icon: AssistedNaturalRegenIcon },
  { name: "Direct Seeding", Icon: DirectSeedingIcon },
  { name: "Grassland", Icon: GrasslandIcon },
  { name: "Mangrove", Icon: MangroveIcon },
  { name: "Natural Forest", Icon: NaturalForestIcon },
  { name: "Nursery Building", Icon: NurseryBuildingIcon },
  { name: "Nursery Expanding", Icon: NurseryExpandingIcon },
  { name: "Nursery Managing", Icon: NurseryManagingIcon },
  { name: "Open Natural Ecosystem", Icon: OpenNaturalEcosystemIcon },
  { name: "Peatland", Icon: PeatlandIcon },
  { name: "Silvopasture", Icon: SilvopastureIcon },
  { name: "Tree Planting", Icon: TreePlantingIcon },
  { name: "Urban Forest", Icon: UrbanForestIcon },
  { name: "Wetland", Icon: WetlandIcon },
  { name: "Woodlot", Icon: WoodlotIcon }
];

const FUNCTION_ICONS: IconEntry[] = [
  { name: "Arrow Forward", Icon: ArrowForwardIcon },
  { name: "Attach File", Icon: AttachFileIcon },
  { name: "Check", Icon: CheckIcon },
  { name: "Check Indeterminate", Icon: CheckIndeterminateIcon },
  { name: "Chevron Down Alt", Icon: ChevronDownAltIcon },
  { name: "Chevron Down", Icon: ChevronDownIcon },
  { name: "Chevron Right", Icon: ChevronRightIcon },
  { name: "Chevron Up", Icon: ChevronUpIcon },
  { name: "Close", Icon: CloseIcon },
  { name: "Compress", Icon: CompressIcon },
  { name: "Correct", Icon: CorrectIcon },
  { name: "Comment", Icon: CommentIcon },
  { name: "Disallowed", Icon: DisallowedIcon },
  { name: "Delete", Icon: DeleteIcon },
  { name: "Document", Icon: DocumentIcon },
  { name: "Drag", Icon: DragIcon },
  { name: "Edit", Icon: EditIcon },
  { name: "Expand", Icon: ExpandIcon },
  { name: "Google View", Icon: GoogleViewIcon },
  { name: "Filter", Icon: FilterIcon },
  { name: "Incorrect", Icon: IncorrectIcon },
  { name: "Indeterminate", Icon: IndeterminateIcon },
  { name: "Information", Icon: InfoIcon },
  { name: "Loading", Icon: LoadingIcon },
  { name: "Map View", Icon: MapViewIcon },
  { name: "More Vert", Icon: MoreVertIcon },
  { name: "New Tab", Icon: NewTabIcon },
  { name: "Placeholder", Icon: PlaceholderIcon },
  { name: "Plus", Icon: PlusIcon },
  { name: "Refresh", Icon: RefreshIcon },
  { name: "Photo Add", Icon: PhotoAddIcon },
  { name: "Photo Library", Icon: PhotoLibraryIcon },
  { name: "Photo", Icon: PhotosIcon },
  { name: "Satellite View", Icon: SatelliteViewIcon },
  { name: "Search", Icon: SearchIcon },
  { name: "Upload", Icon: UploadIcon },
  { name: "Undo", Icon: UndoIcon },
  { name: "User Add", Icon: UserAddIcon },
  { name: "User", Icon: UserIcon },
  { name: "Video", Icon: VideoIcon },
  { name: "Visibility", Icon: VisibilityIcon },
  { name: "Visibility Off", Icon: VisibilityOffIcon },
  { name: "Information Required Simple", Icon: InformationRequiredSimpleIcon },
  { name: "Calendar", Icon: CalendarIcon },
  { name: "Download", Icon: DownloadIcon },
  { name: "Warning", Icon: WarningIcon }
];

const NAVIGATION_SECTIONS_ICONS: IconEntry[] = [
  { name: "Applications", Icon: ApplicationsIcon },
  { name: "Dashboard", Icon: DashboardIcon },
  { name: "Language", Icon: LanguageIcon },
  { name: "Messages", Icon: MessagesIcon },
  { name: "Notification", Icon: NotificationIcon },
  { name: "Nursery", Icon: NurseryIcon },
  { name: "Opportunities", Icon: OpportunitiesIcon },
  { name: "Organization", Icon: OrganizationIcon },
  { name: "Programme", Icon: ProgrammeIcon },
  { name: "Project", Icon: ProjectIcon },
  { name: "Report", Icon: ReportsIcon },
  { name: "Site", Icon: SiteIcon }
];

const STATUS_ICONS: IconEntry[] = [
  { name: "Check / Approved", Icon: CheckApprovedIcon },
  { name: "Draft", Icon: DraftIcon },
  { name: "Due", Icon: DueIcon },
  { name: "Information Required", Icon: InformationRequiredIcon },
  { name: "Nothing Reported", Icon: NothingReportedIcon },
  { name: "Pending", Icon: PendingIcon },
  { name: "Rejected", Icon: RejectedIcon }
];

const ICON_CATEGORIES: IconCategory[] = [
  { title: "Data Visualisation", icons: DATA_VISUALISATION_ICONS },
  { title: "Restoration & Land", icons: RESTORATION_AND_LAND_ICONS },
  { title: "Function", icons: FUNCTION_ICONS },
  { title: "Navigation / Sections", icons: NAVIGATION_SECTIONS_ICONS },
  { title: "Status", icons: STATUS_ICONS }
];

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

const IconGrid = ({ icons }: { icons: IconEntry[] }) => (
  <>
    {icons.map(({ name, Icon }) => (
      <IconWrapper key={name} name={name}>
        <Icon boxSize={8} />
      </IconWrapper>
    ))}
  </>
);

const CategoryColumn = ({ title, icons }: IconCategory) => (
  <Box>
    <CategoryHeader title={title} />
    <VStack align="stretch" gap={4}>
      <IconGrid icons={icons} />
    </VStack>
  </Box>
);

const CategoryStory = ({ title, icons }: IconCategory) => (
  <VStack align="stretch" gap={6}>
    <CategoryHeader title={title} />
    <SimpleGrid columns={[2, 3, 4, 6]} gap={4}>
      <IconGrid icons={icons} />
    </SimpleGrid>
  </VStack>
);

export const AllIcons: Story = {
  render: () => (
    <SimpleGrid columns={5} gap={6}>
      {ICON_CATEGORIES.map(category => (
        <CategoryColumn key={category.title} {...category} />
      ))}
    </SimpleGrid>
  )
};

export const DataVisualisation: Story = {
  render: () => <CategoryStory title="Data Visualisation" icons={DATA_VISUALISATION_ICONS} />
};

export const Function: Story = {
  render: () => <CategoryStory title="Function" icons={FUNCTION_ICONS} />
};

export const RestorationAndLand: Story = {
  render: () => <CategoryStory title="Restoration & Land" icons={RESTORATION_AND_LAND_ICONS} />
};

export const NavigationSections: Story = {
  render: () => <CategoryStory title="Navigation / Sections" icons={NAVIGATION_SECTIONS_ICONS} />
};

export const Status: Story = {
  render: () => <CategoryStory title="Status" icons={STATUS_ICONS} />
};
