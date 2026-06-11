import { Dialog, Portal } from "@chakra-ui/react";
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

const BaseModal = ({
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
  if (!open) return null;
  return (
    <Dialog.Root
      open={open}
      onOpenChange={onClose}
      placement="center"
      scrollBehavior="inside"
      trapFocus={false}
      closeOnInteractOutside={!blocking}
      preventScroll={!blocking}
      closeOnEscape={!blocking}
      defaultOpen
    >
      <Portal>
        <TypedDialogBackdrop css={{ background: "rgba(0, 0, 0, 0.64)" }} />
        <TypedDialogPositioner>
          <TypedDialogContent
            tabIndex={0}
            aria-label="Modal dialog"
            css={modalContainerStyles(size, width, height, maxHeight)}
          >
            <TypedDialogHeader css={modalHeaderStyles}>
              {header}
              {!blocking ? (
                <TypedDialogCloseTrigger css={modalCloseButtonStyles} asChild>
                  <CloseButton />
                </TypedDialogCloseTrigger>
              ) : null}
            </TypedDialogHeader>
            <TypedDialogBody css={modalContentStyles}>{content}</TypedDialogBody>
            {footer ? <TypedDialogFooter padding="0.75rem">{footer}</TypedDialogFooter> : null}
          </TypedDialogContent>
        </TypedDialogPositioner>
      </Portal>
    </Dialog.Root>
  );
};

export default BaseModal;
