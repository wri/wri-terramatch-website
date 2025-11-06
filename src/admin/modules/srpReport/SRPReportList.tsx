import { Stack } from "@mui/material";
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
  ShowButton,
  TextField
} from "react-admin";

import { getFormattedErrorForRA } from "@/admin/apiProvider/utils/error";
import ListActions, { AutoResetSort } from "@/admin/components/Actions/ListActions";
import ExportProcessingAlert from "@/admin/components/Alerts/ExportProcessingAlert";
import CustomBulkDeleteWithConfirmButton from "@/admin/components/Buttons/CustomBulkDeleteWithConfirmButton";
import CustomChipField from "@/admin/components/Fields/CustomChipField";
import modules from "@/admin/modules";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_BOTTOM_LEFT } from "@/components/elements/Menu/MenuVariant";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { getChangeRequestStatusOptions, getReportStatusOptions } from "@/constants/options/status";
import { fetchGetV2SrpReportsExport, GetV2SrpReportsExportError } from "@/generated/apiComponents";
import { SrpReportLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { downloadFileBlob } from "@/utils/network";

const SRPReportDataGrid: FC = () => {
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
      <TextField source="projectName" label="Project" />
      <TextField source="year" label="Year" />
      <FunctionField
        source="status"
        label="Status"
        sortable={false}
        render={({ status }: SrpReportLightDto) => {
          const { title } = getReportStatusOptions().find((option: any) => option.value === status) ?? {};
          return <CustomChipField label={title} />;
        }}
      />
      <FunctionField
        source="updateRequestStatus"
        label="Change Request Status"
        sortable={false}
        render={(record: SrpReportLightDto) => {
          const readableChangeRequestStatus = getChangeRequestStatusOptions().find(
            (option: any) => option.value === record.updateRequestStatus
          );
          return <CustomChipField label={readableChangeRequestStatus?.title} />;
        }}
      />
      <DateField source="dueAt" label="Due Date" locales="en-GB" />
      <DateField source="updatedAt" label="Last Updated" locales="en-GB" />
      <DateField source="submittedAt" label="Date Submitted" locales="en-GB" />

      <Menu menu={tableMenu} placement={MENU_PLACEMENT_BOTTOM_LEFT} classNameContentMenu="!sticky">
        <Icon name={IconNames.ELIPSES} className="h-6 w-6 rounded-full p-1 hover:bg-neutral-200"></Icon>
      </Menu>
    </Datagrid>
  );
};

export const SRPReportList: FC = () => {
  const [exporting, setExporting] = useState<boolean>(false);
  const filters = [
    <SearchInput key="search" source="search" alwaysOn className="search-page-admin" />,

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
    </ReferenceInput>
  ];

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = (await fetchGetV2SrpReportsExport({})) as Blob;
      await downloadFileBlob(response, "SRPReports.csv");
    } catch (e) {
      throw getFormattedErrorForRA(e as GetV2SrpReportsExportError);
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <Stack gap={1} className="pb-6">
        <Text variant="text-36-bold" className="leading-none">
          Socio-Economic Restoration Partners Report
        </Text>
      </Stack>

      <List actions={<ListActions onExport={handleExport} />} filters={filters}>
        <AutoResetSort />
        <SRPReportDataGrid />
      </List>

      <ExportProcessingAlert show={exporting} />
    </>
  );
};
