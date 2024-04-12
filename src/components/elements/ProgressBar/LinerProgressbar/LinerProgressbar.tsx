import { DetailedHTMLProps, HTMLAttributes } from "react";

import { Colors } from "@/types/common";

export interface LinerProgressbarProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  color?: Colors;
  value: number;
  textColor?: string;
  colorProgress?: string;
}

const LinerProgressbar = ({
  value,
  color = "primary",
  textColor,
  colorProgress,
  className,
  ...rest
}: LinerProgressbarProps) => {
  const colorProgressClass = colorProgress ? colorProgress : `bg-${color}`;
  return (
    <div {...rest} className={`h-[9px] w-full ${className || ""}`} role="progressbar">
      <div
        className={`h-full ${colorProgressClass} transition-all duration-300 ${textColor} rounded-lg`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default LinerProgressbar;
