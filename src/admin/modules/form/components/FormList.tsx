import { BooleanField, Datagrid, List, TextField } from "react-admin";

export const FormList = () => (
  <List>
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <TextField source="title" />
      <TextField source="subtitle" />
      <TextField source="duration" />
      <TextField source="documentation" />
      <TextField source="deadline_at" />
      <BooleanField source="published" />
    </Datagrid>
  </List>
);
