import type { ReactNode } from "react";

import type { IButtonProps } from "@/redesignComponents/Forms/Actions/Button/Button";

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
  }
  export interface AccordionItemIndicatorProps {
    children?: ReactNode;
  }
  export interface AccordionItemContentProps {
    children?: ReactNode;
  }
}

export type StatusType = "success" | "error" | "default";

export interface AccordionHeaderProps {
  label: string;
  title: string;
  badge?: string;
  status?: StatusType;
  buttonProps?: IButtonProps;
}
