import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

import { useChampionsMap } from "../championsMap.context";

export type ControlMapPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "bottom-left-site"
  | "top-center"
  | "top-left-site"
  | "top-centerSite"
  | "top-centerPolygonsInCheckbox";

export interface ControlGroupProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    PropsWithChildren {
  position: ControlMapPosition;
  isFullscreen?: boolean;
}

const ControlGroup = ({ children, position, className, isFullscreen, ...props }: ControlGroupProps) => {
  const championsMap = useChampionsMap();

  return (
    <div
      {...props}
      className={twMerge(
        classNames("absolute z-[18] flex flex-col gap-8", {
          "top-5": position.includes("top") && !championsMap,
          "top-2": position.includes("top") && championsMap,
          "left-5 items-start": position.includes("left") && !championsMap,
          "left-2 items-start": position.includes("left") && championsMap,
          "right-5 items-end": position.includes("right") && !championsMap,
          "right-2 items-end": position.includes("right") && championsMap,
          "bottom-8": position.includes("bottom") && !championsMap,
          "bottom-2": position.includes("bottom") && championsMap,
          "!left-[30vw] items-start": position.includes("site"),
          "!left-5": isFullscreen,
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
