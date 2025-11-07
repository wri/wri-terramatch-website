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

import { AutoResetSort } from "@/admin/components/Actions/ListActions";
import CustomChipField from "@/admin/components/Fields/CustomChipField";
import { useFrameworkChoices } from "@/constants/options/frameworks";
import { getTaskStatusOptions } from "@/constants/options/status";
import { useUserFrameworkChoices } from "@/constants/options/userFrameworksChoices";
import { TaskLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { optionToChoices } from "@/utils/options";

import modules from "../..";

const TaskDataGrid: FC = () => {
  const frameworkInputChoices = useUserFrameworkChoices();

  return (
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <TextField source="projectName" label="Project Name" />
      <FunctionField
        source="status"
        label="Status"
        sortable={false}
        render={({ status }: TaskLightDto) => {
          const { title } = getTaskStatusOptions().find((option: any) => option.value === status) ?? {};
          return <CustomChipField label={title} />;
        }}
      />
      <TextField source="organisationName" label="Organization" />
      <FunctionField
        source="frameworkKey"
        label="Framework"
        render={(record: TaskLightDto) =>
          frameworkInputChoices.find((framework: any) => framework.id === record?.frameworkKey)?.name ??
          record?.frameworkKey
        }
        sortable={false}
      />
      <DateField source="dueAt" label="Due Date" locales="en-GB" />
      <DateField source="updatedAt" label="Last Updated" locales="en-GB" />
    </Datagrid>
  );
};

export const TasksList: FC = () => {
  const frameworkChoices = useFrameworkChoices();

  const filters = [
    <ReferenceInput
      key="project"
      source="projectUuid"
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
    <SelectInput key="frameworkKey" label="Framework" source="frameworkKey" choices={frameworkChoices} />
  ];

  return (
    <>
      <Stack gap={1} py={2}>
        <Typography variant="h5">Tasks</Typography>
        <Divider />
      </Stack>

      <List filters={filters}>
        <AutoResetSort />
        <TaskDataGrid />
      </List>
    </>
  );
};
