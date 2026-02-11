import { FC } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";

import Toolbar from "./Toolbar";
import { ToolbarFormProps } from "./ToolBar.type";

const ToolbarForm: FC<ToolbarFormProps> = ({ ButtonLeft, ButtonPrimary, ButtonSecondary, ButtonTertiary }) => {
  return (
    <Toolbar
      className="px-6 py-3"
      contentLeft={
        <div>
          <Button {...ButtonLeft} variant="borderless" />
        </div>
      }
      contentRight={
        <div className="flex flex-row-reverse items-center gap-4">
          <Button {...ButtonPrimary} variant="primary" />
          <div className="h-4 w-[1px] bg-theme-neutral-300" />
          <Button {...ButtonSecondary} variant="secondary" />
          <div className="h-4 w-[1px] bg-theme-neutral-300" />
          <Button {...ButtonTertiary} variant="borderless" />
        </div>
      }
    />
  );
};

export default ToolbarForm;
