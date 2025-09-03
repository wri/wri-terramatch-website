import { Stack } from "@mui/material";
import {
  BooleanField,
  Datagrid,
  DateField,
  EditButton,
  FunctionField,
  List,
  ReferenceField,
  SearchInput,
  SelectField,
  SelectInput,
  ShowButton,
  TextField
} from "react-admin";

import ListActionsCreateFilter from "@/admin/components/Actions/ListActionsCreateFilter";
import { userCanEdit } from "@/admin/hooks/useCanUserEdit";
import { useGetUserRole } from "@/admin/hooks/useGetUserRole";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_BOTTOM_LEFT } from "@/components/elements/Menu/MenuVariant";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { V2AdminUserRead } from "@/generated/apiSchemas";

import modules from "../..";
import { userPrimaryRoleChoices } from "../const";

const filters = [
  <SearchInput key="s" source="search" alwaysOn className="search-page-admin" />,
  <SelectInput
    key="c"
    label="User Status"
    source="verified"
    className="select-page-admin"
    choices={[
      {
        id: true,
        name: "Verified"
      },
      {
        id: false,
        name: "Not Verified"
      }
    ]}
  />
];

const EditItem = {
  id: "1",
  render: () => <EditButton />
};

const ShowItem = {
  id: "2",
  render: () => <ShowButton />
};

const readOnlyMenu = [ShowItem];

const adminMenu = [EditItem, ShowItem];

const UserDataGrid = () => {
  const roleData = useGetUserRole();

  return (
    <Datagrid rowClick={"show"}>
      <FunctionField
        label="Name"
        source="first_name"
        render={(record: V2AdminUserRead) => `${record?.first_name || ""} ${record?.last_name || ""}`}
      />
      <ReferenceField
        source="organisation.uuid"
        label="Organization"
        reference={modules.organisation.ResourceName}
        link="show"
        sortBy="organisation_name"
      >
        <TextField source="name" />
      </ReferenceField>
      <TextField source="email_address" label="Email" />
      <BooleanField source="verified" label="Verified" sortBy="email_address_verified_at" />
      <SelectField source="role" label="Type" choices={userPrimaryRoleChoices} />
      <DateField source="last_logged_in_at" label="Last Login" locales="en-GB" />
      <DateField source="created_at" label="Date Added" locales="en-GB" />
      <FunctionField
        label="Actions"
        render={(record: any) => {
          const canEdit = userCanEdit(record, "user", roleData);
          return (
            <Menu menu={canEdit ? adminMenu : readOnlyMenu} placement={MENU_PLACEMENT_BOTTOM_LEFT}>
              <Icon name={IconNames.ELIPSES} className="h-6 w-6 rounded-full p-1 hover:bg-neutral-200"></Icon>
            </Menu>
          );
        }}
      />
    </Datagrid>
  );
};

export const UserList = () => {
  const { isFrameworkAdmin } = useGetUserRole();

  return (
    <>
      <Stack gap={1} className="pb-6">
        <Text variant="text-36-bold" className="leading-none">
          Users
        </Text>
      </Stack>

      <List actions={<ListActionsCreateFilter canCreate={isFrameworkAdmin} />} filters={filters}>
        <UserDataGrid />
      </List>
    </>
  );
};
