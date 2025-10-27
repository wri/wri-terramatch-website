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
import { useGadmChoices } from "@/connections/Gadm";
import {
  getChangeRequestStatusOptions,
  getNothingReportOptions,
  getReportStatusOptions
} from "@/constants/options/status";
import { useUserFrameworkChoices } from "@/constants/options/userFrameworksChoices";
import { NurseryReportLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
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
  }
];

const NurseryReportDataGrid: FC = () => {
  const frameworkInputChoices = useUserFrameworkChoices();

  return (
    <Datagrid bulkActionButtons={<CustomBulkDeleteWithConfirmButton source="title" />} rowClick={"show"}>
      <TextField source="nurseryName" label="Nursery Name" sortable={false} />
      <FunctionField
        source="status"
        label="Status"
        sortable={false}
        render={({ status }: NurseryReportLightDto) => {
          const { title } = getReportStatusOptions().find((option: any) => option.value === status) ?? {};
          return <CustomChipField label={title} />;
        }}
      />
      <FunctionField
        source="updateRequestStatus"
        label="Change Request Status"
        sortable={false}
        render={(record: any) => {
          const readableChangeRequestStatus = getChangeRequestStatusOptions().find(
            (option: any) => option.value === record.updateRequestStatus
          );
          return <CustomChipField label={readableChangeRequestStatus?.title} />;
        }}
      />
      <TextField source="projectName" label="Project" />
      <TextField source="organisationName" label="Organization" />
      <DateField source="dueAt" label="Due Date" locales="en-GB" />
      <DateField source="updatedAt" label="Last Updated" locales="en-GB" />
      <DateField source="submittedAt" label="Date Submitted" locales="en-GB" />
      <FunctionField
        source="frameworkKey"
        label="Framework"
        render={({ frameworkKey }: NurseryReportLightDto) =>
          frameworkInputChoices.find((framework: any) => framework.id === frameworkKey)?.name ?? frameworkKey
        }
        sortable={false}
      />
      <FunctionField
        source="nothingToReport"
        label="Nothing to Report"
        render={(record: NurseryReportLightDto) => {
          return (
            <div className="flex items-center justify-center">
              {record.nothingToReport ? <Icon name={IconNames.CROSS} className="h-6 w-6" /> : <></>}
            </div>
          );
        }}
        sortable={false}
      />
      <Menu menu={tableMenu} placement={MENU_PLACEMENT_BOTTOM_LEFT} classNameContentMenu="!sticky">
        <Icon name={IconNames.ELIPSES} className="h-6 w-6 rounded-full p-1 hover:bg-neutral-200"></Icon>
      </Menu>
    </Datagrid>
  );
};

export const NurseryReportsList: FC = () => {
  const frameworkInputChoices = useUserFrameworkChoices();
  const countryChoices = useGadmChoices({ level: 0 });

  const filters = [
    <SearchInput key="search" source="search" alwaysOn className="search-page-admin" />,
    <ReferenceInput
      key="organisation"
      source="organisationUuid"
      reference={modules.organisation.ResourceName}
      label="Organisation"
      sort={{
        field: "name",
        order: "DESC"
      }}
      perPage={1000}
      filter={{ status: "approved" }}
    >
      <AutocompleteInput optionText="name" label="Organisation" className="select-page-admin" />
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
    <ReferenceInput
      key="nursery"
      source="nurseryUuid"
      reference={modules.nursery.ResourceName}
      label="Nursery"
      sort={{
        field: "name",
        order: "ASC"
      }}
      perPage={100}
    >
      <AutocompleteInput
        optionText="name"
        label="Nursery"
        className="select-page-admin"
        filterToQuery={searchText => ({ searchFilter: searchText })}
      />
    </ReferenceInput>,
    <SelectInput
      key="country"
      label="Country"
      source="country"
      choices={countryChoices}
      className="select-page-admin"
    />,
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
      choices={optionToChoices(getReportStatusOptions())}
      className="select-page-admin"
    />,
    <SelectInput
      key="updateRequestStatus"
      label="Change Request Status"
      source="updateRequestStatus"
      choices={optionToChoices(getChangeRequestStatusOptions())}
      className="select-page-admin"
    />,
    <SelectInput
      key="nothingToReport"
      label="Nothing to Report"
      source="nothingToReport"
      choices={optionToChoices(getNothingReportOptions())}
      className="select-page-admin"
    />
  ];

  const { exporting, onClickExportButton, frameworkDialogProps } = useFrameworkExport(
    "nursery-reports",
    frameworkInputChoices
  );

  return (
    <>
      <Stack gap={1} className="pb-6">
        <Text variant="text-36-bold" className="leading-none">
          Nursery Reports
        </Text>
      </Stack>

      <List actions={<ListActions onExport={onClickExportButton} showResetSort={true} />} filters={filters}>
        <NurseryReportDataGrid />
      </List>

      <FrameworkSelectionDialog {...frameworkDialogProps} />

      <ExportProcessingAlert show={exporting} />
    </>
  );
};
