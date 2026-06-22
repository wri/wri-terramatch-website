import type { ModalProps } from "@worldresources/wri-design-systems";
import type { ReactNode, Ref } from "react";

export type BaseModalProps = Omit<ModalProps, "draggable">;

export type ModalSize = NonNullable<ModalProps["size"]>;

type ChakraCss = Record<string, unknown>;

export interface DialogBackdropTyped {
  css?: ChakraCss;
}

export interface DialogContainerTyped {
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
  css?: ChakraCss;
  "aria-label"?: string;
  padding?: string;
  tabIndex?: number;
}

export interface DialogCloseTriggerTyped {
  children?: ReactNode;
  css?: ChakraCss;
  asChild?: boolean;
}
