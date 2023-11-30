import { Divider, Stack, Typography } from "@mui/material";
import { FC, useState } from "react";
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
import FrameworkSelectionDialog from "@/admin/components/Dialogs/FrameworkSelectionDialog";
import { getCountriesOptions } from "@/constants/options/countries";
import { frameworkChoices } from "@/constants/options/frameworks";
import { getChangeRequestStatusOptions, getReportStatusOptions } from "@/constants/options/status";
import { fetchGetV2AdminENTITYExportFRAMEWORK } from "@/generated/apiComponents";
import { downloadFileBlob } from "@/utils";
import { optionToChoices } from "@/utils/options";

import modules from "../..";

const ProjectReportDataGrid: FC = () => {
  return (
    <Datagrid bulkActionButtons={<CustomBulkDeleteWithConfirmButton source="title" />}>
      <TextField source="title" label="Report Name" />
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
          frameworkChoices.find(framework => framework.id === record?.framework_key)?.name || record?.framework_key
        }
        sortable={false}
      />
      <TextField source="organisation.name" label="Organization" />
      <DateField source="due_at" label="Due Date" />
      <DateField source="updated_at" label="Last Updated" />
      <DateField source="submitted_at" label="Date Submitted" />
      <ShowButton />
      <EditButton />
    </Datagrid>
  );
};

export const ProjectReportsList: FC = () => {
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
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

  const handleExportOpen = () => {
    setExportModalOpen(true);
  };

  const handleExportClose = () => {
    setExportModalOpen(false);
  };

  const handleExport = (framework: string) => {
    setExporting(true);

    fetchGetV2AdminENTITYExportFRAMEWORK({
      pathParams: {
        entity: "project-reports",
        framework
      }
    })
      .then((response: any) => {
        downloadFileBlob(response, `Project Reports - ${framework}.csv`);
      })
      .finally(() => setExporting(false));

    handleExportClose();
  };

  return (
    <>
      <Stack gap={1} py={2}>
        <Typography variant="h5">Project Reports</Typography>

        <Divider />
      </Stack>

      <List actions={<ListActions onExport={handleExportOpen} />} filters={filters}>
        <ProjectReportDataGrid />
      </List>

      <FrameworkSelectionDialog open={exportModalOpen} onCancel={handleExportClose} onExport={handleExport} />

      <ExportProcessingAlert show={exporting} />
    </>
  );
};
