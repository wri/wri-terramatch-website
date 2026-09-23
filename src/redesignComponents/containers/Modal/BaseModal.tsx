// Delete this component when the modal from wri dont crash with the trap focus error.
import { Dialog, Portal } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import CloseButton from "@/redesignComponents/actions/Buttons/CloseButton/CloseButton";

import { BaseModalProps, DialogBackdropTyped, DialogCloseTriggerTyped, DialogContainerTyped } from "./Modal.types";
import { modalCloseButtonStyles, modalContainerStyles, modalContentStyles, modalHeaderStyles } from "./styles";

export type { BaseModalProps };

const TypedDialogBackdrop = Dialog.Backdrop as FC<DialogBackdropTyped>;
const TypedDialogPositioner = Dialog.Positioner as FC<DialogContainerTyped>;
const TypedDialogContent = Dialog.Content as FC<DialogContainerTyped>;
const TypedDialogHeader = Dialog.Header as FC<DialogContainerTyped>;
const TypedDialogBody = Dialog.Body as FC<DialogContainerTyped>;
const TypedDialogFooter = Dialog.Footer as FC<DialogContainerTyped>;
const TypedDialogCloseTrigger = Dialog.CloseTrigger as FC<DialogCloseTriggerTyped>;

const BaseModal: FC<BaseModalProps> = ({
  header,
  content,
  footer,
  size = "medium",
  width,
  height,
  maxHeight,
  blocking,
  open,
  onClose
}: BaseModalProps) => {
  const t = useT();

  if (open !== true) return null;
  return (
    <Dialog.Root
      open={open}
      onOpenChange={onClose}
      placement="center"
      scrollBehavior="inside"
      trapFocus={false}
      closeOnInteractOutside={blocking !== true}
      preventScroll={blocking !== true}
      closeOnEscape={blocking !== true}
      defaultOpen
    >
      <Portal>
        <TypedDialogBackdrop css={{ backgroundColor: "neutral.900", opacity: 0.64 }} />
        <TypedDialogPositioner>
          <TypedDialogContent
            tabIndex={0}
            aria-label={t("Modal dialog")}
            css={modalContainerStyles(size, width, height, maxHeight)}
          >
            <TypedDialogHeader css={modalHeaderStyles}>
              {header}
              {blocking !== true ? (
                <TypedDialogCloseTrigger css={modalCloseButtonStyles} asChild>
                  <CloseButton />
                </TypedDialogCloseTrigger>
              ) : null}
            </TypedDialogHeader>
            <TypedDialogBody css={modalContentStyles}>{content}</TypedDialogBody>
            {footer != null ? <TypedDialogFooter padding="0.75rem">{footer}</TypedDialogFooter> : null}
          </TypedDialogContent>
        </TypedDialogPositioner>
      </Portal>
    </Dialog.Root>
  );
};

export default BaseModal;
