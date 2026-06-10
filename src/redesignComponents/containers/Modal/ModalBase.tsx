/**
 * Temporary local copy of @worldresources/wri-design-systems Modal for testing
 * Ark UI focus-trap lifecycle fixes (lazyMount, unmountOnExit, restoreFocus).
 * Replace with WriModal once the upstream component adopts these props.
 */
import { Dialog, Portal } from "@chakra-ui/react";
import { useRef } from "react";

import CloseButton from "@/redesignComponents/actions/Buttons/CloseButton/CloseButton";

import { modalCloseButtonStyles, modalContainerStyles, modalContentStyles, modalHeaderStyles } from "./modal.styles";
import type { ModalProps } from "./types";

const ModalBase = ({
  header,
  content,
  footer,
  size = "medium",
  width,
  height,
  maxHeight,
  draggable,
  blocking,
  open,
  onClose,
  labels
}: ModalProps) => {
  const positionerRef = useRef<HTMLDivElement>(null);
  const dialogAriaLabel = labels?.dialogAriaLabel ?? "Modal dialog";

  const getFocusableElement = () => {
    const container = positionerRef.current;
    if (!container) return undefined;

    return (
      container.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) ?? container
    );
  };

  const handleOpenChange = (details: { open: boolean }) => {
    if (!details.open) {
      onClose?.();
    }
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={handleOpenChange}
      placement="center"
      scrollBehavior="inside"
      closeOnInteractOutside={!draggable && !blocking}
      preventScroll={!draggable && !blocking}
      closeOnEscape={!blocking}
      lazyMount
      unmountOnExit
      restoreFocus={false}
      initialFocusEl={getFocusableElement}
      finalFocusEl={() => positionerRef.current}
    >
      <Portal>
        {!draggable ? <Dialog.Backdrop css={{ background: "rgba(0, 0, 0, 0.64)" }} /> : null}
        <Dialog.Positioner ref={positionerRef}>
          <Dialog.Content aria-label={dialogAriaLabel} css={modalContainerStyles(size, width, height, maxHeight)}>
            <Dialog.Header css={modalHeaderStyles}>
              {header}
              {!blocking ? (
                <Dialog.CloseTrigger css={modalCloseButtonStyles} asChild>
                  <CloseButton />
                </Dialog.CloseTrigger>
              ) : null}
            </Dialog.Header>
            <Dialog.Body css={modalContentStyles}>{content}</Dialog.Body>
            {footer ? <Dialog.Footer padding="0.75rem">{footer}</Dialog.Footer> : null}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ModalBase;
