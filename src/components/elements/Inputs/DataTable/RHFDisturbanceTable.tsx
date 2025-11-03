import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { FC, PropsWithChildren, useCallback, useMemo } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { FieldDefinition } from "@/components/extensive/WizardForm/types";
import {
  getDisturbanceExtentOptions,
  getDisturbanceIntensityOptions,
  getDisturbanceTypeOptions
} from "@/constants/options/disturbance";
import { useLocalStepsProvider } from "@/context/wizardForm.provider";
import { formatOptionsList } from "@/utils/options";

import DataTable, { DataTableProps } from "./DataTable";

export interface RHFDisturbanceTableProps
  extends Omit<DataTableProps<any>, "value" | "onChange" | "fieldsProvider" | "addButtonCaption" | "tableColumns">,
    UseControllerProps {
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
  hasIntensity?: boolean;
  hasExtent?: boolean;
}

export const getDisturbanceTableColumns = (
  hasIntensity?: boolean,
  hasExtent?: boolean,
  t: typeof useT | Function = (t: string) => t
) => {
  const columns: AccessorKeyColumnDef<any>[] = [
    {
      accessorKey: "type",
      header: t("Disturbance Type"),
      cell: prop => formatOptionsList(getDisturbanceTypeOptions(), prop.getValue() as string)
    }
  ];

  if (hasIntensity) {
    columns.push({
      accessorKey: "intensity",
      header: t("Intensity"),
      cell: prop => formatOptionsList(getDisturbanceIntensityOptions(), prop.getValue() as string)
    });
  }

  if (hasExtent) {
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
  hasIntensity?: boolean,
  hasExtent?: boolean,
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

  if (hasIntensity) {
    questions.push({
      label: t("Intensity"),
      name: "intensity",
      inputType: "select",
      options: getDisturbanceIntensityOptions(),
      validation: { required: true }
    });
  }

  if (hasExtent) {
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

const RHFDisturbanceTable: FC<PropsWithChildren<RHFDisturbanceTableProps>> = ({ onChangeCapture, ...props }) => {
  const t = useT();
  const {
    field: { value, onChange }
  } = useController(props);

  const { columns, steps } = useMemo(
    () => ({
      columns: getDisturbanceTableColumns(props.hasIntensity, props.hasExtent, t),
      steps: [{ id: "disturbanceTable", fields: getDisturbanceTableQuestions(props.hasIntensity, props.hasExtent, t) }]
    }),
    [props.hasExtent, props.hasIntensity, t]
  );
  const fieldsProvider = useLocalStepsProvider(steps);

  const _onChange = useCallback(
    (values: any) => {
      onChange(values);
      props.formHook?.trigger();
    },
    [onChange, props.formHook]
  );

  return (
    <DataTable
      {...props}
      value={value ?? []}
      generateUuids={true}
      onChange={_onChange}
      addButtonCaption={t("Add Disturbance")}
      tableColumns={columns}
      fieldsProvider={fieldsProvider}
    />
  );
};

export default RHFDisturbanceTable;
