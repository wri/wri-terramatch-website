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
        cancelButtonProps != null ? (
          <Box>
            <Button {...cancelButtonProps} variant="borderless" />
          </Box>
        ) : undefined
      }
      contentRight={
        <Flex className="flex-row-reverse items-center gap-4">
          {primaryButtonProps != null && <Button {...primaryButtonProps} variant="primary" />}
          {secondaryButtonProps != null && (
            <>
              <Box className="h-4 w-[0.0625rem] bg-theme-neutral-300" />
              <Button {...secondaryButtonProps} variant="secondary" />
            </>
          )}
          {tertiaryButtonProps != null && (
            <>
              <Box className="h-4 w-[0.0625rem] bg-theme-neutral-300" />
              <Button {...tertiaryButtonProps} variant="borderless" />
            </>
          )}
        </Flex>
      }
    />
  );
};

export default ToolbarForm;
import { Box, Flex } from "@chakra-ui/react";
