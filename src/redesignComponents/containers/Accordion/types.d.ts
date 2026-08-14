import type { MouseEvent, PointerEvent, ReactNode } from "react";

export type AccordionVariant = "primary" | "secondary" | "tertiary" | "quaternary" | "borderless";

export interface AccordionProps {
  children: ReactNode;
  header: ReactNode;
  actions?: ReactNode;
  variant?: AccordionVariant;
  className?: string;
  classNameHeader?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isScrollable?: boolean;
}

export type AccordionStatus = "success" | "error" | "complete";

declare module "@chakra-ui/react/dist/types/components/accordion/accordion" {
  export interface AccordionItemProps {
    children?: ReactNode;
    value?: string;
  }
  export interface AccordionItemTriggerProps {
    children?: ReactNode;
    css?: Record<string, unknown>;
    onPointerDown?: (event: PointerEvent<HTMLButtonElement>) => void;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  }
  export interface AccordionItemIndicatorProps {
    children?: ReactNode;
  }
  export interface AccordionItemContentProps {
    children?: ReactNode;
  }
}

export interface AccordionHeaderProps {
  label?: string;
  title: ReactNode;
  badge?: string;
  status?: AccordionStatus;
  statusLabel?: string;
}

export type ListSectionHeaderLevel = "top-level" | "sub-level";

export interface ListSectionHeaderProps {
  level?: ListSectionHeaderLevel;
  label?: ReactNode;
  title: ReactNode;
  titleHref?: string;
  onTitleClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  caption?: ReactNode;
  statusLabels?: ReactNode;
  icon?: ReactNode;
  className?: string;
  dueDate?: string;
}
