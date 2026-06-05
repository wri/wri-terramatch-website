import { CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

import { useModalScrollFix } from "@/hooks/useModalScrollFix";

type ModalSize = "xsmall" | "small" | "medium" | "large" | "xlarge" | "full-width";
type SizeValue = string | number;

type ModalProps = {
  header: ReactNode;
  content: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  width?: SizeValue;
  height?: SizeValue;
  maxHeight?: SizeValue;
  draggable?: boolean;
  blocking?: boolean;
  open: boolean;
  onClose?: () => void;
  restoreFocus?: boolean;
  finalFocusEl?: () => HTMLElement | null;
  trapFocus?: boolean;
  present?: boolean;
  lazyMount?: boolean;
  unmountOnExit?: boolean;
  modal?: boolean;
};

const sizeToWidth: Record<ModalSize, SizeValue> = {
  xsmall: "24rem",
  small: "28rem",
  medium: "34rem",
  large: "48rem",
  xlarge: "64rem",
  "full-width": "calc(100vw - 2rem)"
};

const Modal: FC<ModalProps> = ({
  header,
  content,
  footer,
  size = "medium",
  width,
  height,
  maxHeight,
  draggable = false,
  blocking = false,
  open = false,
  onClose,
  restoreFocus,
  finalFocusEl,
  trapFocus,
  present,
  lazyMount = true,
  unmountOnExit = true,
  modal = true
}) => {
  useModalScrollFix(open);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details: { open: boolean }) => {
        if (!details.open) {
          onClose?.();
        }
      }}
      placement="center"
      scrollBehavior="inside"
      closeOnInteractOutside={!draggable && !blocking}
      preventScroll={!draggable && !blocking}
      closeOnEscape={!blocking}
      restoreFocus={restoreFocus}
      finalFocusEl={finalFocusEl}
      trapFocus={trapFocus}
      present={present}
      lazyMount={lazyMount}
      unmountOnExit={unmountOnExit}
      modal={modal}
    >
      <Portal>
        {!draggable ? <Dialog.Backdrop bg="rgba(0, 0, 0, 0.64)" /> : null}
        <Dialog.Positioner>
          <Dialog.Content
            aria-label="Modal dialog"
            width={width ?? sizeToWidth[size]}
            height={height}
            maxHeight={maxHeight}
          >
            <Dialog.Header display="flex" alignItems="center" justifyContent="space-between" gap={3}>
              {header}
              {!blocking ? (
                <Dialog.CloseTrigger asChild>
                  <CloseButton />
                </Dialog.CloseTrigger>
              ) : null}
            </Dialog.Header>
            <Dialog.Body>{content}</Dialog.Body>
            {footer != null ? <Dialog.Footer p={3}>{footer}</Dialog.Footer> : null}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default Modal;
