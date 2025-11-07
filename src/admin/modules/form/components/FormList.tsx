import { Stack } from "@mui/material";
import { BooleanField, Datagrid, ImageField, List, SearchInput, SelectInput, TextField } from "react-admin";

import { AutoResetSort } from "@/admin/components/Actions/ListActions";
import ListActionsCreate from "@/admin/components/Actions/ListActionsCreate";
import Text from "@/components/elements/Text/Text";
import { Forms } from "@/generated/v3/entityService/entityServiceConstants";

const TYPE_CHOICES = Forms.FORM_TYPES.map(type => ({ id: type, name: type }));

export const FormList = () => {
  return (
    <>
      <Stack gap={1} className="pb-6">
        <Text variant="text-36-bold" className="leading-none">
          Forms
        </Text>
      </Stack>

      <List
        actions={<ListActionsCreate showFilters />}
        filters={[
          <SearchInput key="search" source="search" alwaysOn className="search-page-admin" />,
          <SelectInput key="type" label="Type" source="type" className="select-page-admin" choices={TYPE_CHOICES} />
        ]}
      >
        <AutoResetSort />
        <Datagrid rowClick="show" bulkActionButtons={false}>
          <ImageField source="banner.url" label="Banner Image" />
          <TextField source="title" label="Title" />
          <TextField source="type" label="Form Type" />
          <BooleanField source="published" label="Published" />
        </Datagrid>
      </List>
    </>
  );
};
