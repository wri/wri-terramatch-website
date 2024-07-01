import { AccessorKeyColumnDef, ColumnDef, RowData } from "@tanstack/react-table";
import _ from "lodash";
import { useCallback, useMemo } from "react";
import { When } from "react-if";
import { v4 as uuidv4 } from "uuid";

import Button from "@/components/elements/Button/Button";
import IconButton from "@/components/elements/IconButton/IconButton";
import InputWrapper, { InputWrapperProps } from "@/components/elements/Inputs/InputElements/InputWrapper";
import Table from "@/components/elements/Table/Table";
import { IconNames } from "@/components/extensive/Icon/Icon";
import FormModal from "@/components/extensive/Modal/FormModal";
import { FieldType, FormField } from "@/components/extensive/WizardForm/types";
import { useModalContext } from "@/context/modal.provider";

export interface DataTableProps<TData extends RowData & { uuid: string }> extends Omit<InputWrapperProps, "errors"> {
  modalTitle?: string;
  fields: FormField[];
  addButtonCaption: string;
  tableColumns: AccessorKeyColumnDef<TData>[];
  value: TData[];
  onChange?: (values: any) => void;
  generateUuids?: boolean;

  handleCreate?: (value: any) => void;
  handleDelete?: (uuid?: string) => void;
}

function DataTable<TData extends RowData & { uuid: string }>(props: DataTableProps<TData>) {
  const { openModal, closeModal } = useModalContext();
  const {
    fields,
    addButtonCaption,
    tableColumns,
    value,
    onChange,
    handleCreate,
    handleDelete,
    generateUuids = false,
    ...inputWrapperProps
  } = props;

  const openFormModalHandler = () => {
    openModal(
      <FormModal title={props.modalTitle || props.addButtonCaption} fields={fields} onSubmit={onAddNewEntry} />
    );
  };

  const onAddNewEntry = useCallback(
    (fieldValues: any) => {
      if (generateUuids) {
        fieldValues = { ...fieldValues, uuid: uuidv4() };
      }
      onChange?.([...value, fieldValues]);
      handleCreate?.(fieldValues);
      closeModal();
    },
    [generateUuids, value, onChange, handleCreate, closeModal]
  );

  const onDeleteEntry = useCallback(
    (uuid: string) => {
      const _tmp = [...value];
      _.remove(_tmp, item => item.uuid === uuid);
      //@ts-ignore
      handleDelete?.(uuid);
      onChange?.(_tmp);
    },
    [value, handleDelete, onChange]
  );

  const headers = useMemo<ColumnDef<TData>[]>(() => {
    return [
      {
        accessorKey: "index",
        header: "#",
        cell: props => (props.getValue() as number) + 1
      },
      ...tableColumns.map(header => {
        const field = fields.find(field => field.name === header.accessorKey);
        if (field?.type === FieldType.Dropdown) {
          if (!header.cell) {
            header.cell = props =>
              field.fieldProps.options.find(option => option.value === props.getValue())?.title || props.getValue();
          }
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
            iconProps={{ name: IconNames.TRASH_CIRCLE, className: "fill-error" }}
            onClick={() => onDeleteEntry(props.getValue() as string)}
          />
        ),
        meta: { align: "right" },
        enableSorting: false
      }
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, tableColumns]);

  return (
    <InputWrapper {...inputWrapperProps}>
      <div className="w-full pt-6">
        <Button
          onClick={openFormModalHandler}
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
