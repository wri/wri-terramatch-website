import { Divider, Stack, Typography } from "@mui/material";
import { FC } from "react";
import {
  AutocompleteInput,
  BooleanField,
  Datagrid,
  DateField,
  EditButton,
  FunctionField,
  List,
  ReferenceInput,
  SearchInput,
  SelectField,
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
import { getCountriesOptions } from "@/constants/options/countries";
import { useFrameworkChoices } from "@/constants/options/frameworks";
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

const ProjectDataGrid = () => {
  const frameworkChoices = useFrameworkChoices();

  return (
    <Datagrid bulkActionButtons={<CustomBulkDeleteWithConfirmButton source="name" />}>
      <TextField source="name" label="Project Name" />
      <TextField source="readable_status" label="Status" sortable={false} />
      <SelectField
        source="update_request_status"
        label="Change Request Status"
        sortable={false}
        choices={optionToChoices(getChangeRequestStatusOptions())}
      />
      <TextField source="organisation.name" label="Organization" />
      <DateField source="planting_start_date" label="Establishment" locales="en-GB" />
      <FunctionField
        source="framework_key"
        label="Framework"
        render={(record: any) =>
          frameworkChoices.find((framework: any) => framework.id === record?.framework_key)?.name ||
          record?.framework_key
        }
        sortable={false}
      />
      <BooleanField source="has_monitoring_data" label="Monitored Data" sortable={false} looseValue />
      <ShowButton />
      <EditButton />
      <WrapperField>
        <CustomDeleteWithConfirmButton source="name" />
      </WrapperField>
    </Datagrid>
  );
};

export const ProjectsList: FC = () => {
  const frameworkChoices = useFrameworkChoices();

  const filters = [
    <SearchInput key="search" source="search" alwaysOn />,
    <SelectInput key="country" label="Country" source="country" choices={optionToChoices(getCountriesOptions())} />,
    <SelectInput
      key="monitoring_data"
      label="Monitored Data"
      source="monitoring_data"
      choices={monitoringDataChoices}
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
      <AutocompleteInput optionText="name" label="Organization" />
    </ReferenceInput>,
    <SelectInput key="status" label="Status" source="status" choices={optionToChoices(getStatusOptions())} />,
    <SelectInput
      key="update_request_status"
      label="Change Request Status"
      source="update_request_status"
      choices={optionToChoices(getChangeRequestStatusOptions())}
    />,
    <SelectInput key="framework_key" label="Framework" source="framework_key" choices={frameworkChoices} />
  ];

  const { exporting, openExportDialog, frameworkDialogProps } = useFrameworkExport("projects");

  return (
    <>
      <Stack gap={1} py={2}>
        <Typography variant="h5">Projects</Typography>

        <Divider />
      </Stack>

      <List actions={<ListActions onExport={openExportDialog} />} filters={filters}>
        <ProjectDataGrid />
      </List>

      <FrameworkSelectionDialog {...frameworkDialogProps} />

      <ExportProcessingAlert show={exporting} />
    </>
  );
};
