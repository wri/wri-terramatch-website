import { Flex, Text } from "@chakra-ui/react";
import { FC } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

import Toolbar from "./Toolbar";
import { BulkActionToolbarProps } from "./ToolBar.type";

const BulkActionToolbar: FC<BulkActionToolbarProps> = ({
  primaryButtonProps,
  secondaryButtonProps,
  tertiaryButtonProps,
  quantityButtonProps,
  items,
  ButtonCancel,
  ButtonDelete
}: BulkActionToolbarProps) => {
  return (
    <Toolbar
      className="rounded-lg !bg-theme-primary-800 px-4 py-3"
      contentLeft={<Button className="!text-theme-neutral-100" {...ButtonCancel} variant="borderless" />}
      contentCenter={
        <Flex gap={1}>
          <Text color="neutral.100" textStyle={"300-bold"}>
            {items}
          </Text>
          <Text color="neutral.100" textStyle={"300"}>
            items selected
          </Text>
        </Flex>
      }
      contentRight={
        <Flex alignItems="center" gap={2}>
          <Button {...ButtonDelete} className="!text-theme-error-300" variant="borderless" />
          <SimpleDivider className="!h-3.5 !w-[0.0625rem]" />
          <Button {...quantityButtonProps} variant="borderless" className="!text-theme-neutral-100" />
          <SimpleDivider className="!h-3.5 !w-[0.0625rem]" />
          <Button {...tertiaryButtonProps} variant="borderless" className="!text-theme-neutral-100" />
          <SimpleDivider className="!h-3.5 !w-[0.0625rem]" />
          <Button {...secondaryButtonProps} variant="borderless" className="!text-theme-neutral-100" />
          <Button {...primaryButtonProps} variant="primary" />
        </Flex>
      }
    />
  );
};

export default BulkActionToolbar;
