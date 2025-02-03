import { Stack } from "@mui/material";
import { FC } from "react";
import {
  AutocompleteInput,
  Datagrid,
  EditButton,
  List,
  ReferenceInput,
  SearchInput,
  SelectInput,
  TextField,
  WrapperField
} from "react-admin";

import ListActionsImpactStories from "@/admin/components/Actions/ListActionsImpactStories";
import ExportProcessingAlert from "@/admin/components/Alerts/ExportProcessingAlert";
import CustomDeleteWithConfirmButton from "@/admin/components/Buttons/CustomDeleteWithConfirmButton";
import FrameworkSelectionDialog, { useFrameworkExport } from "@/admin/components/Dialogs/FrameworkSelectionDialog";
import ChipFieldArray from "@/admin/components/Fields/ChipFieldArray";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_BOTTOM_LEFT } from "@/components/elements/Menu/MenuVariant";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { getCountriesOptions } from "@/constants/options/countries";
import { getChangeRequestStatusOptions, getPolygonOptions, getStatusOptions } from "@/constants/options/status";
import { useUserFrameworkChoices } from "@/constants/options/userFrameworksChoices";
import { optionToChoices } from "@/utils/options";

import modules from "../..";

const IMPACT_STORY_TAGS = [
  { id: "1", label: "ppc" },
  { id: "2", label: "project-tag" }
];

const monitoringDataChoices = [
  {
    id: "0",
    name: "No"
  },
  {
    id: "1",
    name: "Yes"
  }
];
const tableMenu = [
  {
    id: "1",
    render: () => <EditButton />
  },
  {
    id: "2",
    render: () => (
      <WrapperField>
        <CustomDeleteWithConfirmButton source="name" />
      </WrapperField>
    )
  }
];

const ImpactStoriesDataGrid: FC = () => {
  const mockData = [
    {
      id: 1,
      name: "Community Climate Ambassador Training",
      project: "Faja Lobi reforestation project",
      author: "Faja Lobi",
      tags: [
        { status: "Approved", count: 2 },
        { status: "Draft", count: 1 }
      ],
      date: "3/3/2020"
    },
    {
      id: 2,
      name: "Native Seed Centre Shrub SPA",
      project: "Faja Lobi reforestation project",
      author: "Faja Lobi",
      tags: [{ status: "Submitted", count: 3 }],
      date: "3/3/2020"
    },
    {
      id: 3,
      name: "Mangrove Restoration Initiative",
      project: "Coastal Conservation Project",
      author: "Marine Solutions",
      tags: [{ status: "Approved", count: 4 }],
      date: "5/15/2020"
    },
    {
      id: 4,
      name: "Indigenous Knowledge Integration",
      project: "Amazon Rainforest Protection",
      author: "Rainforest Alliance",
      tags: [
        { status: "Draft", count: 2 },
        { status: "Submitted", count: 1 }
      ],
      date: "6/22/2020"
    },
    {
      id: 5,
      name: "Urban Garden Development",
      project: "City Green Spaces Initiative",
      author: "Urban Planners Co",
      tags: [{ status: "Approved", count: 5 }],
      date: "8/1/2020"
    },
    {
      id: 6,
      name: "Sustainable Farming Practices",
      project: "Agricultural Transformation",
      author: "Farm Solutions",
      tags: [{ status: "Submitted", count: 2 }],
      date: "9/12/2020"
    },
    {
      id: 7,
      name: "Wildlife Corridor Creation",
      project: "Biodiversity Protection Plan",
      author: "Wildlife Trust",
      tags: [
        { status: "Approved", count: 3 },
        { status: "Draft", count: 1 }
      ],
      date: "10/30/2020"
    },
    {
      id: 8,
      name: "Clean Water Initiative",
      project: "River Restoration Project",
      author: "Water Resources Inc",
      tags: [{ status: "Draft", count: 4 }],
      date: "11/15/2020"
    },
    {
      id: 9,
      name: "Solar Power Implementation",
      project: "Renewable Energy Drive",
      author: "Green Energy Co",
      tags: [
        { status: "Submitted", count: 2 },
        { status: "Approved", count: 1 }
      ],
      date: "12/5/2020"
    },
    {
      id: 10,
      name: "Forest Fire Prevention Program",
      project: "Forest Protection Initiative",
      author: "Forest Guard",
      tags: [{ status: "Approved", count: 6 }],
      date: "1/20/2021"
    },
    {
      id: 11,
      name: "Coastal Mangrove Restoration",
      project: "Marine Ecosystem Protection",
      author: "Ocean Conservation Group",
      tags: [
        { status: "Draft", count: 3 },
        { status: "Submitted", count: 2 }
      ],
      date: "2/15/2021"
    },
    {
      id: 12,
      name: "Urban Beekeeping Program",
      project: "City Pollinator Initiative",
      author: "Bee Friendly Society",
      tags: [{ status: "Submitted", count: 4 }],
      date: "3/1/2021"
    }
  ];

  return (
    <Datagrid data={mockData}>
      <TextField source="name" label="Impact Story" />
      <TextField source="project" label="Project" />
      <TextField source="author" label="Author" />
      <ChipFieldArray source="tags" label="Tags" data={IMPACT_STORY_TAGS} />
      <TextField source="date" label="Date Created" />
      <Menu menu={tableMenu} placement={MENU_PLACEMENT_BOTTOM_LEFT}>
        <Icon name={IconNames.ELIPSES} className="h-6 w-6 rounded-full p-1 hover:bg-neutral-200"></Icon>
      </Menu>
    </Datagrid>
  );
};

