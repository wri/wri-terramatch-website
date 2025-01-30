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

import ListActions from "@/admin/components/Actions/ListActions";
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
import QuillEditor from "./QuillEditor";

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

      <List actions={<ListActions onExport={onClickExportButton} />} filters={filters}>
        <ImpactStoriesDataGrid />
      </List>
      <QuillEditor />

      <FrameworkSelectionDialog {...frameworkDialogProps} />

      <ExportProcessingAlert show={exporting} />
    </>
  );
};
