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
import { getChangeRequestStatusOptions, getReportStatusOptions } from "@/constants/options/status";
import { useUserFrameworkChoices } from "@/constants/options/userFrameworksChoices";
import { SiteReportLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { optionToChoices } from "@/utils/options";

import modules from "../..";
const SiteReportDataGrid: FC = () => {
  const frameworkInputChoices = useUserFrameworkChoices();

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
    <Datagrid bulkActionButtons={<CustomBulkDeleteWithConfirmButton source="title" />} rowClick={"show"}>
      <TextField source="siteName" label="Site Name" sortable={false} />
      <FunctionField
        source="status"
        label="Status"
        sortable={false}
        render={({ status }: SiteReportLightDto) => {
          const { title } = getReportStatusOptions().find((option: any) => option.value === status) ?? {};
          return <CustomChipField label={title} />;
        }}
      />
      <FunctionField
        source="updateRequestStatus"
        label="Change Request Status"
        sortable={false}
        render={(record: SiteReportLightDto) => {
          const readableChangeRequestStatus = getChangeRequestStatusOptions().find(
            (option: any) => option.value === record.updateRequestStatus
          );
          return <CustomChipField label={readableChangeRequestStatus?.title} />;
        }}
      />
      <TextField source="projectName" label="Project" />
      <FunctionField
        source="frameworkKey"
        label="Framework"
        render={({ frameworkKey }: SiteReportLightDto) =>
          frameworkInputChoices.find((framework: any) => framework.id === frameworkKey)?.name ?? frameworkKey
        }
        sortable={false}
      />
      <TextField source="organisationName" label="Organization" />
      <DateField source="dueAt" label="Due Date" locales="en-GB" />
      <DateField source="updatedAt" label="Last Updated" locales="en-GB" />
      <DateField source="submittedAt" label="Date Submitted" locales="en-GB" />
      <FunctionField
        source="nothingToReport"
        label="Nothing to Report"
        render={(record: SiteReportLightDto) => {
          return (
            <div className="flex items-center justify-center">
              {record.nothingToReport ? (
                <Icon name={IconNames.CHECK_CIRCLE} className="h-6 w-6" />
              ) : (
                <Icon name={IconNames.CROSS_CIRCLE} className="h-6 w-6" />
              )}
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

export const SiteReportsList: FC = () => {
  const frameworkInputChoices = useUserFrameworkChoices();

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
      key="site"
      source="siteUuid"
      reference={modules.site.ResourceName}
      label="Site"
      sort={{
        field: "name",
        order: "ASC"
      }}
      perPage={100}
    >
      <AutocompleteInput
        optionText="name"
        label="Site"
        className="select-page-admin"
        filterToQuery={searchText => ({ searchFilter: searchText })}
      />
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
      key="updateRequestStatus"
      label="Change Request Status"
      source="updateRequestStatus"
      choices={optionToChoices(getChangeRequestStatusOptions())}
      className="select-page-admin"
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
    "site-reports",
    frameworkInputChoices
  );

  return (
    <>
      <Stack gap={1} className="pb-6">
        <Text variant="text-36-bold" className="leading-none">
          Site Reports
        </Text>
      </Stack>

      <List actions={<ListActions onExport={onClickExportButton} />} filters={filters}>
        <SiteReportDataGrid />
      </List>

      <FrameworkSelectionDialog {...frameworkDialogProps} />

      <ExportProcessingAlert show={exporting} />
    </>
  );
};
