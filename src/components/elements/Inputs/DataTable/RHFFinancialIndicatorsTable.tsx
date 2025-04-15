import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { PropsWithChildren, useCallback } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";
import * as yup from "yup";

import { FieldType } from "@/components/extensive/WizardForm/types";
import { useMyOrg } from "@/connections/Organisation";
import { getGenderOptions } from "@/constants/options/gender";
import {
  useDeleteV2FinancialIndicatorsUUID,
  usePatchV2FinancialIndicatorsUUID,
  usePostV2FinancialIndicators
} from "@/generated/apiComponents";
import { formatOptionsList } from "@/utils/options";

import DataTable, { DataTableProps } from "./DataTable";

export interface RHFFinancialIndicatorsTableProps
  extends Omit<DataTableProps<any>, "value" | "onChange" | "fields" | "addButtonCaption" | "tableColumns">,
    UseControllerProps {
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
  collection?: string;
  years?: Array<number>;
  model?: string;
}

export const getFinancialIndicatorsColumns = (
  t: typeof useT | Function = (t: string) => t
): AccessorKeyColumnDef<any>[] => [
  { accessorKey: "amount", header: t("Amount") },
  { accessorKey: "year", header: t("Year") },
  {
    accessorKey: "documentation",
    header: t("Document"),
    cell: props => formatOptionsList(getGenderOptions(t), props.getValue() as string)
  },
  { accessorKey: "description", header: t("Description") }
];

/**
 * @param props PropsWithChildren<RHFSelectProps>
 * @returns React Hook Form Ready Select Component
 */
const RHFFinancialIndicators = ({ onChangeCapture, ...props }: PropsWithChildren<RHFFinancialIndicatorsTableProps>) => {
  const t = useT();
  const { field } = useController(props);
  const { formHook, collection, years } = props;

  const value = field?.value || [];

  const [, { organisationId }] = useMyOrg();

  const { mutate: createTeamMember } = usePostV2FinancialIndicators({
    onSuccess(data) {
      const _tmp = [...value];
      //@ts-ignore
      _tmp.push(data.data);
      field.onChange(_tmp);
      clearErrors();
    }
  });

  const { mutate: removeTeamMember } = useDeleteV2FinancialIndicatorsUUID({
    onSuccess(data, variables) {
      //@ts-ignore
      _.remove(value, v => v.uuid === variables.pathParams.uuid);
      field.onChange(value);
      clearErrors();
    }
  });

  const { mutate: updateTeamMember } = usePatchV2FinancialIndicatorsUUID({
    onSuccess(data, variables) {
      //@ts-ignore
      _.remove(value, v => v.uuid === variables.pathParams.uuid);
      field.onChange(value);
    }
  });

  const clearErrors = useCallback(() => {
    formHook?.clearErrors(props.name);
  }, [formHook, props.name]);

  return (
    <DataTable
      {...props}
      value={value}
      handleCreate={data => {
        createTeamMember({
          body: {
            ...data,
            organisation_id: organisationId,
            collection
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
            body: {
              ...data
            }
          });
        }
      }}
      addButtonCaption={t("Add {item}", { item: collection === "revenue" ? "Revenue" : "Profit Budget" })}
      modalTitle={t("Add Financial History")}
      tableColumns={getFinancialIndicatorsColumns(t)}
      fields={[
        {
          label: t("Amount"),
          name: "amount",
          placeholder: "Insert Amount",
          type: FieldType.Input,
          validation: yup.string().required(),
          fieldProps: {
            type: "number",
            required: true
          }
        },
        {
          label: t("Year"),
          name: "year",
          type: FieldType.Dropdown,
          validation: yup.string().required(),
          fieldProps: {
            options:
              years?.map(year => {
                return { title: `${year}`, value: year };
              }) ?? [],
            required: true
          }
        },
        {
          label: t("Upload"),
          name: "upload",
          type: FieldType.FileUpload,
          validation: yup.string().required(),
          fieldProps: {
            uuid: field.name,
            collection: "general-documents",
            model: "financialIndicators",
            allowMultiple: false
          }
        },
        {
          label: t("Description"),
          name: "description",
          placeholder: "Insert Description",
          type: FieldType.TextArea,
          validation: yup.string().required(),
          fieldProps: {
            required: true
          }
        }
      ]}
    />
  );
};

export default RHFFinancialIndicators;
