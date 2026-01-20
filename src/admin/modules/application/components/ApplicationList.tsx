import { Stack } from "@mui/material";
import { FC, useState } from "react";
import {
  AutocompleteInput,
  Datagrid,
  DateField,
  DeleteWithConfirmButton,
  FunctionField,
  List,
  ReferenceField,
  ReferenceInput,
  SearchInput,
  SelectInput,
  ShowButton,
  TextField
} from "react-admin";

import ListActions, { AutoResetSort } from "@/admin/components/Actions/ListActions";
import ApplicationsExportModal from "@/admin/modules/application/components/ApplicationsExportModal";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_BOTTOM_LEFT } from "@/components/elements/Menu/MenuVariant";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { V2OrganisationRead } from "@/generated/apiSchemas";

import modules from "../..";

export const statusChoices = [
  { id: "started", name: "Started" },
  { id: "awaiting-approval", name: "Awaiting Approval" },
  { id: "approved", name: "Approved" },
  { id: "requires-more-information", name: "Requires More Information" },
  { id: "rejected", name: "Rejected" }
];

const tableMenu = [
  {
    id: "1",
    render: () => <ShowButton />
  },
  {
    id: "2",
    render: () => <DeleteWithConfirmButton />
  }
];

const ApplicationDataGrid: FC = () => (
  <Datagrid rowClick={"show"}>
    <ReferenceField source="organisationUuid" reference={modules.organisation.ResourceName} label="Organization">
      <FunctionField render={(record: V2OrganisationRead) => `${record?.name || ""}`} />
    </ReferenceField>
    <ReferenceField
      source="fundingProgrammeUuid"
      reference={modules.fundingProgramme.ResourceName}
      label="Funding Programme"
    >
      <TextField label="Name" source="name" />
    </ReferenceField>
    <TextField label="Stage" source="currentSubmission.stageName" />
    <FunctionField
      label="Status"
      source="currentSubmission.status"
      render={(record: any) =>
        statusChoices.find(status => status.id === record?.currentSubmission?.status)?.name ||
        record?.currentSubmission?.status
      }
      sortable={false}
    />
    <DateField source="createdAt" label="Created" showTime locales="en-GB" />
    <DateField source="updatedAt" label="Last Edited" showTime locales="en-GB" />
    <Menu menu={tableMenu} placement={MENU_PLACEMENT_BOTTOM_LEFT}>
      <Icon name={IconNames.ELIPSES} className="h-6 w-6 rounded-full p-1 hover:bg-neutral-200"></Icon>
    </Menu>
  </Datagrid>
);

export const ApplicationList = () => {
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);

  const filters = [
    <SearchInput key="s" source="search" alwaysOn className="search-page-admin" />,
    <ReferenceInput
      key="fp"
      source="fundingProgrammeUuid"
      reference={modules.fundingProgramme.ResourceName}
      label="Funding Programme"
    >
      <AutocompleteInput optionText="name" label="Funding Programme" className="select-page-admin" />
    </ReferenceInput>,
    <SelectInput
      key="status"
      label="Status"
      source="currentSubmission.status"
      choices={statusChoices}
      className="select-page-admin"
    />
  ];

  return (
    <>
      <Stack gap={1} className="pb-6">
        <Text variant="text-36-bold" className="leading-none">
          Applications
        </Text>
      </Stack>

      <List actions={<ListActions onExport={() => setExportModalOpen(true)} />} filters={filters}>
        <AutoResetSort />
        <ApplicationDataGrid />
      </List>

      <ApplicationsExportModal handleClose={() => setExportModalOpen(false)} open={exportModalOpen} />
    </>
  );
};
