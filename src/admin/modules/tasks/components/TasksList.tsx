import { Divider, Stack, Typography } from "@mui/material";
import { FC } from "react";
import {
  AutocompleteInput,
  Datagrid,
  DateField,
  FunctionField,
  List,
  ReferenceInput,
  SelectInput,
  TextField
} from "react-admin";

import { useFrameworkChoices } from "@/constants/options/frameworks";
import { getTaskStatusOptions } from "@/constants/options/status";
import { useUserFrameworkChoices } from "@/constants/options/userFrameworksChoices";
import { optionToChoices } from "@/utils/options";

import modules from "../..";

const TaskDataGrid: FC = () => {
  const frameworkInputChoices = useUserFrameworkChoices();

  return (
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <TextField source="project.name" label="Project Name" />
      <TextField source="readable_status" label="Status" sortable={false} />
      <TextField source="organisation.name" label="Organization" />
      <FunctionField
        source="project.framework_key"
        label="Framework"
        render={(record: any) =>
          frameworkInputChoices.find((framework: any) => framework.id === record?.project?.framework_key)?.name ||
          record?.project?.framework_key
        }
        sortable={false}
      />
      <DateField source="due_at" label="Due Date" locales="en-GB" />
      <DateField source="updated_at" label="Last Updated" locales="en-GB" />
    </Datagrid>
  );
};

export const TasksList: FC = () => {
  const frameworkChoices = useFrameworkChoices();

  const filters = [
    <ReferenceInput
      key="project"
      source="project_uuid"
      reference={modules.project.ResourceName}
      label="Project"
      sort={{
        field: "name",
        order: "ASC"
      }}
    >
      <AutocompleteInput optionText="name" label="Project" />
    </ReferenceInput>,
    <SelectInput key="status" label="Status" source="status" choices={optionToChoices(getTaskStatusOptions())} />,
    <SelectInput key="framework_key" label="Framework" source="framework_key" choices={frameworkChoices} />
  ];

  return (
    <>
      <Stack gap={1} py={2}>
        <Typography variant="h5">Tasks</Typography>
        <Divider />
      </Stack>

      <List filters={filters}>
        <TaskDataGrid />
      </List>
    </>
  );
};
