import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { FC, PropsWithChildren, useCallback, useMemo, useState } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { FieldDefinition } from "@/components/extensive/WizardForm/types";
import { getFundingTypesOptions } from "@/constants/options/fundingTypes";
import { useCurrencyContext } from "@/context/currency.provider";
import { useLocalStepsProvider } from "@/context/wizardForm.provider";
import { currencyInput } from "@/utils/financialReport";
import { formatOptionsList } from "@/utils/options";

import DataTable, { DataTableProps } from "./DataTable";

export interface RHFFundingTypeTableProps
  extends Omit<DataTableProps<any>, "value" | "onChange" | "fieldsProvider" | "addButtonCaption" | "tableColumns">,
    UseControllerProps {
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
}

type FundingTypeData = {
  uuid: string;
  year: number;
  type: string;
  source: string;
  amount: number;
};

export const getFundingTypeTableColumns = (
  t: typeof useT | Function = (t: string) => t
): AccessorKeyColumnDef<FundingTypeData>[] => [
  { accessorKey: "year", header: t("Funding year") },
  {
    accessorKey: "type",
    header: t("Funding type"),
    cell: props => formatOptionsList(getFundingTypesOptions(t), props.getValue() as string)
  },
  { accessorKey: "source", header: t("Funding source") },
  { accessorKey: "amount", header: t("Funding amount") }
];

export const getFundingTypeQuestions = (t: typeof useT | Function = (t: string) => t): FieldDefinition[] => [
  {
    label: t("Select Funding year"),
    name: "year",
    inputType: "select",
    validation: { required: true },
    options: Array(6)
      .fill(0)
      .map((_, index) => {
        const year = new Date().getFullYear() - 5 + index;
        return { title: `${year}`, value: year };
      })
  },
  {
    label: t("Select Funding type"),
    name: "type",
    inputType: "select",
    options: getFundingTypesOptions(t),
    validation: { required: true }
  },
  {
    label: t("Funding source"),
    name: "source",
    inputType: "text",
    validation: { required: true }
  },
  {
    label: t("Funding amount"),
    name: "amount",
    inputType: "number",
    validation: { required: true }
  }
];

const RHFFundingTypeDataTable: FC<PropsWithChildren<RHFFundingTypeTableProps>> = ({ onChangeCapture, ...props }) => {
  const t = useT();
  const { field } = useController(props);
  const value = useMemo((): FundingTypeData[] => (Array.isArray(field?.value) ? field.value : []), [field?.value]);
  const [tableKey, setTableKey] = useState(0);

  const { currency } = useCurrencyContext();

  const refreshTable = () => {
    setTableKey(prev => prev + 1);
  };

  const clearErrors = useCallback(() => {
    props?.formHook?.clearErrors(props.name);
  }, [props?.formHook, props.name]);

  const createItem = useCallback(
    (data: any) => {
      const next = [...value, data];
      field.onChange(next);
      onChangeCapture?.();
      clearErrors();
      refreshTable();
    },
    [value, field, onChangeCapture, clearErrors]
  );

  const removeItem = useCallback(
    (uuid?: string) => {
      if (!uuid) return;
      const next = (value as any[]).filter(item => item?.uuid !== uuid);
      field.onChange(next);
      onChangeCapture?.();
      clearErrors();
      refreshTable();
    },
    [value, field, onChangeCapture, clearErrors]
  );

  const updateItem = useCallback(
    (data: any) => {
      if (!data?.uuid) return;
      const next = [...value];
      const index = next.findIndex((item: any) => item?.uuid === data.uuid);
      if (index !== -1) {
        next[index] = { ...next[index], ...data };
        field.onChange(next);
        onChangeCapture?.();
        clearErrors();
        refreshTable();
      }
    },
    [value, field, onChangeCapture, clearErrors]
  );

  const { columns, steps } = useMemo(
    () => ({
      columns: getFundingTypeTableColumns(t).map(col =>
        col.accessorKey === "amount"
          ? {
              ...col,
              cell: (props: any) =>
                (currencyInput[currency] ? currencyInput[currency] + " " : "") + (props.getValue() ?? "")
            }
          : col
      ),
      steps: [{ id: "fundingTypeTable", fields: getFundingTypeQuestions(t) }]
    }),
    [currency, t]
  );
  const fieldsProvider = useLocalStepsProvider(steps);

  return (
    <DataTable<FundingTypeData>
      key={tableKey}
      {...props}
      value={value}
      handleCreate={createItem}
      handleDelete={removeItem}
      handleUpdate={updateItem}
      addButtonCaption={t("Add funding source")}
      modalEditTitle={t("Update funding source")}
      tableColumns={columns}
      fieldsProvider={fieldsProvider}
      hasPagination={true}
      invertSelectPagination={true}
    />
  );
};

export default RHFFundingTypeDataTable;
