import { FC } from "react";
import { BulkDeleteWithConfirmButton, BulkDeleteWithConfirmButtonProps, useGetOne, useListContext } from "react-admin";

import modules from "@/admin/modules";

interface CustomBulkDeleteWithConfirmButtonProps extends Omit<BulkDeleteWithConfirmButtonProps, "mutationMode"> {
  source: string;
}

const CustomBulkDeleteWithConfirmButton: FC<CustomBulkDeleteWithConfirmButtonProps> = ({ source, ...rest }) => {
  const { selectedIds, resource } = useListContext();

  const { data } = useGetOne(
    resource,
    {
      id: selectedIds.at(0)
    },
    {
      enabled: selectedIds.length === 1
    }
  );

  const isMultiple = selectedIds.length > 1;

  const resourceName = (() => {
    switch (resource as keyof typeof modules) {
      case "projectReport":
        return "project report";
      case "siteReport":
        return "site report";
      case "nurseryReport":
        return "nursery report";
      case "nursery":
        return isMultiple ? "nurserie" : "nursery";
    }
  })();

  const confirmTitle = (() => {
    let title = "Delete ";

    if (isMultiple) title += `${resourceName}s`;
    else if (data) title += `${resourceName} ${data[source]}`;

    return title;
  })();

  const confirmContentSingular = `You are about to delete this ${resourceName}. This action will permanently remove the item from the system, and it cannot be undone. Are you sure you want to delete this item?`;
  const confirmContentPlural = `You are about to delete these ${resourceName}s. This action will permanently remove these items from the system, and it cannot be undone. Are you sure you want to delete these items?`;

  return (
    <BulkDeleteWithConfirmButton
      {...rest}
      mutationMode="undoable"
      confirmTitle={confirmTitle}
      confirmContent={isMultiple ? confirmContentPlural : confirmContentSingular}
    />
  );
};

export default CustomBulkDeleteWithConfirmButton;
