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
  TextField
} from "react-admin";

import ListActions from "@/admin/components/Actions/ListActions";
import ExportProcessingAlert from "@/admin/components/Alerts/ExportProcessingAlert";
import CustomBulkDeleteWithConfirmButton from "@/admin/components/Buttons/CustomBulkDeleteWithConfirmButton";
import FrameworkSelectionDialog, { useFrameworkExport } from "@/admin/components/Dialogs/FrameworkSelectionDialog";
import CustomChipField from "@/admin/components/Fields/CustomChipField";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_BOTTOM_LEFT } from "@/components/elements/Menu/MenuVariant";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { getCountriesOptions } from "@/constants/options/countries";
import { useFrameworkChoices } from "@/constants/options/frameworks";
import { getChangeRequestStatusOptions, getReportStatusOptions } from "@/constants/options/status";
import { optionToChoices } from "@/utils/options";

import modules from "../..";

const ProjectReportDataGrid: FC = () => {
  const frameworkChoices = useFrameworkChoices();

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
      <FunctionField
        source="readable_status"
        label="Status"
        sortable={false}
        render={(record: any) => <CustomChipField label={record.readable_status} />}
      />
      <FunctionField
        source="update_request_status"
        label="Change Request Status"
        sortable={false}
        render={(record: any) => {
          const readableChangeRequestStatus = getChangeRequestStatusOptions().find(
            (option: any) => option.value === record.update_request_status
          );
          return <CustomChipField label={readableChangeRequestStatus?.title} />;
        }}
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
      <Menu menu={tableMenu} placement={MENU_PLACEMENT_BOTTOM_LEFT} classNameContentMenu="!sticky">
        <Icon name={IconNames.ELIPSES} className="h-6 w-6 rounded-full p-1 hover:bg-neutral-200"></Icon>
      </Menu>
    </Datagrid>
  );
};

export const ProjectReportsList: FC = () => {
  const frameworkChoices = useFrameworkChoices();
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
      className="select-page-admin"
    />,
    <SelectInput
      key="framework_key"
      label="Framework"
      source="framework_key"
      choices={frameworkChoices}
      className="select-page-admin"
    />
  ];

  const { exporting, openExportDialog, frameworkDialogProps } = useFrameworkExport("project-reports");

  return (
    <>
      <Stack gap={1} className="pb-6">
        <Text variant="text-36-bold" className="leading-none">
          Project Reports
        </Text>
      </Stack>

      <List actions={<ListActions onExport={openExportDialog} />} filters={filters}>
        <ProjectReportDataGrid />
      </List>

      <FrameworkSelectionDialog {...frameworkDialogProps} />

      <ExportProcessingAlert show={exporting} />
    </>
  );
};
