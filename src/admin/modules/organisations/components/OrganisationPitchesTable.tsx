import { Typography } from "@mui/material";
import { ArrayField, Datagrid, SelectField, TextField } from "react-admin";

import { useGadmChoices } from "@/connections/Gadm";

const OrganisationPitchesTable = () => {
  const countryChoices = useGadmChoices({ level: 0 });
  return (
    <div>
      <Typography variant="h6" component="h3" mb={2}>
        Project Pitches
      </Typography>
      <ArrayField source="project_pitches" emptyText="Not Provided">
        <Datagrid
          bulkActionButtons={false}
          rowClick={(id, resource, record) => {
            return `/pitch/${record.uuid}/show`;
          }}
        >
          <TextField source="project_name" label="Project Name" emptyText="Not Provided" />
          <SelectField source="project_country" label="Countries" choices={countryChoices} emptyText="Not Provided" />
        </Datagrid>
      </ArrayField>
    </div>
  );
};

export default OrganisationPitchesTable;
