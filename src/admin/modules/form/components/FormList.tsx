import { Stack } from "@mui/material";
import { useState } from "react";
import { BooleanField, Datagrid, ImageField, List, TextField, useDataProvider } from "react-admin";

import { UserDataProvider } from "@/admin/apiProvider/dataProviders/userDataProvider";
import ListActionsCreate from "@/admin/components/Actions/ListActionsCreate";
import ExportProcessingAlert from "@/admin/components/Alerts/ExportProcessingAlert";
import Text from "@/components/elements/Text/Text";

import modules from "../..";

export const FormList = () => {
  const [exporting, setExporting] = useState<boolean>(false);
  const userDataProvider = useDataProvider<UserDataProvider>();
  const handleExport = () => {
    setExporting(true);

    userDataProvider.export(modules.user.ResourceName).finally(() => setExporting(false));
  };
  return (
    <>
      <Stack gap={1} className="pb-6">
        <Text variant="text-36-bold" className="leading-none">
          Forms
        </Text>
      </Stack>

      <List actions={<ListActionsCreate onExport={handleExport} />}>
        <Datagrid rowClick="show" bulkActionButtons={false}>
          <ImageField source="banner.thumb_url" label="Banner Image" />
          <TextField source="title" label="Title" />
          <TextField source="type" label="Form Type" />
          <BooleanField source="published" label="Published" />
        </Datagrid>
      </List>
      <ExportProcessingAlert show={exporting} />
    </>
  );
};
