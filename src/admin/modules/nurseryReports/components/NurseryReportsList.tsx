import { Divider, Stack, Typography } from "@mui/material";
import { FC, useState } from "react";
import {
  AutocompleteInput,
  Datagrid,
  DateField,
  EditButton,
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
import { getCountriesOptions } from "@/constants/options/countries";
import { getChangeRequestStatusOptions, getReportStatusOptions } from "@/constants/options/status";
import { fetchGetV2AdminENTITYExportFRAMEWORK } from "@/generated/apiComponents";
import { downloadFileBlob } from "@/utils/network";
import { optionToChoices } from "@/utils/options";

import modules from "../..";

const NurseryReportDataGrid: FC = () => {
  return (
    <Datagrid bulkActionButtons={<CustomBulkDeleteWithConfirmButton source="title" />}>
      <TextField source="nursery.name" label="Nursery Name" sortable={false} />
      <TextField source="readable_status" label="Status" sortable={false} />
      <SelectField
        source="update_request_status"
        label="Change Request Status"
        sortable={false}
        choices={optionToChoices(getChangeRequestStatusOptions())}
      />
      <TextField source="project.name" label="Project" />
      <TextField source="organisation.name" label="Organization" />
      <DateField source="due_at" label="Due Date" />
      <DateField source="updated_at" label="Last Updated" />
      <DateField source="submitted_at" label="Date Submitted" />
      <ShowButton />
      <EditButton />
    </Datagrid>
  );
};

export const NurseryReportsList: FC = () => {
  const [exporting, setExporting] = useState<boolean>(false);

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
      key="nursery"
      source="nursery_uuid"
      reference={modules.nursery.ResourceName}
      label="Nursery"
      sort={{
        field: "name",
        order: "ASC"
      }}
    >
      <AutocompleteInput optionText="name" label="Nursery" />
    </ReferenceInput>,
    <SelectInput key="country" label="Country" source="country" choices={optionToChoices(getCountriesOptions())} />,
    <SelectInput key="status" label="Status" source="status" choices={optionToChoices(getReportStatusOptions())} />,
    <SelectInput
      key="update_request_status"
      label="Change Request Status"
      source="update_request_status"
      choices={optionToChoices(getChangeRequestStatusOptions())}
    />
  ];

  const handleExport = () => {
    setExporting(true);

    fetchGetV2AdminENTITYExportFRAMEWORK({
      pathParams: {
        entity: "nursery-reports",
        framework: "terrafund"
      }
    })
      .then((response: any) => {
        downloadFileBlob(response, "Nursery Reports - terrafund.csv");
      })
      .finally(() => setExporting(false));
  };

  return (
    <>
      <Stack gap={1} py={2}>
        <Typography variant="h5">Nursery Reports</Typography>

        <Divider />
      </Stack>

      <List actions={<ListActions onExport={handleExport} />} filters={filters}>
        <NurseryReportDataGrid />
      </List>

      <ExportProcessingAlert show={exporting} />
    </>
  );
};
