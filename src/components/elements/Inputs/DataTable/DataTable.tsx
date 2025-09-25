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
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { FieldDefinition } from "@/components/extensive/WizardForm/types";
import { toFormOptions } from "@/components/extensive/WizardForm/utils";
import { useModalContext } from "@/context/modal.provider";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    width?: string;
    align?: "left" | "center" | "right";
  }
}

export interface DataTableProps<TData extends RowData & { uuid: string }> extends Omit<InputWrapperProps, "errors"> {
  modalTitle?: string;
  modalEditTitle?: string;
  fields: FieldDefinition[];
  addButtonCaption: string;
  tableColumns: AccessorKeyColumnDef<TData>[];
  value: TData[];
  onChange?: (values: any) => void;
  generateUuids?: boolean;
  additionalValues?: any;
  hasPagination?: boolean;
  invertSelectPagination?: boolean;

  handleCreate?: (value: any) => void;
  handleDelete?: (uuid?: string) => void;
  handleUpdate?: (value: any) => void;
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
    handleUpdate,
    generateUuids = false,
    additionalValues = {},
    modalEditTitle,
    hasPagination = false,
    invertSelectPagination = false,
    ...inputWrapperProps
  } = props;

  const openFormModalHandler = () => {
    openModal(
      ModalId.FORM_MODAL,
      <FormModal title={props.modalTitle || props.addButtonCaption} fields={fields} onSubmit={onAddNewEntry} />
    );
  };

  const openFormUpdateModalHandler = (props: any) => {
    const rowValues = props.row.original;
    openModal(
      ModalId.FORM_MODAL,
      <FormModal
        title={modalEditTitle}
        fields={fields}
        defaultValues={rowValues}
        onSubmit={updatedValues => {
          handleUpdate?.({ ...rowValues, ...updatedValues });
          closeModal(ModalId.FORM_MODAL);
        }}
      />
    );
  };

  const onAddNewEntry = useCallback(
    (fieldValues: any) => {
      if (generateUuids) {
        fieldValues = { ...fieldValues, ...additionalValues, uuid: uuidv4() };
      }
      onChange?.([...value, fieldValues]);
      handleCreate?.(fieldValues);
      closeModal(ModalId.FORM_MODAL);
    },
    [generateUuids, onChange, value, handleCreate, closeModal, additionalValues]
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
        const field = fields.find(({ name }) => name === header.accessorKey);
        if (field?.inputType === "select") {
          if (header.cell == null) {
            header.cell = props => {
              const value = props.getValue();
              if (field.options == null) return value;
              return toFormOptions(field.options).find(option => option.value === value)?.title ?? value;
            };
          }
          header.id = field.name;
        }

        return header;
      }),
      ...(handleUpdate
        ? [
            {
              id: "update",
              accessorKey: "uuid",
              header: "",
              cell: props => (
                <IconButton iconProps={{ name: IconNames.EDIT }} onClick={() => openFormUpdateModalHandler(props)} />
              ),
              meta: { align: "right" },
              enableSorting: false
            } as ColumnDef<TData>
          ]
        : []),
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
          <Table
            columns={headers}
            data={value.map((v, index) => ({ ...v, index }))}
            className="mt-8"
            hasPagination={hasPagination}
            invertSelectPagination={invertSelectPagination}
          />
        </When>
      </div>
    </InputWrapper>
  );
}

export default DataTable;
