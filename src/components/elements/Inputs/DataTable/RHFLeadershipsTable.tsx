import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { PropsWithChildren, useCallback } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";
import * as yup from "yup";

import { FieldType } from "@/components/extensive/WizardForm/types";
import { useMyOrg } from "@/connections/Organisation";
import { getCountriesOptions } from "@/constants/options/countries";
import { getGenderOptions } from "@/constants/options/gender";
import { useDeleteV2LeadershipsUUID, usePostV2Leaderships } from "@/generated/apiComponents";
import { formatOptionsList } from "@/utils/options";

import DataTable, { DataTableProps } from "./DataTable";

export interface RHFLeadershipsTableProps
  extends Omit<DataTableProps<any>, "value" | "onChange" | "fields" | "addButtonCaption" | "tableColumns">,
    UseControllerProps {
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
  collection?: string;
}

export const getLeadershipsTableColumns = (
  t: typeof useT | Function = (t: string) => t
): AccessorKeyColumnDef<any>[] => [
  { accessorKey: "first_name", header: t("First name") },
  { accessorKey: "last_name", header: t("Last name") },
  {
    accessorKey: "gender",
    header: t("Gender"),
    cell: props => formatOptionsList(getGenderOptions(t), props.getValue() as string)
  },
  { accessorKey: "age", header: t("Age") },
  {
    accessorKey: "position",
    header: t("Role")
  },
  {
    accessorKey: "nationality",
    header: t("Nationality"),
    cell: props => formatOptionsList(getCountriesOptions(t), props.getValue() as string)
  }
];

/**
 * @param props PropsWithChildren<RHFSelectProps>
 * @returns React Hook Form Ready Select Component
 */
const RHFLeadershipsDataTable = ({ onChangeCapture, ...props }: PropsWithChildren<RHFLeadershipsTableProps>) => {
  const t = useT();
  const { field } = useController(props);
  const { formHook, collection } = props;
  const value = field?.value || [];

  const [, { organisationId }] = useMyOrg();

  const { mutate: createMember } = usePostV2Leaderships({
    onSuccess(data) {
      const _tmp = [...value];
      //@ts-ignore
      _tmp.push(data.data);
      field.onChange(_tmp);
      clearErrors();
    }
  });

  const { mutate: removeMember } = useDeleteV2LeadershipsUUID({
    onSuccess(data, variables) {
      //@ts-ignore
      _.remove(value, v => v.uuid === variables.pathParams.uuid);
      field.onChange(value);
      clearErrors();
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
        createMember({
          body: {
            ...data,
            organisation_id: organisationId,
            collection
          }
        });
      }}
      handleDelete={uuid => {
        if (uuid) {
          removeMember({ pathParams: { uuid } });
        }
      }}
      addButtonCaption={t("Add team member")}
      tableColumns={getLeadershipsTableColumns(t)}
      fields={[
        {
          label: t("Team Member first name"),
          name: "first_name",
          type: FieldType.Input,
          validation: yup.string().required(),
          fieldProps: {
            type: "text",
            required: true
          }
        },
        {
          label: t("Team member last name"),
          name: "last_name",
          type: FieldType.Input,
          validation: yup.string().required(),
          fieldProps: {
            type: "text",
            required: true
          }
        },
        {
          label: t("Team member Gender"),
          name: "gender",
          type: FieldType.Dropdown,
          validation: yup.string().required(),
          fieldProps: {
            options: getGenderOptions(t),
            required: true
          }
        },
        {
          label: t("Age"),
          name: "age",
          type: FieldType.Input,
          validation: yup.number().min(16).max(150).required(),
          fieldProps: {
            type: "number",
            required: true
          }
        },
        {
          label: t("Role"),
          name: "position",
          type: FieldType.Input,
          validation: yup.string().required(),
          fieldProps: {
            type: "text",
            required: true
          }
        },
        {
          label: t("Nationality"),
          name: "nationality",
          type: FieldType.Dropdown,
          validation: yup.string().required(),
          fieldProps: {
            options: getCountriesOptions(t),
            required: true
          }
        }
      ]}
    />
  );
};

export default RHFLeadershipsDataTable;
