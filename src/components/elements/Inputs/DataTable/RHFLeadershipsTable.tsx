import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { FC, PropsWithChildren, useCallback, useMemo, useState } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { FieldDefinition } from "@/components/extensive/WizardForm/types";
import { useGadmOptions } from "@/connections/Gadm";
import { getGenderOptions } from "@/constants/options/gender";
import { useLocalStepsProvider } from "@/context/wizardForm.provider";
import { LeadershipDto } from "@/generated/v3/userService/userServiceSchemas";
import { Option } from "@/types/common";
import { formatOptionsList } from "@/utils/options";

import DataTable, { DataTableProps } from "./DataTable";

export interface RHFLeadershipsTableProps
  extends Omit<DataTableProps<any>, "value" | "onChange" | "fieldsProvider" | "addButtonCaption" | "tableColumns">,
    UseControllerProps {
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
  collection?: string;
}

type Leadership = Partial<Omit<LeadershipDto, "entityType" | "entityUuid">>;

export const getLeadershipsTableColumns = (
  t: typeof useT | Function = (t: string) => t
): AccessorKeyColumnDef<any>[] => [
  { accessorKey: "firstName", header: t("First name") },
  { accessorKey: "lastName", header: t("Last name") },
  {
    accessorKey: "gender",
    header: t("Gender"),
    cell: props => formatOptionsList(getGenderOptions(t), props.getValue() as string)
  },
  { accessorKey: "age", header: t("Age") },
  {
    accessorKey: "position",
    header: t("Role")
  },
  {
    accessorKey: "nationality",
    header: t("Nationality")
  }
];

const getLeadershipsTableQuestions = (countryOptions: Option[], t: typeof useT): FieldDefinition[] => [
  {
    label: t("Team Member first name"),
    name: "firstName",
    inputType: "text",
    validation: { required: true }
  },
  {
    label: t("Team member last name"),
    name: "lastName",
    inputType: "text",
    validation: { required: true }
  },
  {
    label: t("Team member Gender"),
    name: "gender",
    inputType: "select",
    options: getGenderOptions(t),
    validation: { required: true }
  },
  {
    label: t("Age"),
    name: "age",
    inputType: "number",
    validation: { required: true, min: 16, max: 150 }
  },
  {
    label: t("Role"),
    name: "position",
    inputType: "text",
    validation: { required: true }
  },
  {
    label: t("Nationality"),
    name: "nationality",
    inputType: "select",
    options: countryOptions ?? [],
    validation: { required: true }
  }
];

const RHFLeadershipsDataTable: FC<PropsWithChildren<RHFLeadershipsTableProps>> = ({ onChangeCapture, ...props }) => {
  const t = useT();
  const { field } = useController(props);
  const value: Leadership[] = useMemo(() => field.value ?? [], [field.value]);
  const { onChange } = field;
  const { collection } = props;
  const countryOptions = useGadmOptions({ level: 0 });
  const [tableKey, setTableKey] = useState(0);

  const refreshTable = useCallback(() => {
    setTableKey(prev => prev + 1);
  }, []);

  const handleCreate = useCallback(
    (data: Leadership) => {
      onChange([...value, data]);
      props.formHook?.trigger();
    },
    [onChange, props.formHook, value]
  );

  const handleDelete = useCallback(
    (uuid?: string) => {
      onChange(value.filter(item => (uuid == null ? item.uuid != null : item.uuid !== uuid)));
      props.formHook?.trigger();
    },
    [onChange, props.formHook, value]
  );

  const handleUpdate = useCallback(
    (data: Leadership) => {
      onChange(
        value.reduce(
          (update, entry) => (entry.uuid === data.uuid ? [...update, data] : [...update, entry]),
          [] as Leadership[]
        )
      );
      props.formHook?.trigger();
      props.formHook?.reset(props.formHook?.getValues());
      props.formHook?.clearErrors(props.name);
      refreshTable();
    },
    [onChange, props.formHook, props.name, refreshTable, value]
  );

  const conditionalFunctions = collection === "leadership-team" ? { handleUpdate } : {};

  const { columns, steps } = useMemo(
    () => ({
      columns: getLeadershipsTableColumns(t),
      steps: [{ id: "leadershipsTable", fields: getLeadershipsTableQuestions(countryOptions ?? [], t) }]
    }),
    [countryOptions, t]
  );
  const fieldsProvider = useLocalStepsProvider(steps);

  return (
    <DataTable
      key={tableKey}
      {...props}
      {...conditionalFunctions}
      value={value}
      handleCreate={handleCreate}
      handleDelete={handleDelete}
      addButtonCaption={t("Add team member")}
      modalEditTitle={t("Update team member")}
      tableColumns={columns}
      fieldsProvider={fieldsProvider}
    />
  );
};

export default RHFLeadershipsDataTable;
