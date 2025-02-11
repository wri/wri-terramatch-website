import { FC } from "react";
import { DeleteWithConfirmButton, DeleteWithConfirmButtonProps, useListContext, useRecordContext } from "react-admin";

interface CustomDeleteWithConfirmButtonProps extends DeleteWithConfirmButtonProps {
  source: string;
}

const CustomDeleteWithConfirmButton: FC<CustomDeleteWithConfirmButtonProps> = ({ source, ...rest }) => {
  const { resource } = useListContext();
  const record = useRecordContext();
  console.log("record", record);

  const confirmTitle = `Delete ${resource} ${record[source]}`;
  const confirmContent = `You are about to delete this ${resource}. This action will permanently remove the item from the system, and it cannot be undone. Are you sure you want to delete this item?`;

  return <DeleteWithConfirmButton {...rest} confirmTitle={confirmTitle} confirmContent={confirmContent} />;
};

export default CustomDeleteWithConfirmButton;
