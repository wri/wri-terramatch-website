import { ReactElement } from "react";

export type ActionStatusTagState = "neutral-light" | "neutral-dark" | "attention" | "success" | "warning";

export interface ActionStatusTagProps {
  state?: ActionStatusTagState;
  className?: string;
  size?: "small" | "default";
  label?: string;
  icon?: ReactElement;
}
