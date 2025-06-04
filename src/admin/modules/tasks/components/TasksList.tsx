import { Stack } from "@mui/material";
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

import ListActions from "@/admin/components/Actions/ListActions";
import ExportProcessingAlert from "@/admin/components/Alerts/ExportProcessingAlert";
import FrameworkSelectionDialog, { useFrameworkExport } from "@/admin/components/Dialogs/FrameworkSelectionDialog";
import Button from "@/components/elements/Button/Button";
import { StatusEnum } from "@/components/elements/Status/constants/statusMap";
import Status from "@/components/elements/Status/Status";
import Text from "@/components/elements/Text/Text";
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

  const { exporting, onClickExportButton, frameworkDialogProps } = useFrameworkExport("tasks", frameworkChoices);

  return (
    <>
      <Stack gap={1} py={2}>
        <Text variant="text-36-bold" className="leading-none">
          Tasks
        </Text>
      </Stack>

      <List actions={<ListActions onExport={onClickExportButton} />} filters={filters}>
        <div className="m-6 flex items-center justify-between gap-6 rounded-2xl border border-neutral-300 px-6 py-4">
          <Text variant="text-20-bold" className="w-full leading-none">
            GBM PPC Project
          </Text>
          <div className="grid shrink-0 grid-cols-3 items-center gap-x-6 gap-y-2">
            <Text variant="text-12-light" className="leading-none">
              Status
            </Text>
            <Text variant="text-12-light" className="leading-none">
              Due Time
            </Text>
            <Text variant="text-12-light" className="whitespace-nowrap leading-none">
              Trees Planted
            </Text>
            <Status status={StatusEnum.NEEDS_MORE_INFORMATION} variant="small" />
            <Text variant="text-14-bold" className="leading-none">
              06/08/2021
            </Text>
            <Text variant="text-14-bold" className="leading-none">
              0
            </Text>
          </div>
          <Button variant="primary">Bulk Approve &quot;Nothing to Report&quot;</Button>
        </div>
        <TaskDataGrid />
      </List>

      <FrameworkSelectionDialog {...frameworkDialogProps} />

      <ExportProcessingAlert show={exporting} />
    </>
  );
};
