export type TextBadgeVariant = "primary" | "secondary";

export interface TextBadgeProps {
  children: React.ReactNode;
  variant?: TextBadgeVariant;
  className?: string;
}
