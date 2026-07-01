import type { ReactNode } from "react";

import { SizeValue } from "@/lib/sizing";

export type DrawerPlacement = "start" | "end" | "top" | "bottom";

export interface DrawerProps {
  closeOnInteractOutside?: boolean;
  children: (props: { onClose: () => void }) => ReactNode;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full" | "filterPanel";
  placement?: DrawerPlacement;
  modal?: boolean;
  maxW?: SizeValue;
  trapFocus?: boolean;
}

export interface DrawerTyped {
  closeOnInteractOutside?: boolean;
  children: ReactNode;
  open: boolean;
  onOpenChange: (e: { open: boolean }) => void;
  size: NonNullable<DrawerProps["size"]>;
  placement?: DrawerPlacement;
  modal?: boolean;
  trapFocus?: boolean;
}

export interface DrawerTriggerTyped {
  children: ReactNode;
  asChild?: boolean;
}

export interface DrawerContainerTyped {
  children: ReactNode;
  maxW?: SizeValue;
}
