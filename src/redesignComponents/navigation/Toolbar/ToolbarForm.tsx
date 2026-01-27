import { FC } from "react";

import Button, { IButtonProps } from "@/redesignComponents/actions/Buttons/Button/Button";

import Toolbar from "./Toolbar";

interface ToolbarFormProps {
  label: string;
  ButtonPrimary: IButtonProps;
  ButtonSecondary: IButtonProps;
  ButtonTertiary: IButtonProps;
}

const ToolbarForm: FC<ToolbarFormProps> = ({ label, ButtonPrimary, ButtonSecondary, ButtonTertiary }) => {
  return (
    <Toolbar
      contentLeft={
        <div>
          <span className="text-14-bold text-theme-neutral-900">{label}</span>
        </div>
      }
      contentRight={
        <div className="flex flex-row-reverse items-center gap-4">
          <Button {...ButtonPrimary} variant="primary" />
          <Button {...ButtonSecondary} variant="secondary" />
          <Button {...ButtonTertiary} variant="borderless" />
        </div>
      }
    />
  );
};

export default ToolbarForm;
