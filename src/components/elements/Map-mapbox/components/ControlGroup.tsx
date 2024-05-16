import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export interface ControlGroupProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    PropsWithChildren {
  position: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

const ControlGroup = ({ children, position, className, ...props }: ControlGroupProps) => {
  return (
    <div
      {...props}
      className={twMerge(
        classNames("absolute z-20 flex flex-col gap-8", {
          "top-5": position.includes("top"),
          "left-5 items-start": position.includes("left"),
          "right-5 items-end": position.includes("right"),
          "bottom-7": position.includes("bottom")
        }),
        className
      )}
    >
      {children}
    </div>
  );
};

export default ControlGroup;
