import { Flex } from "@chakra-ui/react";
import classNames from "classnames";
import { Fragment, memo } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import Tooltip from "@/redesignComponents/actions/Tooltip/Tooltip";
import { InfoIcon } from "@/redesignComponents/foundations/Icons";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

import { BulkToolbarAction } from "./ToolBar.type";
import { wrapToolbarInfoTooltipContent } from "./ToolbarInfoTooltipContent";

const ACTION_DIVIDER_CLASS = "!h-3.5 !w-[0.0625rem]";
const BORDERLESS_NEUTRAL_CLASS = "!px-1.5 !text-theme-neutral-100";
const BORDERLESS_DANGER_CLASS = "!px-1.5 !text-theme-error-300";
const BORDERLESS_DISABLED_CLASS = "!cursor-not-allowed !text-theme-neutral-400 !opacity-60";

type BulkActionToolbarActionsProps = {
  deleteAction: BulkToolbarAction;
  actions: BulkToolbarAction[];
};

const BulkActionToolbarActions = memo(function BulkActionToolbarActions({
  deleteAction,
  actions
}: BulkActionToolbarActionsProps) {
  const { tone: deleteTone, infoTooltip: deleteInfoTooltip, ...deleteButtonProps } = deleteAction;

  return (
    <Flex alignItems="center" gap={2} flexWrap="wrap">
      <Flex alignItems="center" gap={0.5}>
        <Button
          {...deleteButtonProps}
          className={classNames(
            deleteTone === "danger" ? BORDERLESS_DANGER_CLASS : BORDERLESS_NEUTRAL_CLASS,
            deleteButtonProps.disabled && BORDERLESS_DISABLED_CLASS
          )}
          variant="borderless"
        />
        {deleteInfoTooltip != null && (
          <Tooltip content={wrapToolbarInfoTooltipContent(deleteInfoTooltip)} position="top">
            <InfoIcon height="1rem" width="1rem" color="neutral.100" />
          </Tooltip>
        )}
      </Flex>
      {actions.map(action => {
        const { id, tone, infoTooltip, ...buttonProps } = action;

        return (
          <Fragment key={id}>
            <SimpleDivider className={ACTION_DIVIDER_CLASS} />
            <Flex alignItems="center" gap={0.5}>
              <Button
                {...buttonProps}
                className={classNames(
                  tone === "danger" ? BORDERLESS_DANGER_CLASS : BORDERLESS_NEUTRAL_CLASS,
                  buttonProps.disabled && BORDERLESS_DISABLED_CLASS,
                  buttonProps.className
                )}
                variant="borderless"
              />
              {infoTooltip != null && (
                <Tooltip content={wrapToolbarInfoTooltipContent(infoTooltip)} position="top">
                  <InfoIcon height="1rem" width="1rem" color="neutral.100" />
                </Tooltip>
              )}
            </Flex>
          </Fragment>
        );
      })}
    </Flex>
  );
});

export default BulkActionToolbarActions;
