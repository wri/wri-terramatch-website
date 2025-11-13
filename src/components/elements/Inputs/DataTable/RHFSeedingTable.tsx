import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { FC, PropsWithChildren, useMemo } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { FieldDefinition } from "@/components/extensive/WizardForm/types";
import { useLocalStepsProvider } from "@/context/wizardForm.provider";

import DataTable, { DataTableProps } from "./DataTable";

export interface RHFSeedingProps
  extends Omit<DataTableProps<any>, "value" | "onChange" | "fieldsProvider" | "addButtonCaption" | "tableColumns">,
    UseControllerProps {
  formHook?: UseFormReturn;
  collection: string;
  captureCount: boolean;
}

export const getSeedingTableColumns = (
  t: typeof useT | Function = (t: string) => t,
  captureCount: boolean = false
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
          accessorKey: "seedsInSample",
          header: t("Seeds Per Sample")
        },
        {
          accessorKey: "weightOfSample",
          header: t("Sample Weight(Kg)")
        },
        {
          accessorKey: "seedsPerKg",
          header: t("Seeds Per Kg"),
          cell: props => {
            const original = props.row?.original ?? {};
            if (original.seedsInSample == null || original.weightOfSample === 0 || original.weightOfSample == null) {
              return null;
            }
            return (original.seedsInSample / original.weightOfSample).toFixed(2);
          }
        }
      ];

export const getSeedingsQuestions = (
  t: typeof useT | Function = (t: string) => t,
  captureCount: boolean
): FieldDefinition[] =>
  captureCount
    ? [
        {
          label: t("Seed species or Mix"),
          name: "name",
          inputType: "text",
          validation: { required: true }
        },
        {
          label: t("Number of Seeds"),
          name: "amount",
          inputType: "number",
          validation: { required: true }
        }
      ]
    : [
        {
          label: t("Seed species or Mix"),
          name: "name",
          inputType: "text",
          validation: { required: true }
        },
        {
          label: t("Number of seeds in sample"),
          name: "seedsInSample",
          inputType: "number",
          validation: { required: true },
          additionalProps: { step: 0.01 }
        },
        {
          label: t("Weight of sample in KG"),
          name: "weightOfSample",
          inputType: "number",
          validation: { required: true },
          additionalProps: { step: 0.01 }
        }
      ];

const RHFSeedingTable: FC<PropsWithChildren<RHFSeedingProps>> = ({ collection, captureCount, ...props }) => {
  const t = useT();
  const {
    field: { value, onChange }
  } = useController(props);

  const { columns, steps } = useMemo(
    () => ({
      columns: getSeedingTableColumns(t, captureCount),
      steps: [{ id: "seedingTable", fields: getSeedingsQuestions(t, captureCount) }]
    }),
    [captureCount, t]
  );
  const fieldsProvider = useLocalStepsProvider(steps);

  return (
    <DataTable
      {...props}
      value={value ?? []}
      onChange={onChange}
      generateUuids={true}
      additionalValues={{ collection }}
      addButtonCaption={t("Add Species or mix")}
      tableColumns={columns}
      fieldsProvider={fieldsProvider}
    />
  );
};

export default RHFSeedingTable;
