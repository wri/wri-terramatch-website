import { FC } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import MultiActionButton from "@/redesignComponents/actions/Buttons/MultiActionButton/MultiActionButton";

import Toolbar from "./Toolbar";
import { BulkActionToolbarProps } from "./ToolBar.type";

const BulkActionToolbar: FC<BulkActionToolbarProps> = ({
  primaryButtonProps,
  secondaryButtonProps,
  tertiaryButtonProps,
  ButtonCancel,
  ButtonDelete,
  ButtonMenu
}: BulkActionToolbarProps) => {
  return (
    <Toolbar
      className="rounded-lg !bg-theme-primary-900 px-6 py-3"
      contentLeft={<Button className="!text-theme-neutral-100" {...ButtonCancel} variant="borderless" />}
      contentRight={
        <div className="flex items-center gap-4">
          <Button {...primaryButtonProps} variant="primary" />
          <Button {...secondaryButtonProps} variant="secondary" />
          <Button {...tertiaryButtonProps} variant="secondary" />
          <MultiActionButton {...ButtonMenu} variant="secondary" />
          <Button
            {...ButtonDelete}
            variant="secondary"
            className="!border-theme-error-300 !bg-theme-error-100 !text-theme-error-900"
          />
        </div>
      }
    />
  );
};

export default BulkActionToolbar;
