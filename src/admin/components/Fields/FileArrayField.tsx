import { Typography } from "@mui/material";
import { ArrayField, ArrayFieldProps, Datagrid, TextField, UrlField } from "react-admin";

export const FileArrayField = (props: Omit<ArrayFieldProps, "children">) => {
  return (
    <ArrayField {...props}>
      <Datagrid
        bulkActionButtons={false}
        empty={
          <Typography component="span" variant="body2">
            Not Provided
          </Typography>
        }
      >
        <TextField source="file_name" label="File Name" />
        <UrlField source="url" target="_blank" label="URL" />
      </Datagrid>
    </ArrayField>
  );
};
