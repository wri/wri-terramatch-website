import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { remove } from "lodash";
import { PropsWithChildren, useCallback } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";

import { FieldType } from "@/components/extensive/WizardForm/types";
import { getAgeOptions } from "@/constants/options/age";
import { getGenderOptionsWithUndefined } from "@/constants/options/gender";
import { getIndigeneityOptionsWithUndefined } from "@/constants/options/indigeneity";
import { Entity, Option } from "@/types/common";
import { formatOptionsList } from "@/utils/options";

import DataTable, { DataTableProps } from "./DataTable";

export interface RHFWorkdaysTableProps
  extends Omit<DataTableProps<any>, "value" | "onChange" | "fields" | "addButtonCaption" | "tableColumns">,
    UseControllerProps {
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
  entity: Entity;
  ethnicityOptions: Option[];
  collection: string;
}

export const getWorkdaysTableColumns = (
  t: typeof useT | Function = (t: string) => t,
  ethnicityOptions: Option[]
): AccessorKeyColumnDef<any>[] => [
  {
    accessorKey: "gender",
    header: t("Gender"),
    cell: props => formatOptionsList(getGenderOptionsWithUndefined(t), props.getValue() as string)
  },
  {
    accessorKey: "age",
    header: t("Age"),
    enableSorting: false,
    cell: props => formatOptionsList(getAgeOptions(t), props.getValue() as string)
  },
  {
    accessorKey: "ethnicity",
    header: t("Ethnicity"),
    enableSorting: false,
    cell: props => formatOptionsList(ethnicityOptions, props.getValue() as string)
  },
  {
    accessorKey: "indigeneity",
    header: t("Indigeneity"),
    cell: props => formatOptionsList(getIndigeneityOptionsWithUndefined(t), props.getValue() as string)
  },
  {
    accessorKey: "amount",
    header: t("Count")
  }
];

const RHFWorkdaysTable = ({
  onChangeCapture,
  entity,
  ethnicityOptions,
  collection,
  ...props
}: PropsWithChildren<RHFWorkdaysTableProps>) => {
  const t = useT();
  const {
    field: { value, onChange }
  } = useController(props);

  const createWorkday = useCallback(
    (data: any) => {
      onChange([...(value ?? []), { ...data, uuid: uuidv4(), collection }]);
    },
    [value, onChange]
  );

  const deleteWorkday = useCallback(
    (uuid: string | undefined) => {
      if (uuid != null) {
        remove(value, (v: any) => v.uuid === uuid);
        onChange(value);
      }
    },
    [value, onChange]
  );

  return (
    <DataTable
      {...props}
      value={value ?? []}
      handleCreate={createWorkday}
      handleDelete={deleteWorkday}
      addButtonCaption={t("Add Workdays")}
      tableColumns={getWorkdaysTableColumns(t, ethnicityOptions)}
      fields={[
        {
          label: t("Select Gender"),
          name: "gender",
          type: FieldType.Dropdown,
          validation: yup.string().required(),
          fieldProps: {
            options: getGenderOptionsWithUndefined(),
            required: true
          }
        },
        {
          label: t("Select Age"),
          name: "age",
          type: FieldType.Dropdown,
          validation: yup.string().required(),
          fieldProps: {
            options: getAgeOptions(),
            required: true
          }
        },
        {
          label: t("Specify Ethnicity, if known"),
          name: "ethnicity",
          type: FieldType.Input,
          validation: yup.string(),
          fieldProps: {
            type: "text",
            required: false
          }
        },
        {
          label: t("Indigeneity"),
          name: "indigeneity",
          type: FieldType.Dropdown,
          validation: yup.string().required(),
          fieldProps: {
            options: getIndigeneityOptionsWithUndefined(),
            required: true
          }
        },
        {
          label: t("How many workdays were created for the selected options?"),
          name: "amount",
          type: FieldType.Input,
          validation: yup.number().required(),
          fieldProps: {
            type: "number",
            required: true
          }
        }
      ]}
    />
  );
};

export default RHFWorkdaysTable;
