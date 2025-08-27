import { Stack } from "@mui/material";
import { BooleanField, Datagrid, ImageField, List, TextField } from "react-admin";

import ListActionsCreate from "@/admin/components/Actions/ListActionsCreate";
import Text from "@/components/elements/Text/Text";

export const FormList = () => (
  <>
    <Stack gap={1} className="pb-6">
      <Text variant="text-36-bold" className="leading-none">
        Forms
      </Text>
    </Stack>

    <List actions={<ListActionsCreate />}>
      <Datagrid rowClick="show" bulkActionButtons={false}>
        <ImageField source="banner.thumb_url" label="Banner Image" />
        <TextField source="title" label="Title" />
        <TextField source="type" label="Form Type" />
        <BooleanField source="published" label="Published" />
      </Datagrid>
    </List>
  </>
);
