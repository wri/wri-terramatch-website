import { Flex } from "@chakra-ui/react";
import { type ReactElement, Fragment, memo } from "react";
import { twMerge } from "tailwind-merge";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import Tooltip from "@/redesignComponents/actions/Tooltip/Tooltip";
import { InfoIcon } from "@/redesignComponents/foundations/Icons";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

import { BulkToolbarAction } from "./ToolBar.type";
import { wrapToolbarInfoTooltipContent } from "./ToolbarInfoTooltipContent";

const ACTION_DIVIDER_CLASS = "!h-3.5 !w-[0.0625rem]";
const BORDERLESS_NEUTRAL_CLASS = "!px-1.5 !text-theme-neutral-100";
const BORDERLESS_DANGER_CLASS = "!px-1.5 !text-theme-error-300";
const BORDERLESS_DISABLED_CLASS = "disabled:!text-theme-neutral-400 disabled:!opacity-100";

type BulkActionToolbarActionsProps = {
  deleteAction: BulkToolbarAction;
  actions: BulkToolbarAction[];
};

const renderToolbarAction = ({
  tone,
  className,
  infoTooltip,
  tooltip,
  id: _id,
  ...buttonProps
}: BulkToolbarAction): ReactElement => {
  const isDisabledTooltip = tooltip != null && buttonProps.disabled === true;
  const button = (
    <Button
      {...buttonProps}
      className={twMerge(
        tone === "danger" ? BORDERLESS_DANGER_CLASS : BORDERLESS_NEUTRAL_CLASS,
        BORDERLESS_DISABLED_CLASS,
        className,
        isDisabledTooltip && "pointer-events-none"
      )}
      variant="borderless"
    />
  );

  return (
    <Flex alignItems="center" gap={0.5}>
      {isDisabledTooltip ? (
        <Tooltip content={wrapToolbarInfoTooltipContent(tooltip)} position="top">
          <span className="inline-flex">{button}</span>
        </Tooltip>
      ) : (
        button
      )}
      {infoTooltip != null && (
        <Tooltip content={wrapToolbarInfoTooltipContent(infoTooltip)} position="top">
          <InfoIcon height="1rem" width="1rem" color="neutral.100" />
        </Tooltip>
      )}
    </Flex>
  );
};

const BulkActionToolbarActions = memo(function BulkActionToolbarActions({
  deleteAction,
  actions
}: BulkActionToolbarActionsProps) {
  return (
    <Flex alignItems="center" gap={2} flexWrap="wrap">
      {renderToolbarAction(deleteAction)}
      {actions.map(action => (
        <Fragment key={action.id}>
          <SimpleDivider className={ACTION_DIVIDER_CLASS} />
          {renderToolbarAction(action)}
        </Fragment>
      ))}
    </Flex>
  );
});

export default BulkActionToolbarActions;
