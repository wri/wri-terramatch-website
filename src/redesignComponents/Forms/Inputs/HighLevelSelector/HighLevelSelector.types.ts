import type { SelectRootProps } from "@chakra-ui/react";

export interface HighLevelSelectorItem {
  label: string;
  value: string;
  disabled?: boolean;
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
