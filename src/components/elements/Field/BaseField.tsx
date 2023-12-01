import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

export interface BaseFieldProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: ReactNode;
}

const BaseField = ({ children, className, ...rest }: BaseFieldProps) => {
  return (
    <div {...rest} className={classNames("flex flex-col rounded-lg bg-neutral-50 p-4", className)}>
      {children}
    </div>
  );
};

export default BaseField;
