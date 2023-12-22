import { Divider, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { Datagrid, EditButton, List, ShowButton, TextField, WrapperField } from "react-admin";

import CustomDeleteWithConfirmButton from "@/admin/components/Buttons/CustomDeleteWithConfirmButton";

export const ReportingFrameworkList: FC = () => {
  return (
    <>
      <Stack gap={1} py={2}>
        <Typography variant="h5">Reporting Frameworks</Typography>

        <Divider />
      </Stack>

      <List>
        <Datagrid rowClick="edit" bulkActionButtons={false}>
          <TextField source="name" label="Framework" />
          <TextField source="access_code" label="Access Code" />
          <TextField source="total_projects_count" label="Enrolled Projects" />
          <ShowButton />
          <EditButton />
          <WrapperField>
            <CustomDeleteWithConfirmButton source="name" />
          </WrapperField>
        </Datagrid>
      </List>
    </>
  );
};
