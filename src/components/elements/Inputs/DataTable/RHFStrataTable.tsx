import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { PropsWithChildren } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { Entity } from "@/types/common";

import DataTable, { DataTableProps } from "./DataTable";

// TODO:
//  * Get entity from the entity context
export interface RHFStrataTableProps
  extends Omit<DataTableProps<any>, "value" | "onChange" | "fields" | "addButtonCaption" | "tableColumns">,
    UseControllerProps {
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
  entity: Entity;
}

export const getStrataTableColumns = (t: typeof useT | Function = (t: string) => t): AccessorKeyColumnDef<any>[] => [
  { accessorKey: "extent", header: t("Percentage") },
  { accessorKey: "description", header: t("Characteristics"), enableSorting: false }
];

const RHFStrataTable = ({ onChangeCapture, entity, ...props }: PropsWithChildren<RHFStrataTableProps>) => {
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
      addButtonCaption={t("Add Strata")}
      tableColumns={getStrataTableColumns(t)}
      questions={[
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
      ]}
    />
  );
};

export default RHFStrataTable;
