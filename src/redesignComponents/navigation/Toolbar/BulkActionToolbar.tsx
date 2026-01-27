import { FC } from "react";

import Button, { IButtonProps } from "@/redesignComponents/actions/Buttons/Button/Button";
import MultiActionButton, {
  IMultiActionButtonProps
} from "@/redesignComponents/actions/Buttons/MultiActionButton/MultiActionButton";

import Toolbar from "./Toolbar";

interface BulkActionToolbarProps {
  ButtonPrimary: IButtonProps;
  ButtonSecondary: IButtonProps;
  ButtonTertiary: IButtonProps;
  ButtonCancel: IButtonProps;
  ButtonDelete: IButtonProps;
  ButtonMenu: IMultiActionButtonProps;
}

const BulkActionToolbar: FC<BulkActionToolbarProps> = ({
  ButtonPrimary,
  ButtonSecondary,
  ButtonTertiary,
  ButtonCancel,
  ButtonDelete,
  ButtonMenu
}: BulkActionToolbarProps) => {
  return (
    <Toolbar
      className="!bg-theme-primary-900 rounded-lg px-6 py-3"
      contentLeft={<Button {...ButtonCancel} variant="borderless" className="!px-0 !text-white hover:!px-3" />}
      contentRight={
        <div className="flex items-center gap-4">
          <Button {...ButtonPrimary} variant="primary" />
          <Button {...ButtonSecondary} variant="secondary" />
          <Button {...ButtonTertiary} variant="secondary" />
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
