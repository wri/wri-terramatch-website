import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { PropsWithChildren } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { FieldDefinition } from "@/components/extensive/WizardForm/types";
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

export const getDisturbanceTableQuestions = (
  props: { hasIntensity?: boolean; hasExtent?: boolean },
  t: typeof useT | Function = (t: string) => t
) => {
  const questions: FieldDefinition[] = [
    {
      label: t("Disturbance Type"),
      name: "type",
      inputType: "select",
      options: getDisturbanceTypeOptions(),
      validation: { required: true }
    }
  ];

  if (props.hasIntensity) {
    questions.push({
      label: t("Intensity"),
      name: "intensity",
      inputType: "select",
      options: getDisturbanceIntensityOptions(),
      validation: { required: true }
    });
  }

  if (props.hasExtent) {
    questions.push({
      label: t("Extent (% Of Site Affected)"),
      name: "extent",
      inputType: "select",
      options: getDisturbanceExtentOptions(),
      validation: { required: true }
    });
  }

  questions.push({
    label: t("Description"),
    name: "description",
    inputType: "long-text",
    validation: { required: true }
  });

  return questions;
};

const RHFDisturbanceTable = ({ onChangeCapture, entity, ...props }: PropsWithChildren<RHFDisturbanceTableProps>) => {
  const t = useT();
  const {
    field: { value, onChange }
  } = useController(props);

  return (
    <DataTable
      {...props}
      value={value ?? []}
      generateUuids={true}
      onChange={onChange}
      addButtonCaption={t("Add Disturbance")}
      tableColumns={getDisturbanceTableColumns(props, t)}
      fields={getDisturbanceTableQuestions(props, t)}
    />
  );
};

export default RHFDisturbanceTable;
