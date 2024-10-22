import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export interface ControlGroupProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    PropsWithChildren {
  position:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "bottom-left-site"
    | "top-center"
    | "top-left-site"
    | "top-centerSite"
    | "top-centerPolygonsInCheckbox";
}

const ControlGroup = ({ children, position, className, ...props }: ControlGroupProps) => {
  return (
    <div
      {...props}
      className={twMerge(
        classNames("absolute z-[18] flex flex-col gap-8", {
          "top-5": position.includes("top"),
          "left-5 items-start": position.includes("left"),
          "right-5 items-end": position.includes("right"),
          "bottom-8": position.includes("bottom"),
          "!left-[24vw] items-start": position.includes("site"),
          "left-[45%]": position.includes("center"),
          "left-[calc(50%+11.5vw)] -translate-x-1/2": position.includes("centerSite"),
          "left-[34%] lg:left-[35.5%]": position.includes("centerPolygonsInCheckbox")
        }),
        className
      )}
    >
      {children}
    </div>
  );
};

export default ControlGroup;
