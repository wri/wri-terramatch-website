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
  TextField,
  WrapperField
} from "react-admin";

import ListActions from "@/admin/components/Actions/ListActions";
import ExportProcessingAlert from "@/admin/components/Alerts/ExportProcessingAlert";
import CustomBulkDeleteWithConfirmButton from "@/admin/components/Buttons/CustomBulkDeleteWithConfirmButton";
import CustomDeleteWithConfirmButton from "@/admin/components/Buttons/CustomDeleteWithConfirmButton";
import { getCountriesOptions } from "@/constants/options/countries";
import { getChangeRequestStatusOptions, getStatusOptions } from "@/constants/options/status";
import { fetchGetV2AdminENTITYExportFRAMEWORK } from "@/generated/apiComponents";
import { downloadFileBlob } from "@/utils/network";
import { optionToChoices } from "@/utils/options";

import modules from "../..";

const NurseryDataGrid: FC = () => {
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
      <ShowButton />
      <EditButton />
      <WrapperField>
        <CustomDeleteWithConfirmButton source="name" />
      </WrapperField>
    </Datagrid>
  );
};

export const NurseriesList: FC = () => {
  const [exporting, setExporting] = useState<boolean>(false);

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

  const handleExport = () => {
    setExporting(true);

    fetchGetV2AdminENTITYExportFRAMEWORK({
      pathParams: {
        entity: "nurseries",
        framework: "terrafund"
      }
    })
      .then((response: any) => {
        downloadFileBlob(response, "Nurseries - terrafund.csv");
      })
      .finally(() => setExporting(false));
  };

  return (
    <>
      <Stack gap={1} py={2}>
        <Typography variant="h5">Nurseries</Typography>

        <Divider />
      </Stack>

      <List actions={<ListActions onExport={handleExport} />} filters={filters}>
        <NurseryDataGrid />
      </List>

      <ExportProcessingAlert show={exporting} />
    </>
  );
};
