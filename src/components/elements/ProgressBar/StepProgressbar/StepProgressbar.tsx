import { DetailedHTMLProps, HTMLAttributes, ReactNode, useRef } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { Colors } from "@/types/common";

export interface StepProgressbarProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  color?: Colors;
  value: number;
  labels?: ReactNode[];
}

const StepProgressbar = ({ value, color = "primary", labels, className, ...rest }: StepProgressbarProps) => {
  const stepsRef = useRef<HTMLDivElement>(null);
  const countLabels = labels?.length || 0;

  return (
    <div className="h-fit w-full">
      <div className="relative w-full">
        <div className="absolute top-[-5px] w-full" ref={stepsRef}>
          <div className="flex w-full justify-between">
            {labels?.map((label, index) => (
              <div key={index}>
                <div className={countLabels === index + 1 ? "flex justify-end" : ""}>
                  <p className={`bg-${color} flex h-5 w-5 items-center justify-center rounded-full`}>
                    <Icon width={10} name={IconNames.CHECK_PROGRESSBAR} />
                  </p>
                </div>
                <div>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ height: stepsRef.current?.clientHeight }}>
        <div {...rest} className={`h-[9px] w-full rounded-full bg-neutral-200 ${className || ""}`} role="progressbar">
          <div
            className={`h-full bg-${color} rounded-full transition-all duration-300`}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StepProgressbar;
