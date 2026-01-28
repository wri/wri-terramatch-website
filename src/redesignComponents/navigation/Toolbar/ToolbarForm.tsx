import { FC } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";

import Toolbar from "./Toolbar";
import { ToolbarFormProps } from "./ToolBar.type";

const ToolbarForm: FC<ToolbarFormProps> = ({ label, ButtonPrimary, ButtonSecondary, ButtonTertiary }) => {
  return (
    <Toolbar
      className="px-6 py-3"
      contentLeft={
        <div>
          <span className="text-14-bold text-theme-neutral-900">{label}</span>
        </div>
      }
      contentRight={
        <div className="flex flex-row-reverse items-center gap-4">
          <Button {...ButtonPrimary} variant="primary" />
          <div className="bg-theme-neutral-300 h-4 w-[1px]" />
          <Button {...ButtonSecondary} variant="secondary" />
          <div className="bg-theme-neutral-300 h-4 w-[1px]" />
          <Button {...ButtonTertiary} variant="borderless" />
        </div>
      }
    />
  );
};

export default ToolbarForm;
