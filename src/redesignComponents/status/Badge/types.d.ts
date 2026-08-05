export type TextBadgeVariant = "primary" | "secondary" | "error";

export interface TextBadgeProps {
  children: React.ReactNode;
  variant?: TextBadgeVariant;
  className?: string;
}

export type NumberBadgeVariant = "notification" | "information" | "primary" | "secondary";

export type NumberBadgeSize = "small" | "large";

export interface NumberBadgeProps {
  count: number;
  variant?: NumberBadgeVariant;
  size?: NumberBadgeSize;
  ariaLabel?: string;
  className?: string;
}
