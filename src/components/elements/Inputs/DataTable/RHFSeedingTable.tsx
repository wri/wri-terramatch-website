import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { PropsWithChildren } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";
import * as yup from "yup";

import { FieldType, FormField } from "@/components/extensive/WizardForm/types";

import DataTable, { DataTableProps } from "./DataTable";

export interface RHFSeedingProps
  extends Omit<DataTableProps<any>, "value" | "onChange" | "fields" | "addButtonCaption" | "tableColumns">,
    UseControllerProps {
  formHook?: UseFormReturn;
  collection: string;
  captureCount: boolean;
}

export const getSeedingTableColumns = (
  t: typeof useT | Function = (t: string) => t,
  captureCount: boolean
): AccessorKeyColumnDef<any>[] =>
  captureCount
    ? [
        {
          accessorKey: "name",
          header: t("Species")
        },
        {
          accessorKey: "amount",
          header: t("Number of Seeds")
        }
      ]
    : [
        {
          accessorKey: "name",
          header: t("Species")
        },
        {
          accessorKey: "seeds_in_sample",
          header: t("Seeds Per Sample")
        },
        {
          accessorKey: "weight_of_sample",
          header: t("Sample Weight(Kg)")
        },
        {
          accessorKey: "seeds_per_kg",
          header: t("Seeds Per Kg"),
          cell: props => (props.row?.original?.seeds_in_sample / props.row?.original?.weight_of_sample).toFixed(2)
        }
      ];

export const getSeedingFields = (t: typeof useT | Function = (t: string) => t, captureCount: boolean): FormField[] =>
  captureCount
    ? [
        {
          label: t("Seed species or Mix"),
          name: "name",
          type: FieldType.Input,
          validation: yup.string().required(),
          fieldProps: {
            type: "text",
            required: true
          }
        },
        {
          label: t("Number of Seeds"),
          name: "amount",
          type: FieldType.Input,
          validation: yup.number().required(),
          fieldProps: {
            type: "number",
            required: true
          }
        }
      ]
    : [
        {
          label: t("Seed species or Mix"),
          name: "name",
          type: FieldType.Input,
          validation: yup.string().required(),
          fieldProps: {
            type: "text",
            required: true
          }
        },
        {
          label: t("Number of seeds in sample"),
          name: "seeds_in_sample",
          type: FieldType.Input,
          validation: yup.number().required(),
          fieldProps: {
            type: "number",
            required: true,
            step: 0.01
          }
        },
        {
          label: t("Weight of sample in KG"),
          name: "weight_of_sample",
          type: FieldType.Input,
          validation: yup.number().required(),
          fieldProps: {
            type: "number",
            required: true,
            step: 0.01
          }
        }
      ];

const RHFSeedingTable = ({ collection, captureCount, ...props }: PropsWithChildren<RHFSeedingProps>) => {
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
      additionalValues={{ collection }}
      addButtonCaption={t("Add Species or mix")}
      tableColumns={getSeedingTableColumns(t, captureCount)}
      fields={getSeedingFields(t, captureCount)}
    />
  );
};

export default RHFSeedingTable;
