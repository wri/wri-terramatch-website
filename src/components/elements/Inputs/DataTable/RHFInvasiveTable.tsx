import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { PropsWithChildren } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";
import * as yup from "yup";

import { FieldType } from "@/components/extensive/WizardForm/types";
import { getInvasiveTypeOptions } from "@/constants/options/invasives";
import { Entity } from "@/types/common";
import { formatOptionsList } from "@/utils/options";

import DataTable, { DataTableProps } from "./DataTable";

export interface RHFInvasiveTableProps
  extends Omit<DataTableProps<any>, "value" | "onChange" | "fields" | "addButtonCaption" | "tableColumns">,
    UseControllerProps {
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
  entity: Entity;
}

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

const RHFInvasiveTable = ({ onChangeCapture, entity, ...props }: PropsWithChildren<RHFInvasiveTableProps>) => {
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
      fields={[
        {
          label: t("Plant Species"),
          placeholder: t("Add Species (scientific name)"),
          name: "name",
          type: FieldType.Input,
          validation: yup.string().required(),
          fieldProps: {
            type: "text",
            required: true
          }
        },
        {
          label: t("Type"),
          name: "type",
          type: FieldType.Dropdown,
          validation: yup.string().required(),
          fieldProps: {
            options: getInvasiveTypeOptions(),
            required: true
          }
        }
      ]}
    />
  );
};

export default RHFInvasiveTable;
