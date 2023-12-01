import { Typography } from "@mui/material";
import { Datagrid, DateField, ReferenceArrayField, TextField } from "react-admin";

import modules from "../..";

const OrganisationFundingProgrammesTable = () => {
  return (
    <div>
      <Typography variant="h6" component="h3" mb={2}>
        Funding Programs Enrolled
      </Typography>
      <ReferenceArrayField
        source="enrolled_funding_programmes"
        reference={modules.fundingProgramme.ResourceName}
        emptyText="Not Provided"
      >
        <Datagrid bulkActionButtons={false} rowClick="show">
          <TextField source="name" />
          <TextField source="status" />
          <DateField source="created_at" label="Date added" />
        </Datagrid>
      </ReferenceArrayField>
    </div>
  );
};

export default OrganisationFundingProgrammesTable;
