import { ButtonHTMLAttributes, ReactNode } from "react";

import { BUTTON_VARIANT_TRASNPARENT } from "./ButtonVariant";
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
  className?: string;
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}
const Button = (props: ButtonProps) => {
  const { variant = BUTTON_VARIANT_TRASNPARENT, className, children, type = "button", onClick, ...restProps } = props;

  return (
    <button className={`${variant} ${className}`} type={type} onClick={onClick} {...restProps}>
      {children}
    </button>
  );
};

export default Button;
