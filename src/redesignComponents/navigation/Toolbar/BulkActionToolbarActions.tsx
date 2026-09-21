import { Flex } from "@chakra-ui/react";
import { type ReactElement, Fragment, memo } from "react";
import { twMerge } from "tailwind-merge";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import Tooltip from "@/redesignComponents/actions/Tooltip/Tooltip";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

import { BulkToolbarAction, BulkToolbarActionTone } from "./ToolBar.type";
import { wrapToolbarInfoTooltipContent } from "./ToolbarInfoTooltipContent";

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

const renderToolbarActionButton = ({
  tone,
  className,
  tooltip,
  id: _id,
  ...buttonProps
}: BulkToolbarAction): ReactElement => {
  const isDisabledTooltip = tooltip != null && buttonProps.disabled === true;
  const button = (
    <Button
      {...buttonProps}
      className={twMerge(
        getActionClassName(tone, buttonProps.disabled),
        className,
        isDisabledTooltip && "pointer-events-none"
      )}
      variant="borderless"
    />
  );

  if (!isDisabledTooltip) {
    return button;
  }

  return (
    <Tooltip content={wrapToolbarInfoTooltipContent(tooltip)} position="top">
      <span className="inline-flex">{button}</span>
    </Tooltip>
  );
};

const BulkActionToolbarActions = memo(function BulkActionToolbarActions({
  deleteAction,
  actions
}: BulkActionToolbarActionsProps) {
  return (
    <Flex alignItems="center" gap={2} flexWrap="wrap">
      {renderToolbarActionButton(deleteAction)}
      {actions.map(action => (
        <Fragment key={action.id}>
          <SimpleDivider className={ACTION_DIVIDER_CLASS} />
          {renderToolbarActionButton(action)}
        </Fragment>
      ))}
    </Flex>
  );
});

export default BulkActionToolbarActions;
