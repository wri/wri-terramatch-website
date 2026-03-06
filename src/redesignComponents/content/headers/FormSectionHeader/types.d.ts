export type FormSectionStatus = "error" | "complete";
export interface FormSectionHeaderProps {
  label?: string;
  title: ReactNode;
  badge?: string;
  status?: AccordionStatus;
  statusLabel?: string;
  actions?: ReactNode;
  showBorder?: boolean;
  className?: string;
}
