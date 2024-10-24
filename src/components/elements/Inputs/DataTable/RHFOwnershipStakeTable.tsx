import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { PropsWithChildren } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";
import * as yup from "yup";

import { FieldType } from "@/components/extensive/WizardForm/types";
import { useMyOrg } from "@/connections/Organisation";
import { getGenderOptions } from "@/constants/options/gender";
import { useDeleteV2OwnershipStakeUUID, usePostV2OwnershipStake } from "@/generated/apiComponents";
import { formatOptionsList } from "@/utils/options";

import DataTable, { DataTableProps } from "./DataTable";

export interface RHFOwnershipStakeTableProps
  extends Omit<DataTableProps<any>, "value" | "onChange" | "fields" | "addButtonCaption" | "tableColumns">,
    UseControllerProps {
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
}

export const getOwnershipTableColumns = (t: typeof useT | Function = (t: string) => t): AccessorKeyColumnDef<any>[] => [
  { accessorKey: "first_name", header: t("First name") },
  { accessorKey: "last_name", header: t("Last name") },
  {
    accessorKey: "gender",
    header: t("Gender"),
    cell: props => formatOptionsList(getGenderOptions(t), props.getValue() as string)
  },
  { accessorKey: "title", header: t("Title") },
  { accessorKey: "percent_ownership", header: t("Percent Ownership") },
  { accessorKey: "year_of_birth", header: t("Year of birth") }
];

/**
 * @param props PropsWithChildren<RHFSelectProps>
 * @returns React Hook Form Ready Select Component
 */
const RHFOwnershipStakeTable = ({ onChangeCapture, ...props }: PropsWithChildren<RHFOwnershipStakeTableProps>) => {
  const t = useT();
  const { field } = useController(props);
  const value = field?.value || [];

  const [, { organisationId }] = useMyOrg();

  const { mutate: createTeamMember } = usePostV2OwnershipStake({
    onSuccess(data) {
      const _tmp = [...value];
      //@ts-ignore
      _tmp.push(data.data);
      field.onChange(_tmp);
    }
  });

  const { mutate: removeTeamMember } = useDeleteV2OwnershipStakeUUID({
    onSuccess(data, variables) {
      //@ts-ignore
      _.remove(value, v => v.uuid === variables.pathParams.uuid);
      field.onChange(value);
    }
  });

  return (
    <DataTable
      {...props}
      value={value}
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
      addButtonCaption={t("Add Ownership Stake")}
      tableColumns={getOwnershipTableColumns(t)}
      fields={[
        {
          label: t("first name"),
          name: "first_name",
          type: FieldType.Input,
          validation: yup.string().required(),
          fieldProps: {
            type: "text",
            required: true
          }
        },
        {
          label: t("last name"),
          name: "last_name",
          type: FieldType.Input,
          validation: yup.string().required(),
          fieldProps: {
            type: "text",
            required: true
          }
        },
        {
          label: t("Gender"),
          name: "gender",
          type: FieldType.Dropdown,
          validation: yup.string().required(),
          fieldProps: {
            options: getGenderOptions(t),
            required: true
          }
        },
        {
          label: t("Title"),
          name: "title",
          type: FieldType.Input,
          validation: yup.string().required(),
          fieldProps: {
            type: "text",
            required: true
          }
        },
        {
          label: t("Year of birth"),
          name: "year_of_birth",
          type: FieldType.Input,
          validation: yup.number().min(1900).max(2050).required(),
          fieldProps: {
            type: "number",
            required: true
          }
        },
        {
          label: t("Percent Ownership"),
          name: "percent_ownership",
          type: FieldType.Input,
          validation: yup.number().min(1).max(100).required(),
          fieldProps: {
            type: "number",
            min: 1,
            max: 100,
            required: true
          }
        }
      ]}
    />
  );
};

export default RHFOwnershipStakeTable;
