import { IconButton } from "@mui/material";
import type { MouseEvent, ReactNode } from "react";

type CircularIconButtonProps = {
  children: ReactNode;
  onClick: (event: MouseEvent) => void;
  disabled?: boolean;
  color?: "primary" | "warning";
  ariaLabel: string;
};

export const CircularIconButton = ({
  children,
  onClick,
  disabled,
  color = "primary",
  ariaLabel
}: CircularIconButtonProps) => (
  <IconButton size="small" disabled={disabled} onClick={onClick} aria-label={ariaLabel} color={color} sx={{ p: 0.25 }}>
    {children}
  </IconButton>
);
