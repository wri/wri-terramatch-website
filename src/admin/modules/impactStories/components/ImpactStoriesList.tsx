import { Stack } from "@mui/material";
import { FC } from "react";
import {
  AutocompleteInput,
  Datagrid,
  DateField,
  EditButton,
  FunctionField,
  List,
  ReferenceInput,
  SearchInput,
  SelectInput,
  TextField,
  WrapperField
} from "react-admin";

import ListActionsImpactStories from "@/admin/components/Actions/ListActionsImpactStories";
import CustomDeleteWithConfirmButton from "@/admin/components/Buttons/CustomDeleteWithConfirmButton";
import CustomChipField from "@/admin/components/Fields/CustomChipField";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_BOTTOM_LEFT } from "@/components/elements/Menu/MenuVariant";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { getCountriesOptions } from "@/constants/options/countries";
import { getChangeRequestStatusOptions, getPolygonOptions, getStatusOptions } from "@/constants/options/status";
import { useUserFrameworkChoices } from "@/constants/options/userFrameworksChoices";
import { optionToChoices } from "@/utils/options";

import modules from "../..";

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
    render: () => {
      return (
        <WrapperField>
          <CustomDeleteWithConfirmButton source="title" />
        </WrapperField>
      );
    }
  }
];

const ImpactStoriesDataGrid: FC = () => {
  return (
    <Datagrid>
      <TextField source="title" label="Impact Story" />
      <FunctionField
        source="status"
        label="Status"
        render={(record: any) => {
          return <CustomChipField label={record.status} />;
        }}
      />
      <TextField source="organization.name" label="Organization" />
      <FunctionField
        source="organization.countries"
        label="Country"
        render={(record: any) =>
          record.organization?.countries?.length > 0
            ? record.organization.countries.map((c: any) => c.label).join(", ")
            : "No country"
        }
      />
      <DateField source="created_at" label="Date Created" locales="en-GB" />
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

  return (
    <>
      <Stack gap={1} className="pb-6">
        <Text variant="text-36-bold" className="leading-none">
          Impact Stories
        </Text>
      </Stack>

      <List actions={<ListActionsImpactStories />} filters={filters}>
        <ImpactStoriesDataGrid />
      </List>
    </>
  );
};
