import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { remove } from "lodash";
import { PropsWithChildren, useCallback } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";

import { FieldType, FormField } from "@/components/extensive/WizardForm/types";
import {
  getDisturbanceExtentOptions,
  getDisturbanceIntensityOptions,
  getDisturbanceTypeOptions
} from "@/constants/options/disturbance";
import { Entity } from "@/types/common";
import { formatOptionsList } from "@/utils/options";

import DataTable, { DataTableProps } from "./DataTable";

export interface RHFDisturbanceTableProps
  extends Omit<DataTableProps<any>, "value" | "onChange" | "fields" | "addButtonCaption" | "tableColumns">,
    UseControllerProps {
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
  entity: Entity;
  hasIntensity?: boolean;
  hasExtent?: boolean;
}

export const getDisturbanceTableColumns = (
  props: { hasIntensity?: boolean; hasExtent?: boolean },
  t: typeof useT | Function = (t: string) => t
) => {
  const columns: AccessorKeyColumnDef<any>[] = [
    {
      accessorKey: "type",
      header: t("Disturbance Type"),
      cell: prop => formatOptionsList(getDisturbanceTypeOptions(), prop.getValue() as string)
    }
  ];

  if (props.hasIntensity) {
    columns.push({
      accessorKey: "intensity",
      header: t("Intensity"),
      cell: prop => formatOptionsList(getDisturbanceIntensityOptions(), prop.getValue() as string)
    });
  }

  if (props.hasExtent) {
    columns.push({
      accessorKey: "extent",
      header: t("Extent (% Of Site Affected)"),
      cell: prop => formatOptionsList(getDisturbanceExtentOptions(), prop.getValue() as string)
    });
  }

  columns.push({ accessorKey: "description", header: t("Description"), enableSorting: false });

  return columns;
};

export const getDisturbanceTableFields = (
  props: { hasIntensity?: boolean; hasExtent?: boolean },
  t: typeof useT | Function = (t: string) => t
) => {
  const fields: FormField[] = [
    {
      label: t("Disturbance Type"),
      name: "type",
      type: FieldType.Dropdown,
      validation: yup.string().required(),
      fieldProps: {
        options: getDisturbanceTypeOptions(),
        required: true
      }
    }
  ];

  if (props.hasIntensity) {
    fields.push({
      label: t("Intensity"),
      name: "intensity",
      type: FieldType.Dropdown,
      validation: yup.string().required(),
      fieldProps: {
        options: getDisturbanceIntensityOptions(),
        required: true
      }
    });
  }

  if (props.hasExtent) {
    fields.push({
      label: t("Extent (% Of Site Affected)"),
      name: "extent",
      type: FieldType.Dropdown,
      validation: yup.string().required(),
      fieldProps: {
        options: getDisturbanceExtentOptions(),
        required: true
      }
    });
  }

  fields.push({
    label: t("Description"),
    name: "description",
    type: FieldType.TextArea,
    validation: yup.string(),
    fieldProps: {
      required: false
    }
  });

  return fields;
};

const RHFDisturbanceTable = ({ onChangeCapture, entity, ...props }: PropsWithChildren<RHFDisturbanceTableProps>) => {
  const t = useT();
  const {
    field: { value, onChange }
  } = useController(props);

  const createDisturbance = useCallback(
    (data: any) => {
      onChange([...(value ?? []), { ...data, uuid: uuidv4() }]);
    },
    [value, onChange]
  );

  const deleteDisturbance = useCallback(
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
      handleCreate={createDisturbance}
      handleDelete={deleteDisturbance}
      addButtonCaption={t("Add Disturbance")}
      tableColumns={getDisturbanceTableColumns(props, t)}
      fields={getDisturbanceTableFields(props, t)}
    />
  );
};

export default RHFDisturbanceTable;
