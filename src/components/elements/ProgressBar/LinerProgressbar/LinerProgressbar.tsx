import { DetailedHTMLProps, HTMLAttributes } from "react";

import { Colors } from "@/types/common";

export interface LinerProgressbarProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  color?: Colors;
  value: number;
}

const LinerProgressbar = (props: LinerProgressbarProps) => {
  return (
    <div className={`h-[9px] w-full bg-neutral-200 ${props.className || ""}`} role="progressbar">
      <div className={`h-full bg-${props.color} transition-all duration-300`} style={{ width: `${props.value}%` }} />
    </div>
  );
};

export default LinerProgressbar;
