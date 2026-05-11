import { FC } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";

import Toolbar from "./Toolbar";
import { ToolbarFormProps } from "./ToolBar.type";

const ToolbarForm: FC<ToolbarFormProps> = ({
  cancelButtonProps,
  primaryButtonProps,
  secondaryButtonProps,
  tertiaryButtonProps
}) => {
  return (
    <Toolbar
      className="px-6 py-3"
      contentLeft={
        <div>
          <Button {...cancelButtonProps} variant="borderless" />
        </div>
      }
      contentRight={
        <div className="flex flex-row-reverse items-center gap-4">
          <Button {...primaryButtonProps} variant="primary" />
          {secondaryButtonProps && (
            <>
              <div className="bg-theme-neutral-300 h-4 w-[0.0625rem]" />
              <Button {...secondaryButtonProps} variant="secondary" />
            </>
          )}
          {tertiaryButtonProps && (
            <>
              <div className="bg-theme-neutral-300 h-4 w-[0.0625rem]" />
              <Button {...tertiaryButtonProps} variant="borderless" />
            </>
          )}
        </div>
      }
    />
  );
};

export default ToolbarForm;
