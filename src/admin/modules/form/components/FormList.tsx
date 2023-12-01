import { Divider, Stack, Typography } from "@mui/material";
import { BooleanField, Datagrid, ImageField, List, TextField } from "react-admin";

export const FormList = () => (
  <>
    <Stack gap={1} py={2}>
      <Typography variant="h5">Forms</Typography>

      <Divider />
    </Stack>

    <List>
      <Datagrid rowClick="show" bulkActionButtons={false}>
        <ImageField source="banner.thumb_url" label="Banner Image" />
        <TextField source="title" label="Title" />
        <TextField source="type" label="Form Type" />
        <BooleanField source="published" label="Published" />
      </Datagrid>
    </List>
  </>
);
