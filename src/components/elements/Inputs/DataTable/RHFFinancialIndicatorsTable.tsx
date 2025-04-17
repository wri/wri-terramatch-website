import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";
import * as yup from "yup";

import { FieldType } from "@/components/extensive/WizardForm/types";
import { useMyOrg } from "@/connections/Organisation";
import {
  useDeleteV2FinancialIndicatorsUUID,
  useGetV2FinancialIndicatorsUUID,
  usePatchV2FinancialIndicatorsUUID,
  usePostV2FileUploadMODELCOLLECTIONUUID,
  usePostV2FinancialIndicators
} from "@/generated/apiComponents";

import DataTable, { DataTableProps } from "./DataTable";

export interface RHFFinancialIndicatorsDataTableProps
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
    cell: props => {
      const doc = props.getValue() as { file_name: string; full_url: string };
      return (
        <a href={doc?.full_url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
          {doc?.file_name}
        </a>
      );
    }
  },
  { accessorKey: "description", header: t("Description") }
];

/**
 * @param props PropsWithChildren<RHFSelectProps>
 * @returns React Hook Form Ready Select Component
 */
const RHFFinancialIndicatorsDataTable = ({
  onChangeCapture,
  ...props
}: PropsWithChildren<RHFFinancialIndicatorsDataTableProps>) => {
  const t = useT();
  const { field } = useController(props);
  const { formHook, collection, years } = props;
  const [file, setFile] = useState<File>();
  const [memberAdded, setMemberAdded] = useState(false);

  const value = field?.value || [];

  const [, { organisationId }] = useMyOrg();

  const { mutate: upload } = usePostV2FileUploadMODELCOLLECTIONUUID({
    onSuccess() {
      setMemberAdded(true);
      clearErrors();
    }
  });

  const { mutate: createTeamMember } = usePostV2FinancialIndicators({
    onSuccess: async data => {
      const body = new FormData();
      if (file) {
        body.append("upload_file", file);
      }
      upload?.({
        //@ts-ignore
        pathParams: { model: "financial-indicators", collection: "documentation", uuid: data?.data?.uuid },
        file,
        //@ts-ignore swagger issue
        body
      });
      clearErrors();
    }
  });

  const { data: dataFinancialList } = useGetV2FinancialIndicatorsUUID(
    {
      pathParams: {
        uuid: organisationId!
      },
      queryParams: {
        collection
      }
    },
    {
      enabled: memberAdded
    }
  );

  useEffect(() => {
    if (memberAdded) {
      //@ts-ignore
      const lastItem = dataFinancialList?.data[dataFinancialList?.data.length - 1];
      const _tmp = [...value];
      _tmp.push(lastItem);
      field.onChange(_tmp);
      formHook?.reset(formHook.getValues());
      setMemberAdded(false);
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataFinancialList]);

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
      const _tmp = [...value];
      //@ts-ignore
      const index = _tmp.findIndex(item => item.uuid === data.data.uuid);

      if (index !== -1) {
        //@ts-ignore
        _tmp[index] = data.data;
        field.onChange(_tmp);
        clearErrors();
      }

      formHook?.reset(formHook.getValues());
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
      modalEditTitle={t("Edit Financial History")}
      tableColumns={getFinancialIndicatorsColumns(t)}
      fields={[
        {
          label: t("Amount"),
          name: "amount",
          placeholder: "Insert Amount",
          type: FieldType.Input,
          validation: yup.number().required(),
          fieldProps: {
            type: "number",
            required: true
          }
        },
        {
          label: t("Year"),
          name: "year",
          type: FieldType.Dropdown,
          validation: yup.number().required(),
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
          name: "documentation",
          type: FieldType.FileUpload,
          validation: yup.object(),
          fieldProps: {
            uuid: "__INJECT_UUID__",
            collection: "documentation",
            model: "financial-indicators",
            allowMultiple: false,
            isTemporary: false,
            onCaptureFile: setFile
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

export default RHFFinancialIndicatorsDataTable;
