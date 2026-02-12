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
          {ButtonSecondary && (
            <>
              <div className="bg-theme-neutral-300 h-4 w-[1px]" />
              <Button {...ButtonSecondary} variant="secondary" />
            </>
          )}
          {ButtonTertiary && (
            <>
              <div className="bg-theme-neutral-300 h-4 w-[1px]" />
              <Button {...ButtonTertiary} variant="borderless" />
            </>
          )}
        </div>
      }
    />
  );
};

export default ToolbarForm;
