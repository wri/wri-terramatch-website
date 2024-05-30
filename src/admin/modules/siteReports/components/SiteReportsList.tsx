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
  TextField
} from "react-admin";

import ListActions from "@/admin/components/Actions/ListActions";
import ExportProcessingAlert from "@/admin/components/Alerts/ExportProcessingAlert";
import CustomBulkDeleteWithConfirmButton from "@/admin/components/Buttons/CustomBulkDeleteWithConfirmButton";
import FrameworkSelectionDialog, { useFrameworkExport } from "@/admin/components/Dialogs/FrameworkSelectionDialog";
import { getCountriesOptions } from "@/constants/options/countries";
import { useFrameworkChoices } from "@/constants/options/frameworks";
import { getChangeRequestStatusOptions, getReportStatusOptions } from "@/constants/options/status";
import { optionToChoices } from "@/utils/options";

import modules from "../..";

const SiteReportDataGrid: FC = () => {
  const frameworkChoices = useFrameworkChoices();

  return (
    <Datagrid bulkActionButtons={<CustomBulkDeleteWithConfirmButton source="title" />}>
      <TextField source="site.name" label="Site Name" sortable={false} />
      <TextField source="readable_status" label="Status" sortable={false} />
      <SelectField
        source="update_request_status"
        label="Change Request Status"
        sortable={false}
        choices={optionToChoices(getChangeRequestStatusOptions())}
      />
      <TextField source="project.name" label="Project" />
      <FunctionField
        source="framework_key"
        label="Framework"
        render={(record: any) =>
          frameworkChoices.find((framework: any) => framework.id === record?.framework_key)?.name ||
          record?.framework_key
        }
        sortable={false}
      />
      <TextField source="organisation.name" label="Organization" />
      <DateField source="due_at" label="Due Date" locales="en-GB" />
      <DateField source="updated_at" label="Last Updated" locales="en-GB" />
      <DateField source="submitted_at" label="Date Submitted" locales="en-GB" />
      <ShowButton />
      <EditButton />
    </Datagrid>
  );
};

export const SiteReportsList: FC = () => {
  const frameworkChoices = useFrameworkChoices();

  const filters = [
    <SearchInput key="search" source="search" alwaysOn />,
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
    </ReferenceInput>,
    <ReferenceInput
      key="site"
      source="site_uuid"
      reference={modules.site.ResourceName}
      label="Site"
      sort={{
        field: "name",
        order: "ASC"
      }}
    >
      <AutocompleteInput optionText="name" label="Site" />
    </ReferenceInput>,
    <SelectInput key="country" label="Country" source="country" choices={optionToChoices(getCountriesOptions())} />,
    <SelectInput key="status" label="Status" source="status" choices={optionToChoices(getReportStatusOptions())} />,
    <SelectInput
      key="update_request_status"
      label="Change Request Status"
      source="update_request_status"
      choices={optionToChoices(getChangeRequestStatusOptions())}
    />,
    <SelectInput key="framework_key" label="Framework" source="framework_key" choices={frameworkChoices} />
  ];

  const { exporting, openExportDialog, frameworkDialogProps } = useFrameworkExport("site-reports");

  return (
    <>
      <Stack gap={1} py={2}>
        <Typography variant="h5">Site Reports</Typography>

        <Divider />
      </Stack>

      <List actions={<ListActions onExport={openExportDialog} />} filters={filters}>
        <SiteReportDataGrid />
      </List>

      <FrameworkSelectionDialog {...frameworkDialogProps} />

      <ExportProcessingAlert show={exporting} />
    </>
  );
};
