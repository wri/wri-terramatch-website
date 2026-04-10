import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { FC, PropsWithChildren, useCallback, useMemo, useState } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { FieldDefinition } from "@/components/extensive/WizardForm/types";
import { getGenderOptions } from "@/constants/options/gender";
import { useLocalStepsProvider } from "@/context/wizardForm.provider";
import { OwnershipStakeDto } from "@/generated/v3/userService/userServiceSchemas";
import { formatOptionsList } from "@/utils/options";

import DataTable, { DataTableProps } from "./DataTable";

export interface RHFOwnershipStakeTableProps
  extends Omit<DataTableProps<any>, "value" | "onChange" | "fieldsProvider" | "addButtonCaption" | "tableColumns">,
    UseControllerProps {
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
}

type OwnershipStake = Partial<Omit<OwnershipStakeDto, "entityType" | "entityUuid">>;

export const getOwnershipTableColumns = (t: typeof useT | Function = (t: string) => t): AccessorKeyColumnDef<any>[] => [
  { accessorKey: "firstName", header: t("First name") },
  { accessorKey: "lastName", header: t("Last name") },
  {
    accessorKey: "gender",
    header: t("Gender"),
    cell: props => formatOptionsList(getGenderOptions(t), props.getValue() as string)
  },
  { accessorKey: "title", header: t("Title") },
  { accessorKey: "percentOwnership", header: t("Percent Ownership") },
  { accessorKey: "yearOfBirth", header: t("Year of birth") }
];

const getOwnershipTableQuestions = (t: typeof useT): FieldDefinition[] => [
  {
    label: t("first name"),
    name: "firstName",
    inputType: "text",
    validation: { required: true }
  },
  {
    label: t("last name"),
    name: "lastName",
    inputType: "text",
    validation: { required: true }
  },
  {
    label: t("Gender"),
    name: "gender",
    inputType: "select",
    options: getGenderOptions(t),
    validation: { required: true }
  },
  {
    label: t("Title"),
    name: "title",
    inputType: "text",
    validation: { required: true }
  },
  {
    label: t("Year of birth"),
    name: "yearOfBirth",
    inputType: "number",
    validation: { required: true, min: 1900, max: 2050 }
  },
  {
    label: t("Percent Ownership"),
    name: "percentOwnership",
    inputType: "number",
    validation: { required: true, min: 1, max: 100 }
  }
];

const RHFOwnershipStakeTable: FC<PropsWithChildren<RHFOwnershipStakeTableProps>> = ({ onChangeCapture, ...props }) => {
  const t = useT();
  const {
    field: { value, onChange }
  } = useController(props);
  const [tableKey, setTableKey] = useState(0);

  const refreshTable = useCallback(() => {
    setTableKey(prev => prev + 1);
  }, []);

  const handleCreate = useCallback(
    (data: OwnershipStake) => {
      onChange([...value, data]);
      props.formHook?.trigger();
    },
    [onChange, props.formHook, value]
  );

  const handleDelete = useCallback(
    (uuid?: string) => {
      onChange((value as OwnershipStake[]).filter(item => (uuid == null ? item.uuid != null : item.uuid !== uuid)));
      props.formHook?.trigger();
    },
    [onChange, props.formHook, value]
  );

  const handleUpdate = useCallback(
    (data: OwnershipStake) => {
      onChange(
        (value as OwnershipStake[]).reduce(
          (update, entry) => (entry.uuid === data.uuid ? [...update, data] : [...update, entry]),
          [] as OwnershipStake[]
        )
      );
      props.formHook?.trigger();
      props.formHook?.reset(props?.formHook.getValues());
      props.formHook?.clearErrors(props.name);
      refreshTable();
    },
    [onChange, props.formHook, props.name, refreshTable, value]
  );

  const { columns, steps } = useMemo(
    () => ({
      columns: getOwnershipTableColumns(t),
      steps: [{ id: "ownershipStakeTable", fields: getOwnershipTableQuestions(t) }]
    }),
    [t]
  );
  const fieldsProvider = useLocalStepsProvider(steps);

  return (
    <DataTable
      key={tableKey}
      {...props}
      value={value}
      handleCreate={handleCreate}
      handleDelete={handleDelete}
      handleUpdate={handleUpdate}
      addButtonCaption={t("Add Ownership Stake")}
      modalEditTitle={t("Update Ownership Stake")}
      tableColumns={columns}
      fieldsProvider={fieldsProvider}
    />
  );
};

export default RHFOwnershipStakeTable;
