import { Stack } from "@mui/material";
import { useState } from "react";
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

import ListActions from "@/admin/components/Actions/ListActions";
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

const ApplicationDataGrid = () => {
  return (
    <Datagrid>
      <ReferenceField source="organisation_uuid" reference={modules.organisation.ResourceName} label="Organization">
        <FunctionField render={(record: V2OrganisationRead) => `${record?.name || ""}`} />
      </ReferenceField>
      <ReferenceField
        source="funding_programme_uuid"
        reference={modules.fundingProgramme.ResourceName}
        label="Funding Programme"
      >
        <TextField label="Name" source="name" />
      </ReferenceField>
      <ReferenceField
        source="current_submission.stage.uuid"
        reference={modules.stage.ResourceName}
        label="Stage"
        sortable={false}
      >
        <TextField label="Stage" source="name" />
      </ReferenceField>
      <FunctionField
        label="Status"
        source="current_submission.status"
        render={(record: any) =>
          statusChoices.find(status => status.id === record?.current_submission?.status)?.name ||
          record?.current_submission?.status
        }
        sortable={false}
      />
      <DateField source="created_at" label="Created" showTime locales="en-GB" />
      <DateField source="updated_at" label="Last Edited" showTime locales="en-GB" />
      <Menu menu={tableMenu} placement={MENU_PLACEMENT_BOTTOM_LEFT}>
        <Icon name={IconNames.ELIPSES} className="h-6 w-6 rounded-full p-1 hover:bg-neutral-200"></Icon>
      </Menu>
    </Datagrid>
  );
};

export const ApplicationList = () => {
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);

  const filters = [
    <SearchInput key="s" source="search" alwaysOn className="search-pa" />,
    <ReferenceInput
      key="fp"
      source="funding_programme_uuid"
      reference={modules.fundingProgramme.ResourceName}
      label="Funding Programme"
    >
      <AutocompleteInput optionText="name" label="Funding Programme" />
    </ReferenceInput>,
    <ReferenceInput key="st" source="current_submission.uuid" reference={modules.stage.ResourceName} label="Stage">
      <AutocompleteInput optionText="name" label="Stage" optionValue="uuid" />
    </ReferenceInput>,
    <SelectInput key="status" label="Status" source="current_submission_status" choices={statusChoices} />
  ];

  return (
    <>
      <Stack gap={1} className="pb-6">
        <Text variant="text-36-bold" className="leading-none">
          Applications
        </Text>
      </Stack>

      <List actions={<ListActions onExport={() => setExportModalOpen(true)} />} filters={filters}>
        <ApplicationDataGrid />
      </List>

      <ApplicationsExportModal handleClose={() => setExportModalOpen(false)} open={exportModalOpen} />
    </>
  );
};
