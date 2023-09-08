import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { PropsWithChildren } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";
import * as yup from "yup";

import { FieldType, FormField } from "@/components/extensive/WizardForm/types";
import { getFundingTypesOptions } from "@/constants/options/fundingTypes";
import { useDeleteV2FundingTypeUUID, usePostV2FundingType } from "@/generated/apiComponents";
import { useMyOrg } from "@/hooks/useMyOrg";

import DataTable, { DataTableProps } from "./DataTable";

export interface RHFFundingTypeTableProps
  extends Omit<DataTableProps<any>, "value" | "onChange" | "fields" | "addButtonCaption" | "tableHeaders">,
    UseControllerProps {
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
}

export const getFundingTypeTableHeaders = (
  t: typeof useT | Function = (t: string) => t
): AccessorKeyColumnDef<any>[] => [
  { accessorKey: "year", header: t("Funding year") },
  { accessorKey: "type", header: t("Funding type") },
  { accessorKey: "source", header: t("Funding source") },
  { accessorKey: "amount", header: t("Funding amount") }
];

export const getFundingTypeFields = (t: typeof useT | Function = (t: string) => t): FormField[] => {
  return [
    {
      label: "Select Funding year",
      name: "year",
      type: FieldType.Dropdown,
      validation: yup.string().required(),
      fieldProps: {
        options: Array(10)
          .fill(2014)
          .map((item, index) => ({ title: `${item + index}`, value: `${item + index}` })),
        required: true
      }
    },
    {
      label: "Select Funding type",
      name: "type",
      type: FieldType.Dropdown,
      validation: yup.string().required(),
      fieldProps: {
        options: getFundingTypesOptions(t),
        required: true
      }
    },
    {
      label: "Funding source",
      name: "source",
      type: FieldType.Input,
      validation: yup.string().required(),
      fieldProps: {
        type: "text",
        required: true
      }
    },
    {
      label: "Funding amount in USD",
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

  const myOrg = useMyOrg();
  const organisationId = myOrg?.uuid;

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

  return (
    <DataTable
      {...props}
      value={value || []}
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
      addButtonCaption={t("Add funding source")}
      tableHeaders={getFundingTypeTableHeaders(t)}
      fields={getFundingTypeFields(t)}
    />
  );
};

export default RHFFundingTypeDataTable;
