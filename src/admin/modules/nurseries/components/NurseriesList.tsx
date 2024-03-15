import { Stack } from "@mui/material";
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
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_BOTTOM_LEFT } from "@/components/elements/Menu/MenuVariant";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { getCountriesOptions } from "@/constants/options/countries";
import { getChangeRequestStatusOptions, getStatusOptions } from "@/constants/options/status";
import { fetchGetV2AdminENTITYExportFRAMEWORK } from "@/generated/apiComponents";
import { downloadFileBlob } from "@/utils/network";
import { optionToChoices } from "@/utils/options";

import modules from "../..";

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
      <Menu menu={tableMenu} placement={MENU_PLACEMENT_BOTTOM_LEFT}>
        <Icon name={IconNames.ELIPSES} className="h-6 w-6 rounded-full p-1 hover:bg-neutral-200"></Icon>
      </Menu>
    </Datagrid>
  );
};

export const NurseriesList: FC = () => {
  const [exporting, setExporting] = useState<boolean>(false);

  const filters = [
    <SearchInput key="search" source="search" alwaysOn className="search-pa" />,
    <SelectInput
      key="country"
      label="Country"
      source="country"
      choices={optionToChoices(getCountriesOptions())}
      className="select-pa"
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
      <AutocompleteInput optionText="name" label="Organization" className="select-pa" />
    </ReferenceInput>,
    <SelectInput
      key="status"
      label="Status"
      source="status"
      choices={optionToChoices(getStatusOptions())}
      className="select-pa"
    />,
    <SelectInput
      key="update_request_status"
      label="Change Request Status"
      source="update_request_status"
      choices={optionToChoices(getChangeRequestStatusOptions())}
      className="select-pa"
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
      <AutocompleteInput optionText="name" label="Project" className="select-pa" />
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
      <Stack gap={1} className="pb-6">
        <Text variant="text-36-bold" className="leading-none">
          Nurseries
        </Text>
      </Stack>

      <List actions={<ListActions onExport={handleExport} />} filters={filters}>
        <NurseryDataGrid />
      </List>

      <ExportProcessingAlert show={exporting} />
    </>
  );
};
