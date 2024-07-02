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
  ShowButton,
  TextField,
  WrapperField
} from "react-admin";

import ListActions from "@/admin/components/Actions/ListActions";
import ExportProcessingAlert from "@/admin/components/Alerts/ExportProcessingAlert";
import CustomBulkDeleteWithConfirmButton from "@/admin/components/Buttons/CustomBulkDeleteWithConfirmButton";
import CustomDeleteWithConfirmButton from "@/admin/components/Buttons/CustomDeleteWithConfirmButton";
import FrameworkSelectionDialog, { useFrameworkExport } from "@/admin/components/Dialogs/FrameworkSelectionDialog";
import ColoredChipFieldArray from "@/admin/components/Fields/ColoredChipFieldArray";
import CustomChipField from "@/admin/components/Fields/CustomChipField";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_BOTTOM_LEFT } from "@/components/elements/Menu/MenuVariant";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { getCountriesOptions } from "@/constants/options/countries";
import { useFrameworkChoices } from "@/constants/options/frameworks";
import { getPolygonsSubmittedTypes } from "@/constants/options/polygonsSubmittedTypes";
import { getChangeRequestStatusOptions, getStatusOptions } from "@/constants/options/status";
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
    render: () => <ShowButton />
  },
  {
    id: "2",
    render: () => <EditButton />
  },
  {
    id: "3",
    render: () => (
      <WrapperField>
        <CustomDeleteWithConfirmButton source="name" />
      </WrapperField>
    )
  }
];

const SiteDataGrid: FC = () => {
  const frameworkChoices = useFrameworkChoices();

  return (
    <Datagrid bulkActionButtons={<CustomBulkDeleteWithConfirmButton source="name" />}>
      <TextField source="name" label="Site Name" />
      <CustomChipField source="readable_status" label="Status" sortable={false} />
      <ColoredChipFieldArray
        source="status"
        label="Polygon Submitted"
        choices={optionToChoices(getPolygonsSubmittedTypes())}
      />
      <TextField source="project.name" label="Project Name" />
      <DateField source="start_date" label="Date Created" locales="en-GB" />
      <FunctionField
        source="framework_key"
        label="Framework"
        render={(record: any) =>
          frameworkChoices.find((framework: any) => framework.id === record?.framework_key)?.name ||
          record?.framework_key
        }
        sortable={false}
      />
      <Menu menu={tableMenu} placement={MENU_PLACEMENT_BOTTOM_LEFT}>
        <Icon name={IconNames.ELIPSES} className="h-6 w-6 rounded-full p-1 hover:bg-neutral-200"></Icon>
      </Menu>
    </Datagrid>
  );
};

export const SitesList: FC = () => {
  const frameworkChoices = useFrameworkChoices();
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
      choices={frameworkChoices}
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
    />
  ];

  const { exporting, openExportDialog, frameworkDialogProps } = useFrameworkExport("sites");

  return (
    <>
      <Stack gap={1} className="pb-6">
        <Text variant="text-36-bold" className="leading-none">
          Sites
        </Text>
      </Stack>

      <List actions={<ListActions onExport={openExportDialog} />} filters={filters}>
        <SiteDataGrid />
      </List>

      <FrameworkSelectionDialog {...frameworkDialogProps} />

      <ExportProcessingAlert show={exporting} />
    </>
  );
};
