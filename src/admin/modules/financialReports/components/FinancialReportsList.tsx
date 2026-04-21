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
  TextField,
  useRecordContext
} from "react-admin";

import { v3ErrorForRA } from "@/admin/apiProvider/utils/error";
import ListActions, { AutoResetSort } from "@/admin/components/Actions/ListActions";
import ExportProcessingAlert from "@/admin/components/Alerts/ExportProcessingAlert";
import CustomBulkDeleteWithConfirmButton from "@/admin/components/Buttons/CustomBulkDeleteWithConfirmButton";
import CustomChipField from "@/admin/components/Fields/CustomChipField";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_BOTTOM_LEFT } from "@/components/elements/Menu/MenuVariant";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import {
  getChangeRequestStatusOptions,
  getFinancialReportStatusOptions,
  getReportStatusOptions
} from "@/constants/options/status";
import { useUserFrameworkChoices } from "@/constants/options/userFrameworksChoices";
import { entityExportAll } from "@/generated/v3/entityService/entityServiceComponents";
import { FinancialReportLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { downloadFileBlob } from "@/utils/network";
import { optionToChoices } from "@/utils/options";

import modules from "../..";

const FinancialReportsDataGrid: FC = () => {
  const frameworkInputChoices = useUserFrameworkChoices();
  const tableMenu = [
    {
      id: "1",
      render: () => <ShowButton />
    },
    {
      id: "2",
      render: () => {
        const record = useRecordContext();
        return <EditButton disabled={record?.status === "submitted"} />;
      }
    }
  ];

  return (
    <Datagrid bulkActionButtons={<CustomBulkDeleteWithConfirmButton source="title" />} rowClick={"show"}>
      <TextField source="organisationName" label="Organization" sortable={false} />
      <FunctionField
        source="status"
        label="Status"
        sortable={false}
        render={(record?: FinancialReportLightDto) => {
          const { title } =
            getFinancialReportStatusOptions().find((option: any) => option.value === record?.status) ?? {};
          return <CustomChipField label={title} />;
        }}
      />
      <FunctionField
        source="updateRequestStatus"
        label="Change Request Status"
        sortable={false}
        render={(record?: FinancialReportLightDto) => {
          const readableChangeRequestStatus = getChangeRequestStatusOptions().find(
            (option: any) => option.value === record?.updateRequestStatus
          );
          return <CustomChipField label={readableChangeRequestStatus?.title} />;
        }}
      />
      <FunctionField
        source="frameworkKey"
        label="Framework"
        render={(record?: FinancialReportLightDto) => {
          const frameworkKey = record?.frameworkKey;
          return frameworkInputChoices.find((framework: any) => framework.id === frameworkKey)?.name ?? frameworkKey;
        }}
        sortable={false}
      />
      <TextField source="yearOfReport" label="Year of Report" />
      <DateField source="dueAt" label="Due Date" locales="en-GB" />
      <DateField source="updatedAt" label="Last Updated" locales="en-GB" />
      <DateField source="submittedAt" label="Date Submitted" locales="en-GB" />
      <Menu menu={tableMenu} placement={MENU_PLACEMENT_BOTTOM_LEFT} classNameContentMenu="!sticky">
        <Icon name={IconNames.ELIPSES} className="h-6 w-6 rounded-full p-1 hover:bg-neutral-200"></Icon>
      </Menu>
    </Datagrid>
  );
};

export const FinancialReportsList: FC = () => {
  const [exporting, setExporting] = useState<boolean>(false);
  const frameworkInputChoices = useUserFrameworkChoices();

  const handleExport = async () => {
    setExporting(true);
    try {
      const { fileName, blob } = await entityExportAll.fetchBlob({ pathParams: { entity: "financialReports" } });
      await downloadFileBlob(blob, fileName ?? "FinancialReports.csv");
    } catch (e) {
      throw v3ErrorForRA("Failed to fetch financial report exports", e);
    } finally {
      setExporting(false);
    }
  };

  const filters = [
    <SearchInput key="search" source="search" alwaysOn className="search-page-admin" />,
    <ReferenceInput
      key="organisation"
      source="organisationUuid"
      reference={modules.organisation.ResourceName}
      label="Organisation"
      sort={{
        field: "name",
        order: "ASC"
      }}
      perPage={100}
      filter={{ status: "approved" }}
    >
      <AutocompleteInput optionText="name" label="Organisation" className="select-page-admin" />
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
    />,
    <SelectInput
      key="frameworkKey"
      label="Framework"
      source="frameworkKey"
      choices={frameworkInputChoices}
      className="select-page-admin"
    />
  ];

  return (
    <>
      <Stack gap={1} className="pb-6">
        <Text variant="text-36-bold" className="leading-none">
          Financial Reports
        </Text>
      </Stack>

      <List actions={<ListActions onExport={handleExport} />} filters={filters}>
        <AutoResetSort />
        <FinancialReportsDataGrid />
      </List>

      <ExportProcessingAlert show={exporting} />
    </>
  );
};
