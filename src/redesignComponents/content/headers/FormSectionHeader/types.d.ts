export type FormSectionStatus = "success" | "error" | "complete";
export interface FormSectionHeaderProps {
  label?: string;
  title: ReactNode;
  badge?: string;
  status?: AccordionStatus;
  statusLabel?: string;
}
