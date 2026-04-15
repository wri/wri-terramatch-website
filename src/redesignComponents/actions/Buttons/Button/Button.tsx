import { ButtonProps } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { Button as WriButton } from "@worldresources/wri-design-systems";
import classNames from "classnames";
import React from "react";

export interface IButtonProps extends Omit<ButtonProps, "size" | "variant" | "colorPalette" | "children"> {
  className?: string;
  variant?: "primary" | "secondary" | "borderless" | "outline";
  size?: "default" | "small";
  children?: React.ReactNode;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  as?: React.ElementType;
  href?: string;
}

const BUTTON_RESPONSIVE_MAP: Record<string, { fontSize: string; padding: string; height: string; svgSize: string }> = {
  default: {
    fontSize: "1rem",
    padding: "0.5rem 1rem",
    height: "2.5rem",
    svgSize: "1rem"
  },
  small: {
    fontSize: "0.75rem",
    padding: "0.375rem 0.5rem",
    height: "1.75rem",
    svgSize: "0.625rem"
  }
};

const StyledWriButton = styled(WriButton)<{
  $fontSize: string;
  $padding: string;
  $height: string;
  $svgSize: string;
}>`
  font-size: ${({ $fontSize }) => $fontSize} !important;
  padding: ${({ $padding }) => $padding} !important;
  height: ${({ $height }) => $height} !important;

  & span {
    font-size: inherit !important;
  }

  & svg {
    width: ${({ $svgSize }) => $svgSize} !important;
    height: ${({ $svgSize }) => $svgSize} !important;
  }
`;

const Button = ({ children, className, variant = "primary", size = "default", ...props }: IButtonProps) => {
  return (
    <StyledWriButton
      variant={variant}
      size={size}
      $fontSize={BUTTON_RESPONSIVE_MAP[size].fontSize}
      $padding={BUTTON_RESPONSIVE_MAP[size].padding}
      $height={BUTTON_RESPONSIVE_MAP[size].height}
      $svgSize={BUTTON_RESPONSIVE_MAP[size].svgSize}
      {...props}
      className={classNames("shadow-monitored", className)}
    >
      {children}
    </StyledWriButton>
  );
};

export default Button;
