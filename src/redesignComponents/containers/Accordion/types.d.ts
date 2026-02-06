import type { ReactNode } from "react";

export interface ExtendableCardProps {
  children: ReactNode;
  header: ReactNode;
  actions?: ReactNode;
}

declare module "@chakra-ui/react/dist/types/components/accordion/accordion" {
  export interface AccordionItemProps {
    children?: ReactNode;
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
  title: string;
  badge?: string;
  status?: "success" | "error";
}
