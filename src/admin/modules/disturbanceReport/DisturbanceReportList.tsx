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
  SelectInput,
  ShowButton,
  TextField
} from "react-admin";

import { getFormattedErrorForRA } from "@/admin/apiProvider/utils/error";
import ListActions from "@/admin/components/Actions/ListActions";
import ExportProcessingAlert from "@/admin/components/Alerts/ExportProcessingAlert";
import CustomBulkDeleteWithConfirmButton from "@/admin/components/Buttons/CustomBulkDeleteWithConfirmButton";
import CustomChipField from "@/admin/components/Fields/CustomChipField";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_BOTTOM_LEFT } from "@/components/elements/Menu/MenuVariant";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { getChangeRequestStatusOptions, getReportStatusOptions } from "@/constants/options/status";
import { fetchGetV2DisturbanceReportsExport, GetV2DisturbanceReportsExportError } from "@/generated/apiComponents";
import { DisturbanceReportLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { downloadFileBlob } from "@/utils/network";
import { optionToChoices } from "@/utils/options";

import Intensity, { IntensityEnum } from "./components/Intensity";

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

const DisturbanceReportDataGrid: FC = () => (
  <Datagrid bulkActionButtons={<CustomBulkDeleteWithConfirmButton source="name" />} rowClick={"show"}>
    <TextField source="projectName" label="Project Name" />
    <FunctionField
      source="status"
      label="Status"
      sortable={false}
      render={({ status }: DisturbanceReportLightDto) => {
        const { title } = getReportStatusOptions().find((option: any) => option.value === status) ?? {};
        return <CustomChipField label={title} />;
      }}
    />
    <FunctionField
      source="updateRequestStatus"
      label="Change Request Status"
      sortable={false}
      render={(record?: DisturbanceReportLightDto) => {
        const readableChangeRequestStatus = getChangeRequestStatusOptions().find(
          (option: any) => option.value === record?.updateRequestStatus
        );
        return <CustomChipField label={readableChangeRequestStatus?.title} />;
      }}
    />
    <DateField source="dateOfDisturbance" label="Date of Disturbance" locales="en-GB" />
    <FunctionField
      source="intensity"
      label="Intensity"
      render={(record: DisturbanceReportLightDto) => {
        return <Intensity intensity={record?.intensity?.toLowerCase() as IntensityEnum} />;
      }}
      sortable={false}
    />
    <DateField source="updatedAt" label="Last Updated" locales="en-GB" />
    <DateField source="submittedAt" label="Date Submitted" locales="en-GB" />
    <Menu menu={tableMenu} placement={MENU_PLACEMENT_BOTTOM_LEFT}>
      <Icon name={IconNames.ELIPSES} className="h-6 w-6 rounded-full p-1 hover:bg-neutral-200"></Icon>
    </Menu>
  </Datagrid>
);

export const DisturbanceReportList: FC = () => {
  const [exporting, setExporting] = useState<boolean>(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = (await fetchGetV2DisturbanceReportsExport({})) as Blob;
      await downloadFileBlob(response, "DisturbanceReports.csv");
    } catch (e) {
      throw getFormattedErrorForRA(e as GetV2DisturbanceReportsExportError);
    } finally {
      setExporting(false);
    }
  };

  const filters = [
    <SearchInput key="search" source="search" alwaysOn className="search-page-admin" />,
    <ReferenceInput
      key="project"
      source="projectUuid"
      reference="project"
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
        filterToQuery={(searchText: string) => ({ searchFilter: searchText })}
      />
    </ReferenceInput>,
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
    />
  ];

  return (
    <>
      <Stack gap={1} className="pb-6">
        <Text variant="text-36-bold" className="leading-none">
          Disturbance Report
        </Text>
      </Stack>

      <List actions={<ListActions onExport={handleExport} />} filters={filters}>
        <DisturbanceReportDataGrid />
      </List>

      <ExportProcessingAlert show={exporting} />
    </>
  );
};
