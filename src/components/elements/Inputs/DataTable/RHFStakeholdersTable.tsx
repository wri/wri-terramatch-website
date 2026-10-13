import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { FC, PropsWithChildren, useMemo } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { FieldDefinition } from "@/components/extensive/WizardForm/types";
import { getStakeholderKeyRoleOptions } from "@/constants/options/stakeholders";
import { useLocalStepsProvider } from "@/context/wizardForm.provider";
import { formatOptionsList } from "@/utils/options";

import DataTable, { DataTableProps } from "./DataTable";

export interface RHFStakeholdersTableProps
  extends Omit<DataTableProps<any>, "value" | "onChange" | "fieldsProvider" | "addButtonCaption" | "tableColumns">,
    UseControllerProps {
  formHook?: UseFormReturn;
}

export type StakeholderEntry = {
  uuid?: string;
  name?: string | null;
  keyRole?: string | null;
  description?: string | null;
};

export const getStakeholdersTableColumns = (
  t: typeof useT | Function = (t: string) => t
): AccessorKeyColumnDef<any>[] => [
  { accessorKey: "name", header: t("Stakeholder Name") },
  {
    accessorKey: "keyRole",
    header: t("Key Role"),
    cell: props => formatOptionsList(getStakeholderKeyRoleOptions(t), props.getValue() as string)
  },
  { accessorKey: "description", header: t("Description"), enableSorting: false }
];

const getStakeholdersTableQuestions = (t: typeof useT): FieldDefinition[] => [
  {
    label: t("Stakeholder Name"),
    name: "name",
    inputType: "text",
    validation: { required: true }
  },
  {
    label: t("Key Role"),
    name: "keyRole",
    inputType: "select",
    options: getStakeholderKeyRoleOptions(t),
    validation: { required: true }
  },
  {
    label: t("Description"),
    name: "description",
    inputType: "long-text",
    validation: { required: true }
  }
];

const RHFStakeholdersTable: FC<PropsWithChildren<RHFStakeholdersTableProps>> = props => {
  const t = useT();
  const {
    field: { value, onChange }
  } = useController(props);

  const { columns, steps } = useMemo(
    () => ({
      columns: getStakeholdersTableColumns(t),
      steps: [{ id: "stakeholdersTable", fields: getStakeholdersTableQuestions(t) }]
    }),
    [t]
  );
  const fieldsProvider = useLocalStepsProvider(steps);

  return (
    <DataTable
      {...props}
      value={value ?? []}
      onChange={onChange}
      generateUuids={true}
      addButtonCaption={t("Add Stakeholder")}
      tableColumns={columns}
      fieldsProvider={fieldsProvider}
    />
  );
};

export default RHFStakeholdersTable;
