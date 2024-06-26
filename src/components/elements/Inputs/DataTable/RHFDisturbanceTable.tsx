import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { PropsWithChildren, useEffect } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";
import * as yup from "yup";

import { FieldType, FormField } from "@/components/extensive/WizardForm/types";
import {
  getDisturbanceExtentOptions,
  getDisturbanceIntensityOptions,
  getDisturbanceTypeOptions
} from "@/constants/options/disturbance";
import { useDeleteV2DisturbancesUUID, usePostV2Disturbances } from "@/generated/apiComponents";
import { Entity } from "@/types/common";
import { formatOptionsList } from "@/utils/options";

import DataTable, { DataTableProps } from "./DataTable";

export interface RHFDisturbanceTableProps
  extends Omit<DataTableProps<any>, "value" | "onChange" | "fields" | "addButtonCaption" | "tableColumns">,
    UseControllerProps {
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
  entity: Entity;
  hasIntensity?: boolean;
  hasExtent?: boolean;
}

export const getDisturbanceTableColumns = (
  props: { hasIntensity?: boolean; hasExtent?: boolean },
  t: typeof useT | Function = (t: string) => t
) => {
  const columns: AccessorKeyColumnDef<any>[] = [
    {
      accessorKey: "type",
      header: t("Disturbance Type"),
      cell: prop => formatOptionsList(getDisturbanceTypeOptions(), prop.getValue() as string)
    }
  ];

  if (props.hasIntensity) {
    columns.push({
      accessorKey: "intensity",
      header: t("Intensity"),
      cell: prop => formatOptionsList(getDisturbanceIntensityOptions(), prop.getValue() as string)
    });
  }

  if (props.hasExtent) {
    columns.push({
      accessorKey: "extent",
      header: t("Extent (% Of Site Affected)"),
      cell: prop => formatOptionsList(getDisturbanceExtentOptions(), prop.getValue() as string)
    });
  }

  columns.push({ accessorKey: "description", header: t("Description"), enableSorting: false });

  return columns;
};

export const getDisturbanceTableFields = (
  props: { hasIntensity?: boolean; hasExtent?: boolean },
  t: typeof useT | Function = (t: string) => t
) => {
  const fields: FormField[] = [
    {
      label: t("Disturbance Type"),
      name: "type",
      type: FieldType.Dropdown,
      validation: yup.string().required(),
      fieldProps: {
        options: getDisturbanceTypeOptions(),
        required: true
      }
    }
  ];

  if (props.hasIntensity) {
    fields.push({
      label: t("Intensity"),
      name: "intensity",
      type: FieldType.Dropdown,
      validation: yup.string().required(),
      fieldProps: {
        options: getDisturbanceIntensityOptions(),
        required: true
      }
    });
  }

  if (props.hasExtent) {
    fields.push({
      label: t("Extent (% Of Site Affected)"),
      name: "extent",
      type: FieldType.Dropdown,
      validation: yup.string().required(),
      fieldProps: {
        options: getDisturbanceExtentOptions(),
        required: true
      }
    });
  }

  fields.push({
    label: t("Description"),
    name: "description",
    type: FieldType.TextArea,
    validation: yup.string(),
    fieldProps: {
      required: false
    }
  });

  return fields;
};

const RHFDisturbanceTable = ({ onChangeCapture, entity, ...props }: PropsWithChildren<RHFDisturbanceTableProps>) => {
  const t = useT();
  const { field } = useController(props);
  const value = field?.value || [];

  const { mutate: createDisturbances } = usePostV2Disturbances({
    onSuccess(data) {
      const _tmp = [...value];
      //@ts-ignore
      _tmp.push(data.data);
      field.onChange(_tmp);
      onChangeCapture && onChangeCapture();
    }
  });

  const { mutate: removeDisturbance } = useDeleteV2DisturbancesUUID({
    onSuccess(data, variables) {
      //@ts-ignore
      _.remove(value, v => v.uuid === variables.pathParams.uuid);
      field.onChange(value);
    }
  });

  useEffect(() => {
    onChangeCapture && onChangeCapture();
    props.formHook && props.formHook.register(field.name);
    props.formHook?.clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.formHook, field.name, entity?.entityName, entity?.entityUUID]);

  useEffect(() => {
    props.formHook?.clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, props.formHook]);
  return (
    <DataTable
      {...props}
      value={value}
      handleCreate={data => {
        onChangeCapture && onChangeCapture();
        createDisturbances({
          body: {
            ...data,
            model_type: entity?.entityName,
            //@ts-ignore
            model_uuid: entity?.entityUUID
          }
        });
      }}
      handleDelete={uuid => {
        if (uuid) {
          removeDisturbance({ pathParams: { uuid } });
        }
      }}
      addButtonCaption={t("Add Disturbance")}
      tableColumns={getDisturbanceTableColumns(props, t)}
      fields={getDisturbanceTableFields(props, t)}
    />
  );
};

export default RHFDisturbanceTable;
