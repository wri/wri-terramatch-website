import { Stack } from "@mui/material";
import {
  Datagrid,
  DateField,
  EditButton,
  FunctionField,
  SearchInput,
  SelectField,
  SelectInput,
  ShowButton,
  TextField
} from "react-admin";

import { AutoResetSort } from "@/admin/components/Actions/ListActions";
import ListActionsCreateFilter from "@/admin/components/Actions/ListActionsCreateFilter";
import { List } from "@/admin/components/AdminList";
import { userCanEdit } from "@/admin/hooks/useCanUserEdit";
import { useGetUserRole } from "@/admin/hooks/useGetUserRole";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_BOTTOM_LEFT } from "@/components/elements/Menu/MenuVariant";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { UserDto } from "@/generated/v3/userService/userServiceSchemas";

import { userPrimaryRoleChoices } from "../const";

const filters = [
  <SearchInput key="s" source="search" alwaysOn className="search-page-admin" />,
  <SelectInput
    key="c"
    label="User Status"
    source="isVerified"
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
      <TextField source="fullName" label="Name" sortBy="firstName" />
      <TextField source="organisationName" label="Organization" />
      <TextField source="emailAddress" label="Email" />
      <FunctionField
        source="emailAddressVerifiedAt"
        label="Verified"
        render={(record?: UserDto) => (record?.emailAddressVerifiedAt != null ? "✓" : "x")}
        sortBy="emailAddressVerifiedAt"
      />
      <SelectField source="primaryRole" label="Type" choices={userPrimaryRoleChoices} sortable={false} />
      <DateField source="lastLoggedInAt" label="Last Login" locales="en-GB" />
      <DateField source="createdAt" label="Date Added" locales="en-GB" />
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
        <AutoResetSort />
        <UserDataGrid />
      </List>
    </>
  );
};
