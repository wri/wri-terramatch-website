import { Divider, Stack, Typography } from "@mui/material";
import { Datagrid, DateField, EditButton, List, ShowButton, TextField } from "react-admin";

export const FundingProgrammeList = () => {
  return (
    <>
      <Stack gap={1} py={2}>
        <Typography variant="h5">Funding Programmes</Typography>

        <Divider />
      </Stack>

      <List filters={[]}>
        <Datagrid rowClick="edit">
          <TextField source="name" label="Name" sortable={false} />
          <TextField source="description" label="Description" sortable={false} />
          <TextField source="status" label="Status" sortable={false} sx={{ textTransform: "capitalize" }} />
          <DateField source="created_at" label="Date Added" sortable={false} />
          <ShowButton />
          <EditButton />
        </Datagrid>
      </List>
    </>
  );
};
