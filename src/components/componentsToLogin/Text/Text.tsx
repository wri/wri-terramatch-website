import React, { ReactNode } from "react";
export interface TextProps {
  id?: string;
  variant: string;
  className?: string;
  children: ReactNode;
  href?: string;
  as?: React.ElementType;
}
const Text: React.FC<TextProps> = ({ id, variant, className, children, href, as = "div", ...props }) => {
  const classes = `${className || ""} ${variant || ""}`;
  const Tag = href ? "a" : as;
  return (
    <Tag className={classes} {...props} id={id}>
      {children}
    </Tag>
  );
};
export default Text;
