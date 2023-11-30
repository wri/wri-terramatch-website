import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export interface ControlGroupProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    PropsWithChildren {
  direction?: "row" | "col";
}

const ControlButtonsGroup = ({ direction = "col", children, className, ...props }: ControlGroupProps) => {
  return (
    <div
      {...props}
      className={twMerge(
        classNames(
          `flex rounded-lg bg-white shadow hover:[&>button]:bg-neutral-200`,

          {
            "h-8 flex-row": direction === "row",
            "w-8 flex-col": direction === "col"
          }
        ),
        className
      )}
    >
      {children}
    </div>
  );
};

export default ControlButtonsGroup;
