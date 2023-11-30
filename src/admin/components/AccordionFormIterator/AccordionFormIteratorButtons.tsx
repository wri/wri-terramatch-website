import { AddOutlined, PreviewOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { get } from "lodash";
import * as React from "react";
import { Button, ButtonProps, useSimpleFormIterator, useSimpleFormIteratorItem } from "react-admin";
import { useFormContext } from "react-hook-form";

import { ConfirmationDialog } from "@/admin/components/Dialogs/ConfirmationDialog";

export const AddItemButton = (props: ButtonProps) => {
  const { add } = useSimpleFormIterator();

  return <Button onClick={() => add()} color="primary" {...props} alignIcon="left" startIcon={<AddOutlined />} />;
};

interface RemoveItemButtonProps extends ButtonProps {
  onDelete?: (index: number, source: string) => Promise<void>;
  modalTitle: string;
  modalContent: string;
}

export const RemoveItemButton = ({ onDelete, modalContent, modalTitle, ...props }: RemoveItemButtonProps) => {
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const { remove, index } = useSimpleFormIteratorItem();
  const { source } = useSimpleFormIterator();

  return (
    <>
      <Button
        {...props}
        type="button"
        //@ts-ignore
        color="error"
        onClick={() => {
          setOpenDeleteModal(true);
        }}
      />
      <ConfirmationDialog
        open={openDeleteModal}
        title={modalTitle}
        content={modalContent}
        onAgree={async () => {
          await onDelete?.(index, source);
          remove();
          setOpenDeleteModal(false);
        }}
        onDisAgree={() => setOpenDeleteModal(false)}
      />
    </>
  );
};

interface PreviewButtonProps extends Omit<ButtonProps, "onClick"> {
  onClick: (record: Record<any, any>) => void;
}

export const PreviewButton = ({ onClick, ...props }: PreviewButtonProps) => {
  const { source } = useSimpleFormIterator();
  const { index } = useSimpleFormIteratorItem();
  const { getValues } = useFormContext();

  const record = get(getValues(), `${source}.${index}`) as Record<any, any>;

  return (
    <IconButton {...props} sx={{ padding: 0, marginRight: 1 }} onClick={() => onClick(record)}>
      <PreviewOutlined />
    </IconButton>
  );
};
