import type { ReactNode } from "react";

export type ModalSize = "xsmall" | "small" | "medium" | "large" | "xlarge" | "full-width";

export type SizeValue = string | number;

export type ModalProps = {
  header: ReactNode;
  content: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  draggable?: boolean;
  blocking?: boolean;
  open: boolean;
  onClose?: () => void;
  width?: SizeValue;
  height?: SizeValue;
  maxHeight?: SizeValue;
  labels?: Partial<{ dialogAriaLabel: string }>;
};
