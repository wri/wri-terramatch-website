import { Stack } from "@mui/material";
import { FC } from "react";
import {
  AutocompleteInput,
  Datagrid,
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
import ColoredChipFieldArray from "@/admin/components/Fields/ColoredChipFieldArray";
import CustomChipField from "@/admin/components/Fields/CustomChipField";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_BOTTOM_LEFT } from "@/components/elements/Menu/MenuVariant";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useGadmChoices } from "@/connections/Gadm";
import { getPolygonsSubmittedTypes } from "@/constants/options/polygonsSubmittedTypes";
import { getChangeRequestStatusOptions, getPolygonOptions, getStatusOptions } from "@/constants/options/status";
import { useUserFrameworkChoices } from "@/constants/options/userFrameworksChoices";
import { SiteLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
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

const SiteDataGrid: FC = () => {
  const frameworkInputChoices = useUserFrameworkChoices();

  return (
    <Datagrid bulkActionButtons={<CustomBulkDeleteWithConfirmButton source="name" />} rowClick={"show"}>
      <TextField source="name" label="Site Name" />
      <FunctionField
        source="status"
        label="Status"
        sortable={false}
        render={({ status }: SiteLightDto) => {
          const { title } = getStatusOptions().find((option: any) => option.value === status) ?? {};
          return <CustomChipField label={title} />;
        }}
      />
      <FunctionField
        source="updateRequestStatus"
        label="Change Request"
        sortable={false}
        render={(record: any) => {
          const readableChangeRequestStatus = getChangeRequestStatusOptions().find(
            (option: any) => option.value === record.updateRequestStatus
          );
          return <CustomChipField label={readableChangeRequestStatus?.title} />;
        }}
      />
      <ColoredChipFieldArray
        source="status"
        label="Polygon Submitted"
        choices={optionToChoices(getPolygonsSubmittedTypes())}
      />
      <TextField source="projectName" label="Project Name" />
      <FunctionField
        source="frameworkKey"
        label="Framework"
        render={(record: any) =>
          frameworkInputChoices.find((framework: any) => framework.id === record?.frameworkKey)?.name ||
          record?.framework_key
        }
        sortable={false}
      />
      <Menu menu={tableMenu} placement={MENU_PLACEMENT_BOTTOM_LEFT}>
        <Icon name={IconNames.ELIPSES} className="h-6 w-6 rounded-full p-1 hover:bg-neutral-200"></Icon>
      </Menu>
    </Datagrid>
  );
};

export const SitesList: FC = () => {
  const frameworkInputChoices = useUserFrameworkChoices();
  const countryChoices = useGadmChoices({ level: 0 });

  const filters = [
    <SearchInput key="search" source="search" alwaysOn className="search-page-admin" />,
    <SelectInput
      key="country"
      label="Country"
      source="country"
      choices={countryChoices}
      className="select-page-admin"
    />,
    <ReferenceInput
      key="organisation"
      source="organisationUuid"
      reference={modules.organisation.ResourceName}
      label="Organization"
      sort={{
        field: "name",
        order: "DESC"
      }}
      perPage={1000}
      filter={{ status: "approved" }}
    >
      <AutocompleteInput optionText="name" label="Organization" className="select-page-admin" />
    </ReferenceInput>,
    <ReferenceInput
      key="project"
      source="projectUuid"
      reference={modules.project.ResourceName}
      label="Project"
      sort={{
        field: "name",
        order: "ASC"
      }}
      perPage={100}
    >
      <AutocompleteInput
        optionText="name"
        label="Project"
        className="select-page-admin"
        filterToQuery={searchText => ({ searchFilter: searchText })}
      />
    </ReferenceInput>,
    <SelectInput
      key="frameworkKey"
      label="Framework"
      source="frameworkKey"
      choices={frameworkInputChoices}
      className="select-page-admin"
    />,
    <SelectInput
      key="status"
      label="Status"
      source="status"
      choices={optionToChoices(getStatusOptions())}
      className="select-page-admin"
    />,
    <SelectInput
      key="updateRequestStatus"
      label="Change Request"
      source="updateRequestStatus"
      choices={optionToChoices(getChangeRequestStatusOptions())}
      className="select-page-admin"
    />,
    <SelectInput
      key="monitoringData"
      label="Monitored Data"
      source="monitoringData"
      choices={monitoringDataChoices}
      className="select-page-admin"
    />,
    <SelectInput
      key="polygonStatus"
      label="Polygon"
      source="polygonStatus"
      choices={optionToChoices(getPolygonOptions())}
      className="select-page-admin"
    />
  ];

  const { exporting, onClickExportButton, frameworkDialogProps } = useFrameworkExport("sites", frameworkInputChoices);

  return (
    <>
      <Stack gap={1} className="pb-6">
        <Text variant="text-36-bold" className="leading-none">
          Sites
        </Text>
      </Stack>

      <List actions={<ListActions onExport={onClickExportButton} />} filters={filters}>
        <SiteDataGrid />
      </List>

      <FrameworkSelectionDialog {...frameworkDialogProps} />

      <ExportProcessingAlert show={exporting} />
    </>
  );
};
