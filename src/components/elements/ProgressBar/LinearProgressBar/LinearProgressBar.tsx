import { DetailedHTMLProps, HTMLAttributes } from "react";

import { Colors } from "@/types/common";

export interface LinerProgressbarProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  color?: Colors;
  value: number;
  textColor?: string;
  colorProgress?: string;
}

const LinearProgressBar = ({
  value,
  color = "primary",
  textColor,
  colorProgress,
  className,
  ...rest
}: LinerProgressbarProps) => {
  return (
    <div {...rest} className={`h-[9px] w-full rounded-full bg-neutral-200 ${className || ""}`} role="progressbar">
      <div className={`h-full bg-${color} rounded-full transition-all duration-300`} style={{ width: `${value}%` }} />
    </div>
  );
};

export default LinearProgressBar;
