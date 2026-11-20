import { type SystemStyleObject, Box, Flex } from "@chakra-ui/react";
import { type ReactElement, Fragment, memo } from "react";
import { twMerge } from "tailwind-merge";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import MultiActionButton, {
  IMultiActionButtonProps
} from "@/redesignComponents/actions/Buttons/MultiActionButton/MultiActionButton";
import Tooltip from "@/redesignComponents/actions/Tooltip/Tooltip";
import { InfoIcon } from "@/redesignComponents/foundations/Icons";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

import { BulkToolbarAction, BulkToolbarItem } from "./ToolBar.type";
import { wrapToolbarInfoTooltipContent } from "./ToolbarInfoTooltipContent";

const ACTION_DIVIDER_CLASS = "!h-3.5 !w-[0.0625rem]";
const BORDERLESS_NEUTRAL_CLASS = "!px-1.5 !text-theme-neutral-100";
const BORDERLESS_DANGER_CLASS = "!px-1.5 !text-theme-error-300";
const BORDERLESS_DISABLED_CLASS = "disabled:!text-theme-neutral-400 disabled:!opacity-100";

const MULTI_ACTION_MAIN_CLASS = "!pl-1.5 !pr-1.5 disabled:!opacity-100";

const MULTI_ACTION_TRIGGER_CSS: SystemStyleObject = {
  "& [data-part='trigger']": {
    paddingInlineStart: "0.25rem !important",
    paddingInlineEnd: "0.375rem !important"
  }
};

type BulkActionToolbarActionsProps = {
  deleteAction?: BulkToolbarAction;
  actions: BulkToolbarItem[];
};

const renderMultiAction = ({ className, ...multiActionProps }: IMultiActionButtonProps): ReactElement => (
  <Box css={MULTI_ACTION_TRIGGER_CSS}>
    <MultiActionButton
      variant="borderless"
      typeVariant="dark"
      {...multiActionProps}
      className={twMerge(MULTI_ACTION_MAIN_CLASS, className)}
    />
  </Box>
);

const renderToolbarAction = ({
  tone,
  className,
  infoTooltip,
  tooltip,
  variant = "borderless",
  id: _id,
  ...buttonProps
}: BulkToolbarAction): ReactElement => {
  const isDisabledTooltip = tooltip != null && buttonProps.disabled === true;
  const isBorderless = variant === "borderless";
  const button = (
    <Button
      {...buttonProps}
      className={twMerge(
        isBorderless && (tone === "danger" ? BORDERLESS_DANGER_CLASS : BORDERLESS_NEUTRAL_CLASS),
        isBorderless && BORDERLESS_DISABLED_CLASS,
        className,
        isDisabledTooltip && "pointer-events-none"
      )}
      variant={variant}
    />
  );

  return (
    <Flex alignItems="center" gap={0.5}>
      {isDisabledTooltip ? (
        <Tooltip content={wrapToolbarInfoTooltipContent(tooltip)} position="top" preserveFocusOnChild>
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
  const items = deleteAction != null ? [deleteAction, ...actions] : actions;

  return (
    <Flex alignItems="center" gap={2} flexWrap="wrap">
      {items.map((action, index) => {
        const isMultiAction = "multiAction" in action;
        const isPrimary = !isMultiAction && action.variant === "primary";
        return (
          <Fragment key={action.id}>
            {index > 0 && !isPrimary && <SimpleDivider className={ACTION_DIVIDER_CLASS} />}
            {isMultiAction ? renderMultiAction(action.multiAction) : renderToolbarAction(action)}
          </Fragment>
        );
      })}
    </Flex>
  );
});

export default BulkActionToolbarActions;
