import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { PropsWithChildren, useCallback, useMemo, useState } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";
import * as yup from "yup";

import { FieldType, FormField } from "@/components/extensive/WizardForm/types";
import { getFundingTypesOptions } from "@/constants/options/fundingTypes";
import { useCurrencyContext } from "@/context/currency.provider";
import { currencyInput } from "@/utils/financialReport";
import { formatOptionsList } from "@/utils/options";

import DataTable, { DataTableProps } from "./DataTable";

export interface RHFFundingTypeTableProps
  extends Omit<DataTableProps<any>, "value" | "onChange" | "fields" | "addButtonCaption" | "tableColumns">,
    UseControllerProps {
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
}

export const getFundingTypeTableColumns = (
  t: typeof useT | Function = (t: string) => t
): AccessorKeyColumnDef<any>[] => [
  { accessorKey: "year", header: t("Funding year") },
  {
    accessorKey: "type",
    header: t("Funding type"),
    cell: props => formatOptionsList(getFundingTypesOptions(t), props.getValue() as string)
  },
  { accessorKey: "source", header: t("Funding source") },
  { accessorKey: "amount", header: t("Funding amount") }
];

export const getFundingTypeFields = (t: typeof useT | Function = (t: string) => t): FormField[] => {
  return [
    {
      label: t("Select Funding year"),
      name: "year",
      type: FieldType.Dropdown,
      validation: yup.string().required(),
      fieldProps: {
        options: Array(6)
          .fill(0)
          .map((_, index) => {
            const year = new Date().getFullYear() - 5 + index;
            return { title: `${year}`, value: year };
          }),
        required: true
      }
    },
    {
      label: t("Select Funding type"),
      name: "type",
      type: FieldType.Dropdown,
      validation: yup.string().required(),
      fieldProps: {
        options: getFundingTypesOptions(t),
        required: true
      }
    },
    {
      label: t("Funding source"),
      name: "source",
      type: FieldType.Input,
      validation: yup.string().required(),
      fieldProps: {
        type: "text",
        required: true
      }
    },
    {
      label: t("Funding amount"),
      name: "amount",
      type: FieldType.Input,
      validation: yup.string().min(0).max(9999999999999).required(),
      fieldProps: {
        type: "number",
        required: true
      }
    }
  ];
};

/**
 * @param props PropsWithChildren<RHFSelectProps>
 * @returns React Hook Form Ready Select Component
 */
const RHFFundingTypeDataTable = ({ ...props }: PropsWithChildren<RHFFundingTypeTableProps>) => {
  const t = useT();
  const { field } = useController(props);
  const value = useMemo(() => (Array.isArray(field?.value) ? field.value : []), [field?.value]);
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
      clearErrors();
      refreshTable();
    },
    [value, field, clearErrors]
  );

  const removeItem = useCallback(
    (uuid?: string) => {
      if (!uuid) return;
      const next = (value as any[]).filter(item => item?.uuid !== uuid);
      field.onChange(next);
      clearErrors();
      refreshTable();
    },
    [value, field, clearErrors]
  );

  const updateItem = useCallback(
    (data: any) => {
      const index = data?.index !== undefined ? data.index : -1;
      if (index === -1) return;
      
      const next = [...value];
      // Remove the index field from the data object before updating the item
      const { index: _, ...dataWithoutIndex } = data;
      next[index] = { ...next[index], ...dataWithoutIndex };
      field.onChange(next);
      clearErrors();
      refreshTable();
    },
    [value, field, clearErrors]
  );

  const tableColumnsWithCurrency: AccessorKeyColumnDef<any>[] = getFundingTypeTableColumns(t).map(col =>
    col.accessorKey === "amount"
      ? {
          ...col,
          cell: (props: any) =>
            (currencyInput[currency] ? currencyInput[currency] + " " : "") + (props.getValue() ?? "")
        }
      : col
  );
  return (
    <DataTable
      key={tableKey}
      {...props}
      value={value ?? []}
      handleCreate={data => {
        createItem(data);
      }}
      handleDelete={uuid => {
        removeItem(uuid);
      }}
      handleUpdate={data => {
        updateItem(data);
      }}
      addButtonCaption={t("Add funding source")}
      modalEditTitle={t("Update funding source")}
      tableColumns={tableColumnsWithCurrency}
      fields={getFundingTypeFields(t)}
      hasPagination={true}
      invertSelectPagination={true}
    />
  );
};

export default RHFFundingTypeDataTable;
