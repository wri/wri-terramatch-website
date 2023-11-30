import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { PropsWithChildren } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";
import * as yup from "yup";

import { FieldType } from "@/components/extensive/WizardForm/types";
import { getInvasiveTypeOptions } from "@/constants/options/invasives";
import { useDeleteV2InvasivesUUID, usePostV2Invasives } from "@/generated/apiComponents";
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
  const { field } = useController(props);
  const value = field?.value || [];

  const { mutate: createInvasive } = usePostV2Invasives({
    onSuccess(data) {
      const _tmp = [...value];
      //@ts-ignore
      _tmp.push(data.data);
      field.onChange(_tmp);
    }
  });

  const { mutate: removeInvasive } = useDeleteV2InvasivesUUID({
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
        createInvasive({
          body: {
            ...data,
            model_type: entity?.entityName,
            //@ts-ignore
            model_uuid: entity?.entityUUID
          }
        });
      }}
      handleDelete={uuid => {
        if (uuid) {
          removeInvasive({ pathParams: { uuid } });
        }
      }}
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
