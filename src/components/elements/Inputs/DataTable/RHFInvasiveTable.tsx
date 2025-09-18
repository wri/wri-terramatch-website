import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { PropsWithChildren } from "react";
import { useController, UseControllerProps } from "react-hook-form";

import { getInvasiveTypeOptions } from "@/constants/options/invasives";
import { formatOptionsList } from "@/utils/options";

import DataTable, { DataTableProps } from "./DataTable";

export interface RHFInvasiveTableProps
  extends Omit<DataTableProps<any>, "value" | "onChange" | "fields" | "addButtonCaption" | "tableColumns">,
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

const RHFInvasiveTable = (props: PropsWithChildren<RHFInvasiveTableProps>) => {
  const t = useT();
  const {
    field: { value, onChange }
  } = useController(props);

  return (
    <DataTable
      {...props}
      value={value ?? []}
      onChange={onChange}
      generateUuids={true}
      addButtonCaption={t("Add invasive")}
      tableColumns={getInvasiveTableColumns(t)}
      questions={[
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
      ]}
    />
  );
};

export default RHFInvasiveTable;
