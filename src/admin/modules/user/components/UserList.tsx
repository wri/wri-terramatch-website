import { Divider, Stack, Typography } from "@mui/material";
import { useState } from "react";
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
  TextField,
  useDataProvider
} from "react-admin";

import { UserDataProvider } from "@/admin/apiProvider/dataProviders/userDataProvider";
import ListActions from "@/admin/components/Actions/ListActions";
import ExportProcessingAlert from "@/admin/components/Alerts/ExportProcessingAlert";
import { V2AdminUserRead } from "@/generated/apiSchemas";

import modules from "../..";
import { userTypesChoices } from "../const";

const filters = [
  <SearchInput key="s" source="search" alwaysOn />,
  <SelectInput
    key="c"
    label="User Status"
    source="verified"
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

const UserDataGrid = () => {
  return (
    <Datagrid rowClick="show">
      <FunctionField
        label="Name and last name"
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
      <SelectField source="user_type" label="Type" choices={userTypesChoices} />
      <DateField source="last_logged_in_at" label="Last Login Date" />
      <DateField source="created_at" label="Date Added" />
      <ShowButton />
      <EditButton />
    </Datagrid>
  );
};

export const UserList = () => {
  const [exporting, setExporting] = useState<boolean>(false);

  const userDataProvider = useDataProvider<UserDataProvider>();

  const handleExport = () => {
    setExporting(true);

    userDataProvider.export(modules.user.ResourceName).finally(() => setExporting(false));
  };

  return (
    <>
      <Stack gap={1} py={2}>
        <Typography variant="h5">Users</Typography>

        <Divider />
      </Stack>

      <List actions={<ListActions onExport={handleExport} />} filters={filters}>
        <UserDataGrid />
      </List>

      <ExportProcessingAlert show={exporting} />
    </>
  );
};
