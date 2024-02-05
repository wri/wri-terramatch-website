import { Divider, Stack, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
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
import FrameworkSelectionDialog from "@/admin/components/Dialogs/FrameworkSelectionDialog";
import { getCountriesOptions } from "@/constants/options/countries";
import { useFrameworkChoices } from "@/constants/options/frameworks";
import { getChangeRequestStatusOptions, getStatusOptions } from "@/constants/options/status";
import { fetchGetV2AdminENTITYExportFRAMEWORK } from "@/generated/apiComponents";
import { downloadFileBlob } from "@/utils/network";
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

const SiteDataGrid: FC = () => {
  const [frameworkChoices, setFrameworkChoices] = useState<any>([]);
  const fetchData = async () => {
    try {
      const choices = await useFrameworkChoices();
      setFrameworkChoices(choices);
    } catch (error) {
      console.error("Error fetching framework choices:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Datagrid bulkActionButtons={<CustomBulkDeleteWithConfirmButton source="name" />}>
      <TextField source="name" label="Site Name" />
      <TextField source="readable_status" label="Status" sortable={false} />
      <SelectField
        source="update_request_status"
        label="Change Request Status"
        sortable={false}
        choices={optionToChoices(getChangeRequestStatusOptions())}
      />
      <TextField source="project.name" label="Project Name" />
      <DateField source="start_date" label="Establishment" locales="en-GB" />
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

export const SitesList: FC = () => {
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);
  const [frameworkChoices, setFrameworkChoices] = useState<any>([]);
  const fetchData = async () => {
    try {
      const choices = await useFrameworkChoices();
      setFrameworkChoices(choices);
    } catch (error) {
      console.error("Error fetching framework choices:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
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
    <SelectInput key="framework_key" label="Framework" source="framework_key" choices={frameworkChoices} />,
    <SelectInput key="status" label="Status" source="status" choices={optionToChoices(getStatusOptions())} />,
    <SelectInput
      key="update_request_status"
      label="Change Request Status"
      source="update_request_status"
      choices={optionToChoices(getChangeRequestStatusOptions())}
    />,
    <SelectInput
      key="monitoring_data"
      label="Monitored Data"
      source="monitoring_data"
      choices={monitoringDataChoices}
    />
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
        entity: "sites",
        framework
      }
    })
      .then((response: any) => {
        downloadFileBlob(response, `Sites - ${framework}.csv`);
      })
      .finally(() => setExporting(false));

    handleExportClose();
  };

  return (
    <>
      <Stack gap={1} py={2}>
        <Typography variant="h5">Sites</Typography>

        <Divider />
      </Stack>

      <List actions={<ListActions onExport={handleExportOpen} />} filters={filters}>
        <SiteDataGrid />
      </List>

      <FrameworkSelectionDialog open={exportModalOpen} onCancel={handleExportClose} onExport={handleExport} />

      <ExportProcessingAlert show={exporting} />
    </>
  );
};
