import { Flex } from "@chakra-ui/react";
import { Fragment, memo } from "react";
import { twMerge } from "tailwind-merge";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

import { BulkToolbarAction, BulkToolbarActionTone } from "./ToolBar.type";

const ACTION_DIVIDER_CLASS = "!h-3.5 !w-[0.0625rem]";
const BORDERLESS_NEUTRAL_CLASS = "!text-theme-neutral-100";
const BORDERLESS_DISABLED_CLASS = "!text-theme-neutral-400 disabled:!opacity-100";
const DANGER_CLASS = "!text-theme-error-300";

const getActionClassName = (tone: BulkToolbarActionTone | undefined, disabled: boolean | undefined) =>
  disabled === true ? BORDERLESS_DISABLED_CLASS : tone === "danger" ? DANGER_CLASS : BORDERLESS_NEUTRAL_CLASS;

type BulkActionToolbarActionsProps = {
  deleteAction: BulkToolbarAction;
  actions: BulkToolbarAction[];
};

const BulkActionToolbarActions = memo(function BulkActionToolbarActions({
  deleteAction,
  actions
}: BulkActionToolbarActionsProps) {
  const { tone: deleteTone, className: deleteClassName, ...deleteButtonProps } = deleteAction;

  return (
    <Flex alignItems="center" gap={2} flexWrap="wrap">
      <Button
        {...deleteButtonProps}
        className={twMerge(getActionClassName(deleteTone, deleteButtonProps.disabled), deleteClassName)}
        variant="borderless"
      />
      {actions.map(action => {
        const { id, tone, className, ...buttonProps } = action;

        return (
          <Fragment key={id}>
            <SimpleDivider className={ACTION_DIVIDER_CLASS} />
            <Button
              {...buttonProps}
              className={twMerge(getActionClassName(tone, buttonProps.disabled), className)}
              variant="borderless"
            />
          </Fragment>
        );
      })}
    </Flex>
  );
});

export default BulkActionToolbarActions;
