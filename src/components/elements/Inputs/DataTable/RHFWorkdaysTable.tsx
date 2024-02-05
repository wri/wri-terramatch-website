import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { PropsWithChildren } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";
import * as yup from "yup";

import { FieldType } from "@/components/extensive/WizardForm/types";
import { getAgeOptions } from "@/constants/options/age";
import { getGenderOptionsWithUndefined } from "@/constants/options/gender";
import { getIndigeneityOptionsWithUndefined } from "@/constants/options/indigeneity";
import { useDeleteV2WorkdaysUUID, usePostV2Workdays } from "@/generated/apiComponents";
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
  const { field } = useController(props);
  const value = field?.value || [];

  const { mutate: createStrata } = usePostV2Workdays({
    onSuccess(data) {
      const _tmp = [...value];
      //@ts-ignore
      _tmp.push(data.data);
      field.onChange(_tmp);
    }
  });

  const { mutate: removeStrata } = useDeleteV2WorkdaysUUID({
    onSuccess(data, variables) {
      //@ts-ignore
      _.remove(value, v => v.uuid === variables.pathParams.uuid);
      field.onChange(value);
    }
  });

  return (
    <DataTable
      {...props}
      value={value}
      handleCreate={data => {
        createStrata({
          body: {
            ...data,
            collection,
            model_type: entity?.entityName,
            //@ts-ignore
            model_uuid: entity?.entityUUID
          }
        });
      }}
      handleDelete={uuid => {
        if (uuid) {
          removeStrata({ pathParams: { uuid } });
        }
      }}
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
          validation: yup.string().required(),
          fieldProps: {
            type: "text",
            required: true
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
