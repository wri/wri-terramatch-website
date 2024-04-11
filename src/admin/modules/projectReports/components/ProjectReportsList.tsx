import { Stack } from "@mui/material";
import { FC, useEffect, useState } from "react";
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
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_BOTTOM_LEFT } from "@/components/elements/Menu/MenuVariant";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { getCountriesOptions } from "@/constants/options/countries";
import { useFrameworkChoices } from "@/constants/options/frameworks";
import { getChangeRequestStatusOptions, getReportStatusOptions } from "@/constants/options/status";
import { fetchGetV2AdminENTITYExportFRAMEWORK } from "@/generated/apiComponents";
import { downloadFileBlob } from "@/utils/network";
import { optionToChoices } from "@/utils/options";

import modules from "../..";

const ProjectReportDataGrid: FC = () => {
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

  const tableMenu = [
    {
      id: "1",
      render: () => <ShowButton />
    },
    {
      id: "2",
      render: () => <EditButton />
    }
  ];
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
          frameworkChoices.find((framework: any) => framework.id === record?.framework_key)?.name ||
          record?.framework_key
        }
        sortable={false}
      />
      <TextField source="organisation.name" label="Organization" />
      <DateField source="due_at" label="Due Date" locales="en-GB" />
      <DateField source="updated_at" label="Last Updated" locales="en-GB" />
      <DateField source="submitted_at" label="Date Submitted" locales="en-GB" />
      <Menu menu={tableMenu} placement={MENU_PLACEMENT_BOTTOM_LEFT}>
        <Icon name={IconNames.ELIPSES} className="h-6 w-6 rounded-full p-1 hover:bg-neutral-200"></Icon>
      </Menu>
    </Datagrid>
  );
};

export const ProjectReportsList: FC = () => {
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
    <SearchInput key="search" source="search" alwaysOn className="search-page-admin" />,
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
      key="country"
      label="Country"
      source="country"
      choices={optionToChoices(getCountriesOptions())}
      className="select-page-admin"
    />,
    <SelectInput
      key="status"
      label="Status"
      source="status"
      choices={optionToChoices(getReportStatusOptions())}
      className="select-page-admin"
    />,
    <SelectInput
      key="update_request_status"
      label="Change Request Status"
      source="update_request_status"
      choices={optionToChoices(getChangeRequestStatusOptions())}
    />,
    <SelectInput
      key="framework_key"
      label="Framework"
      source="framework_key"
      choices={frameworkChoices}
      className="select-page-admin"
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
      <Stack gap={1} className="pb-6">
        <Text variant="text-36-bold" className="leading-none">
          Project Reports
        </Text>
      </Stack>

      <List actions={<ListActions onExport={handleExportOpen} />} filters={filters}>
        <ProjectReportDataGrid />
      </List>

      <FrameworkSelectionDialog open={exportModalOpen} onCancel={handleExportClose} onExport={handleExport} />

      <ExportProcessingAlert show={exporting} />
    </>
  );
};
