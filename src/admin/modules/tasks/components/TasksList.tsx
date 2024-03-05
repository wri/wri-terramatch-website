import { Divider, Stack, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import {
  AutocompleteInput,
  Datagrid,
  FunctionField,
  List,
  ReferenceInput,
  SelectInput,
  ShowButton,
  TextField
} from "react-admin";

import { useFrameworkChoices } from "@/constants/options/frameworks";
import { getTaskStatusOptions } from "@/constants/options/status";
import { optionToChoices } from "@/utils/options";

import modules from "../..";

const TaskDataGrid: FC = () => {
  const [frameworkChoices, setFrameworkChoices] = useState<any>([]);
  const fetchData = async () => {
    try {
      setFrameworkChoices(await useFrameworkChoices());
    } catch (error) {
      console.error("Error fetching framework choices:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Datagrid>
      <TextField source="project.name" label="Project Name" />
      <TextField source="readable_status" label="Status" sortable={false} />
      <TextField source="organisation.name" label="Organization" />
      <FunctionField
        source="framework_key"
        label="Framework"
        render={(record: any) =>
          frameworkChoices.find((framework: any) => framework.id === record?.framework_key)?.name ||
          record?.framework_key
        }
        sortable={false}
      />
      <ShowButton />
    </Datagrid>
  );
};

export const TasksList: FC = () => {
  const [frameworkChoices, setFrameworkChoices] = useState<any>([]);

  const fetchData = async () => {
    try {
      setFrameworkChoices(await useFrameworkChoices());
    } catch (error) {
      console.error("Error fetching framework choices:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const filters = [
    <ReferenceInput
      key="organisation"
      source="organisation_uuid"
      reference={modules.organisation.ResourceName}
      label="Organization"
      sort={{
        field: "name",
        order: "ASC"
      }}
    >
      <AutocompleteInput optionText="name" label="Organization" />
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
