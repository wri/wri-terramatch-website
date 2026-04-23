export type TextBadgeVariant = "primary" | "secondary" | "error";

export interface TextBadgeProps {
  children: React.ReactNode;
  variant?: TextBadgeVariant;
  className?: string;
}
