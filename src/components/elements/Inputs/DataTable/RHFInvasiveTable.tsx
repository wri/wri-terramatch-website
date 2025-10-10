import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { FC, PropsWithChildren, useMemo } from "react";
import { useController, UseControllerProps } from "react-hook-form";

import { FieldDefinition } from "@/components/extensive/WizardForm/types";
import { getInvasiveTypeOptions } from "@/constants/options/invasives";
import { useLocalStepsProvider } from "@/context/wizardForm.provider";
import { formatOptionsList } from "@/utils/options";

import DataTable, { DataTableProps } from "./DataTable";

export interface RHFInvasiveTableProps
  extends Omit<DataTableProps<any>, "value" | "onChange" | "fieldsProvider" | "addButtonCaption" | "tableColumns">,
    UseControllerProps {}

export const getInvasiveTableColumns = (t: typeof useT | Function = (t: string) => t): AccessorKeyColumnDef<any>[] => [
  {
    accessorKey: "name",
    header: t("Plant Species")
  },
  {
    accessorKey: "type",
    header: t("Type"),
    cell: prop => formatOptionsList(getInvasiveTypeOptions(), prop.getValue() as string)
  }
];

const getInvasiveTableQuestions = (t: typeof useT): FieldDefinition[] => [
  {
    label: t("Plant Species"),
    placeholder: t("Add Species (scientific name)"),
    name: "name",
    inputType: "text",
    validation: { required: true }
  },
  {
    label: t("Type"),
    name: "type",
    inputType: "select",
    options: getInvasiveTypeOptions(),
    validation: { required: true }
  }
];

const RHFInvasiveTable: FC<PropsWithChildren<RHFInvasiveTableProps>> = props => {
  const t = useT();
  const {
    field: { value, onChange }
  } = useController(props);

  const { columns, steps } = useMemo(
    () => ({
      columns: getInvasiveTableColumns(t),
      steps: [{ id: "invasiveTable", fields: getInvasiveTableQuestions(t) }]
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
      addButtonCaption={t("Add invasive")}
      tableColumns={columns}
      fieldsProvider={fieldsProvider}
    />
  );
};

export default RHFInvasiveTable;
