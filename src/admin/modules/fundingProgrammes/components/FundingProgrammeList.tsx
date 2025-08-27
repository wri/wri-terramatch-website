import { Stack } from "@mui/material";
import { Datagrid, DateField, EditButton, List, ShowButton, TextField } from "react-admin";

import ListActionsCreate from "@/admin/components/Actions/ListActionsCreate";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_BOTTOM_LEFT } from "@/components/elements/Menu/MenuVariant";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

const tableMenu = [
  {
    id: "1",
    render: () => <EditButton />
  },
  {
    id: "2",
    render: () => <ShowButton />
  }
];

export const FundingProgrammeList = () => (
  <>
    <Stack gap={1} className="pb-6">
      <Text variant="text-36-bold" className="leading-none">
        Funding Programmes
      </Text>
    </Stack>

    <List actions={<ListActionsCreate />} filters={[]}>
      <Datagrid rowClick={"show"}>
        <TextField source="name" label="Name" sortable={false} />
        <TextField source="description" label="Description" sortable={false} />
        <TextField source="status" label="Status" sortable={false} sx={{ textTransform: "capitalize" }} />
        <DateField source="created_at" label="Date Added" sortable={false} locales="en-GB" />
        <Menu menu={tableMenu} placement={MENU_PLACEMENT_BOTTOM_LEFT}>
          <Icon name={IconNames.ELIPSES} className="h-6 w-6 rounded-full p-1 hover:bg-neutral-200"></Icon>
        </Menu>
      </Datagrid>
    </List>
  </>
);
