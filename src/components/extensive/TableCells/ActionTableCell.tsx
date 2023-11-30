import { useT } from "@transifex/react";
import { When } from "react-if";

import Button, { IButtonProps } from "@/components/elements/Button/Button";
import IconButton from "@/components/elements/IconButton/IconButton";
import { IconNames } from "@/components/extensive/Icon/Icon";

interface ActionTableCellProps {
  primaryButtonProps: IButtonProps;
  hasDeleteButton?: boolean;
  onDelete?: () => void;
}

export const ActionTableCell = ({ primaryButtonProps, hasDeleteButton, onDelete }: ActionTableCellProps) => {
  const t = useT();

  return (
    <div className="flex justify-end gap-4">
      <Button {...primaryButtonProps} />
      <When condition={hasDeleteButton}>
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
      </When>
    </div>
  );
};
