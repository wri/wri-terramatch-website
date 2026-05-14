import type { ReactNode } from "react";

export type AccordionVariant = "primary" | "secondary" | "borderless";

export interface AccordionProps {
  children: ReactNode;
  header: ReactNode;
  actions?: ReactNode;
  variant?: AccordionVariant;
  className?: string;
  classNameHeader?: string;
  defaultOpen?: boolean;
}

export type AccordionStatus = "success" | "error" | "complete" | "warning";

declare module "@chakra-ui/react/dist/types/components/accordion/accordion" {
  export interface AccordionItemProps {
    children?: ReactNode;
    value?: string;
  }
  export interface AccordionItemTriggerProps {
    children?: ReactNode;
    css?: Record<string, unknown>;
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
