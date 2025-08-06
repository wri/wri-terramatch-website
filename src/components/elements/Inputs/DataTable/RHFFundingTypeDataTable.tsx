import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { PropsWithChildren, useCallback, useState } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";
import * as yup from "yup";

import { FieldType, FormField } from "@/components/extensive/WizardForm/types";
import { useMyOrg } from "@/connections/Organisation";
import { getFundingTypesOptions } from "@/constants/options/fundingTypes";
import { useCurrencyContext } from "@/context/currency.provider";
import { useDeleteV2FundingTypeUUID, usePatchV2FundingTypeUUID, usePostV2FundingType } from "@/generated/apiComponents";
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
const RHFFundingTypeDataTable = ({ onChangeCapture, ...props }: PropsWithChildren<RHFFundingTypeTableProps>) => {
  const t = useT();
  const { field } = useController(props);
  const value = field?.value || [];
  const [tableKey, setTableKey] = useState(0);

  const [, { organisationId }] = useMyOrg();
  const { currency } = useCurrencyContext();

  const refreshTable = () => {
    setTableKey(prev => prev + 1);
  };

  const { mutate: createTeamMember } = usePostV2FundingType({
    onSuccess(data) {
      const _tmp = [...value];
      //@ts-ignore
      _tmp.push(data.data);
      field.onChange(_tmp);
    }
  });

  const { mutate: removeTeamMember } = useDeleteV2FundingTypeUUID({
    onSuccess(data, variables) {
      //@ts-ignore
      _.remove(value, v => v.uuid === variables.pathParams.uuid);
      field.onChange(value);
    }
  });

  const { mutate: updateTeamMember } = usePatchV2FundingTypeUUID({
    onSuccess(data, variables) {
      const _tmp = [...value];
      //@ts-ignore
      const index = _tmp.findIndex(item => item.uuid === data.data.uuid);

      if (index !== -1) {
        //@ts-ignore
        _tmp[index] = data.data;
        field.onChange(_tmp);
        onChangeCapture?.();
        props?.formHook?.reset(props?.formHook.getValues());
        clearErrors();
        refreshTable();
      }
    }
  });

  const clearErrors = useCallback(() => {
    props?.formHook?.clearErrors(props.name);
  }, [props?.formHook, props.name]);

  const formattedValue = value.map((item: any) => ({
    ...item,
    amount: currencyInput[currency] ? currencyInput[currency] + " " + item?.amount : item?.amount
  }));
  return (
    <DataTable
      key={tableKey}
      {...props}
      value={formattedValue || []}
      handleCreate={data => {
        createTeamMember({
          body: {
            ...data,
            organisation_id: organisationId
          }
        });
      }}
      handleDelete={uuid => {
        if (uuid) {
          removeTeamMember({ pathParams: { uuid } });
        }
      }}
      handleUpdate={data => {
        if (data.uuid) {
          updateTeamMember({
            pathParams: { uuid: data.uuid },
            body: { ...data }
          });
        }
      }}
      addButtonCaption={t("Add funding source")}
      modalEditTitle={t("Update funding source")}
      tableColumns={getFundingTypeTableColumns(t)}
      fields={getFundingTypeFields(t)}
      hasPagination={true}
      invertSelectPagination={true}
    />
  );
};

export default RHFFundingTypeDataTable;
