import { yupResolver } from "@hookform/resolvers/yup";
import { AccessorKeyColumnDef, ColumnDef, RowData } from "@tanstack/react-table";
import _ from "lodash";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import IconButton from "@/components/elements/IconButton/IconButton";
import InputWrapper, { InputWrapperProps } from "@/components/elements/Inputs/InputElements/InputWrapper";
import Table from "@/components/elements/Table/Table";
import { IconNames } from "@/components/extensive/Icon/Icon";
import SimpleForm from "@/components/extensive/SimpleForm/SimpleForm";
import { FieldType, FormField } from "@/components/extensive/WizardForm/types";
import { getSchema } from "@/components/extensive/WizardForm/utils";

export interface DataTableProps<TData extends RowData & { uuid: string }> extends Omit<InputWrapperProps, "errors"> {
  fields: FormField[];
  addButtonCaption: string;
  //Note: It would make sense to get rid of this tableHeader and grab headers from fields, this require BED to add an additional header or short_label to questions since labels can be quite long.
  tableHeaders: AccessorKeyColumnDef<TData>[];
  value: TData[];
  onChange?: (values: any) => void;

  handleCreate?: (value: any) => void;
  handleDelete?: (uuid?: string) => void;
}

function DataTable<TData extends RowData & { uuid: string }>(props: DataTableProps<TData>) {
  const { fields, addButtonCaption, tableHeaders, value, onChange, handleCreate, handleDelete, ...inputWrapperProps } =
    props;

  const formHook = useForm({
    resolver: yupResolver(getSchema(fields)),
    mode: "onSubmit"
  });

  const onAddNewEntry = formHook.handleSubmit(fieldValues => {
    onChange?.([...value, fieldValues]);
    handleCreate?.(fieldValues);
    formHook.reset();
  });

  const onDeleteEntry = (uuid: string) => {
    const _tmp = [...value];
    _.remove(_tmp, item => item.uuid === uuid);

    //@ts-ignore
    handleDelete?.(uuid);
    onChange?.(_tmp);
  };

  const headers = useMemo<ColumnDef<TData>[]>(() => {
    return [
      {
        accessorKey: "index",
        header: "#",
        cell: props => (props.getValue() as number) + 1
      },
      ...tableHeaders.map(header => {
        const field = fields.find(field => field.name === header.accessorKey);
        if (field?.type === FieldType.Dropdown) {
          header.cell = props =>
            field.fieldProps.options.find(option => option.value === props.getValue())?.title || props.getValue();

          header.id = field.name;
        }

        return header;
      }),
      {
        id: "delete",
        accessorKey: "uuid",
        header: "",
        cell: props => (
          <IconButton
            iconProps={{ name: IconNames.TRASH, className: "fill-error" }}
            onClick={() => onDeleteEntry(props.getValue() as string)}
          />
        ),
        meta: { align: "right" },
        enableSorting: false
      }
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, tableHeaders]);

  return (
    <InputWrapper {...inputWrapperProps}>
      <div className="w-full pt-6">
        <SimpleForm fields={fields} formHook={formHook} onChange={() => {}} />
        <Button
          className="mt-8"
          onClick={() => onAddNewEntry()}
          iconProps={{ name: IconNames.PLUS_THICK, width: 12 }}
          variant="secondary"
        >
          {addButtonCaption}
        </Button>

        <When condition={value.length > 0}>
          <Table columns={headers} data={value.map((v, index) => ({ ...v, index }))} className="mt-8" />
        </When>
      </div>
    </InputWrapper>
  );
}

export default DataTable;
