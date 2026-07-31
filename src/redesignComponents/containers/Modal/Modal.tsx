import { Box } from "@chakra-ui/react";
import { getThemedSpacing, Modal as WriModal } from "@worldresources/wri-design-systems";
import type { ComponentProps, ReactNode } from "react";
import { FC } from "react";

import { useModalScrollFix } from "@/hooks/useModalScrollFix";

type ModalProps = ComponentProps<typeof WriModal> & {
  contentPadding?: boolean;
};

const Modal: FC<ModalProps> = ({
  open = false,
  modal = true,
  trapFocus = true,
  restoreFocus = true,
  content,
  contentPadding = true,
  ...props
}) => {
  useModalScrollFix(open);

  const wrappedContent: ReactNode =
    content != null && contentPadding ? <Box p={getThemedSpacing(300)}>{content}</Box> : content;

  return (
    <WriModal
      lazyMount
      unmountOnExit
      open={open}
      modal={modal}
      trapFocus={trapFocus}
      restoreFocus={restoreFocus}
      content={wrappedContent}
      {...props}
    />
  );
};

export default Modal;
