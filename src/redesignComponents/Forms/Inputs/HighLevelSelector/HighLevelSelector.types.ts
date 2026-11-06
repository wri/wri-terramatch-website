import type { SelectRootProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

export interface HighLevelSelectorItem {
  label: string;
  value: string;
  disabled?: boolean;
  group?: string;
}

export interface HighLevelSelectorProps {
  items: HighLevelSelectorItem[];
  label: string;
  autoFocus?: boolean;
  className?: string;
  defaultOpen?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  emptyMessage?: string;
  id?: string;
  name?: string;
  open?: boolean;
  placeholder?: string;
  required?: boolean;
  value?: string;
  width?: SelectRootProps<HighLevelSelectorItem>["width"];
  onBlur?: () => void;
  onChange?: (value: string, item?: HighLevelSelectorItem) => void;
  onOpenChange?: (open: boolean) => void;
}

export interface HighLevelPopoverSelectorProps {
  /** Popover body; only mounted while the popover is open. */
  children: ReactNode;
  open: boolean;
  placeholder: string;
  className?: string;
  contentWidth?: string;
  disabled?: boolean;
  subtitle?: ReactNode;
  value?: string | null;
  width?: SelectRootProps<HighLevelSelectorItem>["width"];
  onOpenChange: (open: boolean) => void;
}

export interface SelectorValueChangeDetails {
  items: HighLevelSelectorItem[];
  value: string[];
}

export interface SelectorOpenChangeDetails {
  open: boolean;
  reason?:
    | "arrow-key"
    | "clear-trigger"
    | "escape-key"
    | "input-change"
    | "input-click"
    | "interact-outside"
    | "item-select"
    | "script"
    | "trigger-click";
}
