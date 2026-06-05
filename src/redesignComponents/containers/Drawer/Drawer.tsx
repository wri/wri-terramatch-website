import { DrawerBackdrop, DrawerContent, DrawerPositioner, DrawerRoot, DrawerTrigger, Portal } from "@chakra-ui/react";
import { FC, useCallback, useRef, useState } from "react";

import { DrawerContainerTyped, DrawerProps, DrawerTriggerTyped, DrawerTyped } from "./Drawer.types";

const TypedDrawerRoot = DrawerRoot as FC<DrawerTyped>;
const TypedDrawerTrigger = DrawerTrigger as FC<DrawerTriggerTyped>;
const TypedDrawerPositioner = DrawerPositioner as FC<DrawerContainerTyped>;
const TypedDrawerContent = DrawerContent as FC<DrawerContainerTyped>;
const TypedDrawerBackdrop = DrawerBackdrop as FC;

const Drawer: FC<DrawerProps> = ({
  closeOnInteractOutside = true,
  children,
  trigger,
  open: openProp,
  onOpenChange,
  defaultOpen = false,
  size = "xs",
  placement,
  modal = true,
  lazyMount = true,
  unmountOnExit = true,
  restoreFocus,
  finalFocusEl
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChangeRef.current?.(nextOpen);
    },
    [isControlled]
  );

  const handleClose = useCallback(() => setOpen(false), [setOpen]);
  const handleRootOpenChange = useCallback((e: { open: boolean }) => setOpen(e.open), [setOpen]);

  return (
    <TypedDrawerRoot
      closeOnInteractOutside={closeOnInteractOutside}
      open={open}
      onOpenChange={handleRootOpenChange}
      size={size}
      placement={placement}
      modal={modal}
      lazyMount={lazyMount}
      unmountOnExit={unmountOnExit}
      restoreFocus={restoreFocus}
      finalFocusEl={finalFocusEl}
    >
      {trigger != null ? <TypedDrawerTrigger asChild>{trigger}</TypedDrawerTrigger> : null}
      <Portal>
        {closeOnInteractOutside && <TypedDrawerBackdrop />}
        <TypedDrawerPositioner>
          <TypedDrawerContent>
            {typeof children === "function" ? children({ onClose: handleClose }) : children}
          </TypedDrawerContent>
        </TypedDrawerPositioner>
      </Portal>
    </TypedDrawerRoot>
  );
};

export default Drawer;
