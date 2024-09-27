import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { PropsWithChildren } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";
import * as yup from "yup";

import { FieldType } from "@/components/extensive/WizardForm/types";
import { myOrganisationConnection } from "@/connections/Organisation";
import { getGenderOptions } from "@/constants/options/gender";
import { useDeleteV2CoreTeamLeaderUUID, usePostV2CoreTeamLeader } from "@/generated/apiComponents";
import { useConnection } from "@/hooks/useConnection";
import { formatOptionsList } from "@/utils/options";

import DataTable, { DataTableProps } from "./DataTable";

export interface RHFCoreTeamLeadersTableProps
  extends Omit<DataTableProps<any>, "value" | "onChange" | "fields" | "addButtonCaption" | "tableColumns">,
    UseControllerProps {
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
}

export const getCoreTeamLeadersTableColumns = (
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
  { accessorKey: "position", header: t("Role") }
];

/**
 * @param props PropsWithChildren<RHFSelectProps>
 * @returns React Hook Form Ready Select Component
 */
const RHFCoreTeamLeadersDataTable = ({
  onChangeCapture,
  ...props
}: PropsWithChildren<RHFCoreTeamLeadersTableProps>) => {
  const t = useT();
  const { field } = useController(props);
  const value = field?.value || [];

  const [, { organisationId }] = useConnection(myOrganisationConnection);

  const { mutate: createTeamMember } = usePostV2CoreTeamLeader({
    onSuccess(data) {
      const _tmp = [...value];
      //@ts-ignore
      _tmp.push(data.data);
      field.onChange(_tmp);
    }
  });

  const { mutate: removeTeamMember } = useDeleteV2CoreTeamLeaderUUID({
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
      addButtonCaption={t("Add team member")}
      tableColumns={getCoreTeamLeadersTableColumns(t)}
      fields={[
        {
          label: t("Core Team Member first name"),
          name: "first_name",
          type: FieldType.Input,
          validation: yup.string().required(),
          fieldProps: {
            type: "text",
            required: true
          }
        },
        {
          label: t("Core Team member last name"),
          name: "last_name",
          type: FieldType.Input,
          validation: yup.string().required(),
          fieldProps: {
            type: "text",
            required: true
          }
        },
        {
          label: t("Core Team member Gender"),
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
        }
      ]}
    />
  );
};

export default RHFCoreTeamLeadersDataTable;
