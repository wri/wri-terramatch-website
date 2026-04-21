import { DrawerBackdrop, DrawerContent, DrawerPositioner, DrawerRoot, DrawerTrigger, Portal } from "@chakra-ui/react";
import { FC, useState } from "react";

import { DrawerContainerTyped, DrawerProps, DrawerTriggerTyped, DrawerTyped } from "./Drawer.types";

const TypedDrawerRoot = DrawerRoot as FC<DrawerTyped>;
const TypedDrawerTrigger = DrawerTrigger as FC<DrawerTriggerTyped>;
const TypedDrawerPositioner = DrawerPositioner as FC<DrawerContainerTyped>;
const TypedDrawerContent = DrawerContent as FC<DrawerContainerTyped>;
const TypedDrawerBackdrop = DrawerBackdrop as FC;

const Drawer: FC<DrawerProps> = ({ children, trigger }) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  return (
    <TypedDrawerRoot open={open} onOpenChange={e => setOpen(e.open)}>
      <TypedDrawerTrigger asChild>{trigger}</TypedDrawerTrigger>
      <Portal>
        <TypedDrawerBackdrop />
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
