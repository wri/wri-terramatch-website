import { ReactNode } from "react";

export interface DrawerProps {
  children: (props: { onClose: () => void }) => ReactNode;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}

export interface DrawerTyped {
  children: ReactNode;
  open: boolean;
  onOpenChange: (e: { open: boolean }) => void;
}

export interface DrawerTriggerTyped {
  children: ReactNode;
  asChild?: boolean;
}

export interface DrawerContainerTyped {
  children: ReactNode;
}
