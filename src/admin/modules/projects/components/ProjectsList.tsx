import { Stack } from "@mui/material";
import { useT } from "@transifex/react";
import { FC } from "react";
import {
  AutocompleteInput,
  Datagrid,
  EditButton,
  FunctionField,
  List,
  NumberField,
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
import { getChangeRequestStatusOptions, getStatusOptions } from "@/constants/options/status";
import { useUserFrameworkChoices } from "@/constants/options/userFrameworksChoices";
import { ProjectLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { formatOptionsList, optionToChoices } from "@/utils/options";

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

const ProjectDataGrid = () => {
  const frameworkInputChoices = useUserFrameworkChoices();
  const t = useT();
  return (
    <Datagrid bulkActionButtons={<CustomBulkDeleteWithConfirmButton source="name" />} rowClick={"show"}>
      <TextField source="name" label="Project Name" />
      <FunctionField
        source="status"
        label="Status"
        sortable={false}
        render={({ status }: ProjectLightDto) => {
          const { title } = getStatusOptions().find((option: any) => option.value === status) ?? {};
          return <CustomChipField label={title} />;
        }}
      />
      <FunctionField
        source="updateRequestStatus"
        label="Change Request Status"
        sortable={false}
        render={({ updateRequestStatus }: ProjectLightDto) => {
          const { title } =
            getChangeRequestStatusOptions().find((option: any) => option.value === updateRequestStatus) ?? {};
          return <CustomChipField label={title} />;
        }}
      />
      <TextField source="organisationName" label="Organization" />
      <NumberField source="totalHectaresRestoredSum" label="Hectares Restored" sortable={false} emptyText="0" />
      <FunctionField
        source="frameworkKey"
        label="Framework"
        render={({ frameworkKey }: ProjectLightDto) =>
          frameworkInputChoices.find(({ id }) => id === frameworkKey)?.name ?? frameworkKey
        }
        sortable={false}
      />
      <FunctionField
        source="country"
        label="Country"
        render={(props: any) => {
          return (
            props?.country && (
              <div className="flex items-center gap-2">
                <img
                  src={`/flags/${props?.country?.toLowerCase()}.svg`}
                  alt="flas"
                  className="h-6 w-10 min-w-[40px] object-cover"
                />
                <Text variant="text-14-light">{formatOptionsList(getCountriesOptions(t), props?.country ?? [])}</Text>
              </div>
            )
          );
        }}
        sortable={true}
      />
      <Menu menu={tableMenu} placement={MENU_PLACEMENT_BOTTOM_LEFT}>
        <Icon name={IconNames.ELIPSES} className="h-6 w-6 rounded-full p-1 hover:bg-neutral-200"></Icon>
      </Menu>
    </Datagrid>
  );
};

export const ProjectsList: FC = () => {
  const frameworkInputChoices = useUserFrameworkChoices();

  const filters = [
    <SearchInput key="search" source="search" alwaysOn className="search-page-admin" />,
    <SelectInput
      key="country"
      label="Country"
      source="country"
      className="select-page-admin"
      choices={optionToChoices(getCountriesOptions())}
    />,
    <ReferenceInput
      key="organisation"
      source="organisationUuid"
      reference={modules.organisation.ResourceName}
      label="Organization"
      className="select-page-admin"
      sort={{
        field: "name",
        order: "ASC"
      }}
      perPage={1000}
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
      key="updateRequestStatus"
      className="select-page-admin"
      label="Change Request Status"
      source="updateRequestStatus"
      choices={optionToChoices(getChangeRequestStatusOptions())}
    />,
    <SelectInput
      key="frameworkKey"
      label="Framework"
      source="frameworkKey"
      choices={frameworkInputChoices}
      className="select-page-admin"
    />
  ];

  const { exporting, onClickExportButton, frameworkDialogProps } = useFrameworkExport(
    "projects",
    frameworkInputChoices
  );

  return (
    <>
      <Stack gap={1} className="pb-6">
        <Text variant="text-36-bold" className="leading-none">
          Projects
        </Text>
      </Stack>

      <List actions={<ListActions onExport={onClickExportButton} />} filters={filters}>
        <ProjectDataGrid />
      </List>

      <FrameworkSelectionDialog {...frameworkDialogProps} />

      <ExportProcessingAlert show={exporting} />
    </>
  );
};
