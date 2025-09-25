import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { PropsWithChildren, useCallback, useState } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { useGadmOptions } from "@/connections/Gadm";
import { useMyOrg } from "@/connections/Organisation";
import { getGenderOptions } from "@/constants/options/gender";
import { useDeleteV2LeadershipsUUID, usePatchV2LeadershipsUUID, usePostV2Leaderships } from "@/generated/apiComponents";
import { V2LeadershipsRead } from "@/generated/apiSchemas";
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
    header: t("Nationality")
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
  const countryOptions = useGadmOptions({ level: 0 });
  const [tableKey, setTableKey] = useState(0);

  const [, { organisationId }] = useMyOrg();

  const refreshTable = () => {
    setTableKey(prev => prev + 1);
  };

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

  const { mutate: updateTeamMember } = usePatchV2LeadershipsUUID({
    onSuccess(data, variables) {
      const _tmp = [...value];
      //@ts-ignore
      const index = _tmp.findIndex(item => item.uuid === data.data.uuid);

      if (index !== -1) {
        //@ts-ignore
        _tmp[index] = data.data;
        field.onChange(_tmp);
        onChangeCapture?.();
        formHook?.reset(formHook.getValues());
        clearErrors();
        refreshTable();
      }
    }
  });

  const clearErrors = useCallback(() => {
    formHook?.clearErrors(props.name);
  }, [formHook, props.name]);

  const conditionalFunctions =
    collection === "leadership-team"
      ? {
          handleUpdate: (data: V2LeadershipsRead) => {
            if (data.uuid) {
              updateTeamMember({
                pathParams: { uuid: data.uuid },
                body: { ...data }
              });
            }
          }
        }
      : {};

  return (
    <DataTable
      key={tableKey}
      {...props}
      {...conditionalFunctions}
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
      modalEditTitle={t("Update team member")}
      tableColumns={getLeadershipsTableColumns(t)}
      fields={[
        {
          label: t("Team Member first name"),
          name: "first_name",
          inputType: "text",
          validation: { required: true }
        },
        {
          label: t("Team member last name"),
          name: "last_name",
          inputType: "text",
          validation: { required: true }
        },
        {
          label: t("Team member Gender"),
          name: "gender",
          inputType: "select",
          options: getGenderOptions(t),
          validation: { required: true }
        },
        {
          label: t("Age"),
          name: "age",
          inputType: "number",
          validation: { required: true, min: 16, max: 150 }
        },
        {
          label: t("Role"),
          name: "position",
          inputType: "text",
          validation: { required: true }
        },
        {
          label: t("Nationality"),
          name: "nationality",
          inputType: "select",
          options: countryOptions ?? [],
          validation: { required: true }
        }
      ]}
    />
  );
};

export default RHFLeadershipsDataTable;
