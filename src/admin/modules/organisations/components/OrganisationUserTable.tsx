import { Typography } from "@mui/material";
import { Datagrid, DateField, FunctionField, ReferenceManyField, TextField } from "react-admin";

import { V2AdminUserRead } from "@/generated/apiSchemas";

import modules from "../..";

const OrganisationUserTable = () => {
  return (
    <div>
      <Typography variant="h6" component="h3" mb={2}>
        Users
      </Typography>
      <ReferenceManyField
        reference={modules.user.ResourceName}
        target="organisation_uuid"
        label={false}
        emptyText="Not Provided"
      >
        <Datagrid bulkActionButtons={false} rowClick="show">
          <FunctionField label="Name" render={(user: V2AdminUserRead) => `${user.first_name} ${user.last_name}`} />
          <TextField source="email_address" />
          <DateField label="Last login date" source="last_logged_in_at" locales="en-GB" />
        </Datagrid>
      </ReferenceManyField>
    </div>
  );
};

export default OrganisationUserTable;
