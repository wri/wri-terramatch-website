import type { ReactNode } from "react";

export interface ExtendableCardProps {
  children: ReactNode;
  header: ReactNode;
}

declare module "@chakra-ui/react/dist/types/components/accordion/accordion" {
  export interface AccordionItemProps {
    children?: ReactNode;
  }
  export interface AccordionItemTriggerProps {
    children?: ReactNode;
  }
  export interface AccordionItemIndicatorProps {
    children?: ReactNode;
  }
  export interface AccordionItemContentProps {
    children?: ReactNode;
  }
}
