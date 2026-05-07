import { useT } from "@transifex/react";
import { FC } from "react";

import Button, { IButtonProps } from "@/components/elements/Button/Button";
import IconButton from "@/components/elements/IconButton/IconButton";
import { IconNames } from "@/components/extensive/Icon/Icon";

type ActionTableCellProps = {
  primaryButtonProps: IButtonProps;
  hasDeleteButton?: boolean;
  onDelete?: () => void;
};

const ActionTableCell: FC<ActionTableCellProps> = ({ primaryButtonProps, hasDeleteButton, onDelete }) => {
  const t = useT();

  return (
    <div className="flex justify-end gap-4">
      <Button {...primaryButtonProps} />
      {hasDeleteButton && (
        <IconButton
          onClick={() => onDelete?.()}
          aria-label={t("Delete")}
          iconProps={{
            name: IconNames.TRASH_CIRCLE,
            className: "fill-error",
            width: 32,
            height: 32
          }}
        />
      )}
    </div>
  );
};

export default ActionTableCell;
