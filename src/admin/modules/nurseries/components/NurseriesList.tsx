import { Divider, Stack, Typography } from "@mui/material";
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

const NurseryDataGrid: FC = () => {
  const frameworkChoices = useFrameworkChoices();

  return (
    <Datagrid bulkActionButtons={<CustomBulkDeleteWithConfirmButton source="name" />}>
      <TextField source="name" label="Nursery Name" />
      <TextField source="readable_status" label="Status" sortable={false} />
      <SelectField
        source="update_request_status"
        label="Change Request Status"
        sortable={false}
        choices={optionToChoices(getChangeRequestStatusOptions())}
      />
      <TextField source="project.name" label="Project Name" />
      <TextField source="organisation.name" label="Organization" />
      <DateField source="start_date" label="Establishment" locales="en-GB" />
      <FunctionField
        source="framework_key"
        label="Framework"
        render={(record: any) =>
          frameworkChoices.find((framework: any) => framework.id === record?.framework_key)?.name ??
          record?.framework_key
        }
        sortable={false}
      />
      <ShowButton />
      <EditButton />
      <WrapperField>
        <CustomDeleteWithConfirmButton source="name" />
      </WrapperField>
    </Datagrid>
  );
};

export const NurseriesList: FC = () => {
  const frameworkChoices = useFrameworkChoices();

  const filters = [
    <SearchInput key="search" source="search" alwaysOn />,
    <SelectInput key="country" label="Country" source="country" choices={optionToChoices(getCountriesOptions())} />,
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
    <SelectInput key="framework_key" label="Framework" source="framework_key" choices={frameworkChoices} />,
    <SelectInput key="status" label="Status" source="status" choices={optionToChoices(getStatusOptions())} />,
    <SelectInput
      key="update_request_status"
      label="Change Request Status"
      source="update_request_status"
      choices={optionToChoices(getChangeRequestStatusOptions())}
    />,
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
      <AutocompleteInput optionText="name" label="Project" />
    </ReferenceInput>
  ];

  const { exporting, openExportDialog, frameworkDialogProps } = useFrameworkExport("nurseries");

  return (
    <>
      <Stack gap={1} py={2}>
        <Typography variant="h5">Nurseries</Typography>

        <Divider />
      </Stack>

      <List actions={<ListActions onExport={openExportDialog} />} filters={filters}>
        <NurseryDataGrid />
      </List>

      <FrameworkSelectionDialog {...frameworkDialogProps} />

      <ExportProcessingAlert show={exporting} />
    </>
  );
};
