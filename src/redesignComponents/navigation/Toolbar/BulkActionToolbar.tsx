import { Flex } from "@chakra-ui/react";
import { memo } from "react";

import Button, { IButtonProps } from "@/redesignComponents/actions/Buttons/Button/Button";
import MultiActionButton, {
  IMultiActionButtonProps
} from "@/redesignComponents/actions/Buttons/MultiActionButton/MultiActionButton";
import Tooltip from "@/redesignComponents/actions/Tooltip/Tooltip";
import { InfoIcon } from "@/redesignComponents/foundations/Icons";

import BulkActionToolbarActions from "./BulkActionToolbarActions";
import SelectionCountLabel from "./SelectionCountLabel";
import Toolbar from "./Toolbar";
import { BulkActionToolbarProps } from "./ToolBar.type";
import { wrapToolbarInfoTooltipContent } from "./ToolbarInfoTooltipContent";

const TOOLBAR_CLASS =
  "flex-wrap rounded-lg !bg-theme-primary-800 px-4 py-3 !shadow-[0_-0.25rem_0.375rem_-0.0625rem_rgba(0,0,0,0.10),0_-0.125rem_0.25rem_-0.125rem_rgba(0,0,0,0.10)]";

const BulkActionToolbar = memo(function BulkActionToolbar({
  selectedCount,
  cancelAction,
  deleteAction,
  actions = [],
  primaryAction,
  infoTooltip
}: BulkActionToolbarProps) {
  return (
    <Toolbar
      className={TOOLBAR_CLASS}
      contentLeft={<Button className="!text-theme-neutral-100" {...cancelAction} variant="borderless" />}
      contentCenter={<SelectionCountLabel count={selectedCount} />}
      classNameContentRight="max-w-full"
      contentRight={
        <Flex alignItems="center" gap={2} flexWrap="wrap">
          <BulkActionToolbarActions deleteAction={deleteAction} actions={actions} />
          {primaryAction != null && "otherActions" in primaryAction && primaryAction.otherActions.length > 0 ? (
            <MultiActionButton
              {...(primaryAction as IMultiActionButtonProps)}
              variant="primary"
              className="disabled:!border-theme-neutral-400 disabled:!bg-theme-neutral-300 disabled:!text-theme-neutral-500 disabled:!opacity-100"
            />
          ) : (
            <Button
              {...(primaryAction as IButtonProps)}
              variant="primary"
              className="disabled:!border-theme-neutral-400 disabled:!bg-theme-neutral-300 disabled:!text-theme-neutral-500 disabled:!opacity-100"
            />
          )}
          {infoTooltip != null && (
            <Tooltip content={wrapToolbarInfoTooltipContent(infoTooltip)} position="top">
              <InfoIcon height="1rem" width="1rem" color="neutral.100" />
            </Tooltip>
          )}
        </Flex>
      }
    />
  );
});

export default BulkActionToolbar;
