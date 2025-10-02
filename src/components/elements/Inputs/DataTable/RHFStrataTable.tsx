import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { FC, PropsWithChildren, useMemo } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { FieldDefinition } from "@/components/extensive/WizardForm/types";
import { useLocalStepsProvider } from "@/context/wizardForm.provider";

import DataTable, { DataTableProps } from "./DataTable";

export interface RHFStrataTableProps
  extends Omit<DataTableProps<any>, "value" | "onChange" | "fieldsProvider" | "addButtonCaption" | "tableColumns">,
    UseControllerProps {
  formHook?: UseFormReturn;
}

export const getStrataTableColumns = (t: typeof useT | Function = (t: string) => t): AccessorKeyColumnDef<any>[] => [
  { accessorKey: "extent", header: t("Percentage") },
  { accessorKey: "description", header: t("Characteristics"), enableSorting: false }
];

const getStrataTableQuestions = (t: typeof useT): FieldDefinition[] => [
  {
    label: t("Percentage of the amount of the site area affected"),
    name: "extent",
    inputType: "number",
    validation: { required: true, min: 1, max: 100 }
  },
  {
    label: t("Characteristics of the strata"),
    name: "description",
    inputType: "long-text",
    maxCharacterLimit: 200,
    validation: { required: true }
  }
];

const RHFStrataTable: FC<PropsWithChildren<RHFStrataTableProps>> = props => {
  const t = useT();
  const {
    field: { value, onChange }
  } = useController(props);

  const { columns, steps } = useMemo(
    () => ({
      columns: getStrataTableColumns(t),
      steps: [{ id: "strataTable", fields: getStrataTableQuestions(t) }]
    }),
    [t]
  );
  const fieldsProvider = useLocalStepsProvider(steps);

  return (
    <DataTable
      {...props}
      value={value ?? []}
      onChange={onChange}
      generateUuids={true}
      addButtonCaption={t("Add Strata")}
      tableColumns={columns}
      fieldsProvider={fieldsProvider}
    />
  );
};

export default RHFStrataTable;
