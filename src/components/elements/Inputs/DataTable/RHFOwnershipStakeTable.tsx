import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { PropsWithChildren, useCallback, useState } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { useMyOrg } from "@/connections/Organisation";
import { getGenderOptions } from "@/constants/options/gender";
import {
  useDeleteV2OwnershipStakeUUID,
  usePatchV2OwnershipStakeUUID,
  usePostV2OwnershipStake
} from "@/generated/apiComponents";
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
  const [tableKey, setTableKey] = useState(0);

  const [, { organisationId }] = useMyOrg();

  const refreshTable = () => {
    setTableKey(prev => prev + 1);
  };

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

  const { mutate: updateTeamMember } = usePatchV2OwnershipStakeUUID({
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

  return (
    <DataTable
      key={tableKey}
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
      handleUpdate={data => {
        if (data.uuid) {
          updateTeamMember({
            pathParams: { uuid: data.uuid },
            body: { ...data }
          });
        }
      }}
      addButtonCaption={t("Add Ownership Stake")}
      modalEditTitle={t("Update Ownership Stake")}
      tableColumns={getOwnershipTableColumns(t)}
      fields={[
        {
          label: t("first name"),
          name: "first_name",
          inputType: "text",
          validation: { required: true }
        },
        {
          label: t("last name"),
          name: "last_name",
          inputType: "text",
          validation: { required: true }
        },
        {
          label: t("Gender"),
          name: "gender",
          inputType: "select",
          options: getGenderOptions(t),
          validation: { required: true }
        },
        {
          label: t("Title"),
          name: "title",
          inputType: "text",
          validation: { required: true }
        },
        {
          label: t("Year of birth"),
          name: "year_of_birth",
          inputType: "number",
          validation: { required: true, min: 1900, max: 2050 }
        },
        {
          label: t("Percent Ownership"),
          name: "percent_ownership",
          inputType: "number",
          validation: { required: true, min: 1, max: 100 }
        }
      ]}
    />
  );
};

export default RHFOwnershipStakeTable;
