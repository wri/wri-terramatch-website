import type { ReactNode } from "react";

export interface DrawerProps {
  children: (props: { onClose: () => void }) => ReactNode;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full" | "filterPanel";
}

export interface DrawerTyped {
  children: ReactNode;
  open: boolean;
  onOpenChange: (e: { open: boolean }) => void;
  size: NonNullable<DrawerProps["size"]>;
}

export interface DrawerTriggerTyped {
  children: ReactNode;
  asChild?: boolean;
}

export interface DrawerContainerTyped {
  children: ReactNode;
}