export const ImpactStoriesList: FC = () => {
  const frameworkInputChoices = useUserFrameworkChoices();

  const filters = [
    <SearchInput key="search" source="search" alwaysOn className="search-page-admin" />,
    <SelectInput
      key="country"
      label="Country"
      source="country"
      choices={optionToChoices(getCountriesOptions())}
      className="select-page-admin"
    />,
    <ReferenceInput
      key="organisation"
      source="organisation_uuid"
      reference={modules.organisation.ResourceName}
      label="Organization"
      sort={{
        field: "name",
        order: "ASC"
      }}
    >
      <AutocompleteInput optionText="name" label="Organization" className="select-page-admin" />
    </ReferenceInput>,
    <ReferenceInput
      key="project"
      source="project_uuid"
      reference={modules.project.ResourceName}
      label="Project"
      sort={{
        field: "name",
        order: "ASC"
      }}
    >
      <AutocompleteInput optionText="name" label="Project" className="select-page-admin" />
    </ReferenceInput>,
    <SelectInput
      key="framework_key"
      label="Framework"
      source="framework_key"
      choices={frameworkInputChoices}
      className="select-page-admin"
    />,
    <SelectInput
      key="status"
      label="Status"
      source="status"
      choices={optionToChoices(getStatusOptions())}
      className="select-page-admin"
    />,
    <SelectInput
      key="update_request_status"
      label="Change Request"
      source="update_request_status"
      choices={optionToChoices(getChangeRequestStatusOptions())}
      className="select-page-admin"
    />,
    <SelectInput
      key="monitoring_data"
      label="Monitored Data"
      source="monitoring_data"
      choices={monitoringDataChoices}
      className="select-page-admin"
    />,
    <SelectInput
      key="polygon"
      label="Polygon"
      source="polygon"
      choices={optionToChoices(getPolygonOptions())}
      className="select-page-admin"
    />
  ];

  const { exporting, onClickExportButton, frameworkDialogProps } = useFrameworkExport("sites", frameworkInputChoices);

  return (
    <>
      <Stack gap={1} className="pb-6">
        <Text variant="text-36-bold" className="leading-none">
          Impact Stories
        </Text>
      </Stack>

      <List actions={<ListActionsImpactStories onExport={onClickExportButton} />} filters={filters}>
        <ImpactStoriesDataGrid />
      </List>

      <FrameworkSelectionDialog {...frameworkDialogProps} />

      <ExportProcessingAlert show={exporting} />
    </>
  );
};
