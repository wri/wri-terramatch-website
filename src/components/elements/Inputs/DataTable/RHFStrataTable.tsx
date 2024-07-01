import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { PropsWithChildren } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";
import * as yup from "yup";

import { FieldType } from "@/components/extensive/WizardForm/types";
import { Entity } from "@/types/common";

import DataTable, { DataTableProps } from "./DataTable";

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
      fields={[
        {
          label: t("Percentage of the amount of the site area affected"),
          name: "extent",
          type: FieldType.Input,
          validation: yup.number().min(1).max(100).required(),
          fieldProps: {
            type: "number",
            min: 1,
            max: 100,
            required: true
          }
        },
        {
          label: t("Characteristics of the strata"),
          name: "description",
          type: FieldType.TextArea,
          validation: yup.string().max(200).required(),
          fieldProps: {
            required: true,
            maxLength: 200
          }
        }
      ]}
    />
  );
};

export default RHFStrataTable;
