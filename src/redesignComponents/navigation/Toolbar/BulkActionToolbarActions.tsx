import { Flex } from "@chakra-ui/react";
import { FC, Fragment } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

import { BulkToolbarAction } from "./ToolBar.type";

const ACTION_DIVIDER_CLASS = "!h-3.5 !w-[0.0625rem]";
const BORDERLESS_NEUTRAL_CLASS = "!text-theme-neutral-100";

type BulkActionToolbarActionsProps = {
  deleteAction: BulkToolbarAction;
  actions: BulkToolbarAction[];
};

const BulkActionToolbarActions: FC<BulkActionToolbarActionsProps> = ({ deleteAction, actions }) => {
  const { tone: deleteTone, ...deleteButtonProps } = deleteAction;

  return (
    <Flex alignItems="center" gap={2} flexWrap="wrap">
      <Button
        {...deleteButtonProps}
        className={deleteTone === "danger" ? "!text-theme-error-300" : BORDERLESS_NEUTRAL_CLASS}
        variant="borderless"
      />
      {actions.map(action => {
        const { id, tone, ...buttonProps } = action;

        return (
          <Fragment key={id}>
            <SimpleDivider className={ACTION_DIVIDER_CLASS} />
            <Button
              {...buttonProps}
              className={tone === "danger" ? "!text-theme-error-300" : BORDERLESS_NEUTRAL_CLASS}
              variant="borderless"
            />
          </Fragment>
        );
      })}
    </Flex>
  );
};

export default BulkActionToolbarActions;
