import { Stack } from "@mui/material";
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
import CustomChipField from "@/admin/components/Fields/CustomChipField";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_BOTTOM_LEFT } from "@/components/elements/Menu/MenuVariant";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
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

const ProjectDataGrid = () => {
  const frameworkChoices = useFrameworkChoices();

  return (
    <Datagrid bulkActionButtons={<CustomBulkDeleteWithConfirmButton source="name" />} rowClick={"show"}>
      <TextField source="name" label="Project Name" />
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
      <Menu menu={tableMenu} placement={MENU_PLACEMENT_BOTTOM_LEFT}>
        <Icon name={IconNames.ELIPSES} className="h-6 w-6 rounded-full p-1 hover:bg-neutral-200"></Icon>
      </Menu>
    </Datagrid>
  );
};

export const ProjectsList: FC = () => {
  const frameworkChoices = useFrameworkChoices();

  const filters = [
    <SearchInput key="search" source="search" alwaysOn className="search-page-admin" />,
    <SelectInput
      key="country"
      label="Country"
      source="country"
      className="select-page-admin"
      choices={optionToChoices(getCountriesOptions())}
    />,
    <SelectInput
      key="monitoring_data"
      label="Monitored Data"
      source="monitoring_data"
      className="select-page-admin"
      choices={monitoringDataChoices}
    />,
    <ReferenceInput
      key="organisation"
      source="organisation_uuid"
      reference={modules.organisation.ResourceName}
      label="Organization"
      className="select-page-admin"
      sort={{
        field: "name",
        order: "ASC"
      }}
    >
      <AutocompleteInput optionText="name" label="Organization" className="select-page-admin" />
    </ReferenceInput>,
    <SelectInput
      key="status"
      label="Status"
      source="status"
      choices={optionToChoices(getStatusOptions())}
      className="select-page-admin"
    />,
    <SelectInput
      key="update_request_status"
      className="select-page-admin"
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

  const { exporting, openExportDialog, frameworkDialogProps } = useFrameworkExport("projects");

  return (
    <>
      <Stack gap={1} className="pb-6">
        <Text variant="text-36-bold" className="leading-none">
          Projects
        </Text>
      </Stack>

      <List actions={<ListActions onExport={openExportDialog} />} filters={filters}>
        <ProjectDataGrid />
      </List>

      <FrameworkSelectionDialog {...frameworkDialogProps} />

      <ExportProcessingAlert show={exporting} />
    </>
  );
};
