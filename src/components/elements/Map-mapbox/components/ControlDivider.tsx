import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export interface ControlDividerProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  direction?: "vertical" | "horizontal";
}

const ControlDivider = ({ direction = "horizontal", children, className, ...props }: ControlDividerProps) => {
  return (
    <div
      {...props}
      className={twMerge(
        classNames(`m-auto rounded-lg bg-neutral-400`, {
          "h-4 w-0.5": direction === "vertical",
          "h-0.5 w-4": direction === "horizontal"
        }),
        className
      )}
    />
  );
};

export default ControlDivider;
