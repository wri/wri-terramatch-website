import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { FC, PropsWithChildren, useCallback, useMemo, useState } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { FieldDefinition } from "@/components/extensive/WizardForm/types";
import { useMyOrg } from "@/connections/Organisation";
import { getGenderOptions } from "@/constants/options/gender";
import { useLocalStepsProvider } from "@/context/wizardForm.provider";
import {
  useDeleteV2OwnershipStakeUUID,
  usePatchV2OwnershipStakeUUID,
  usePostV2OwnershipStake
} from "@/generated/apiComponents";
import { formatOptionsList } from "@/utils/options";

import DataTable, { DataTableProps } from "./DataTable";

export interface RHFOwnershipStakeTableProps
  extends Omit<DataTableProps<any>, "value" | "onChange" | "fieldsProvider" | "addButtonCaption" | "tableColumns">,
    UseControllerProps {
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
}

export const getOwnershipTableColumns = (t: typeof useT | Function = (t: string) => t): AccessorKeyColumnDef<any>[] => [
  { accessorKey: "firstName", header: t("First name") },
  { accessorKey: "lastName", header: t("Last name") },
  {
    accessorKey: "gender",
    header: t("Gender"),
    cell: props => formatOptionsList(getGenderOptions(t), props.getValue() as string)
  },
  { accessorKey: "title", header: t("Title") },
  { accessorKey: "percentOwnership", header: t("Percent Ownership") },
  { accessorKey: "yearOfBirth", header: t("Year of birth") }
];

const getOwnershipTableQuestions = (t: typeof useT): FieldDefinition[] => [
  {
    label: t("first name"),
    name: "firstName",
    inputType: "text",
    validation: { required: true }
  },
  {
    label: t("last name"),
    name: "lastName",
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
    name: "yearOfBirth",
    inputType: "number",
    validation: { required: true, min: 1900, max: 2050 }
  },
  {
    label: t("Percent Ownership"),
    name: "percentOwnership",
    inputType: "number",
    validation: { required: true, min: 1, max: 100 }
  }
];

const RHFOwnershipStakeTable: FC<PropsWithChildren<RHFOwnershipStakeTableProps>> = ({ onChangeCapture, ...props }) => {
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

  const { columns, steps } = useMemo(
    () => ({
      columns: getOwnershipTableColumns(t),
      steps: [{ id: "ownershipStakeTable", fields: getOwnershipTableQuestions(t) }]
    }),
    [t]
  );
  const fieldsProvider = useLocalStepsProvider(steps);

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
      tableColumns={columns}
      fieldsProvider={fieldsProvider}
    />
  );
};

export default RHFOwnershipStakeTable;
