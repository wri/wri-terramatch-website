import { twMerge } from "tailwind-merge";

import Text from "../Text/Text";

export interface TooltipLineProgressBarMonitoredProps {
  value: string;
  label: string;
  colorClass: string;
}

const TooltipLineProgressBarMonitored = ({ value, label, colorClass }: TooltipLineProgressBarMonitoredProps) => {
  return (
    <div className="flex gap-1.5 rounded-md bg-white p-2 shadow-monitored">
      <div className={twMerge("h-auto w-[3px] rounded-sm ", colorClass)} />
      <div>
        <Text variant="text-12-bold" className="text-darkCustom">
          {label}
        </Text>
        <Text variant="text-12-light" className="text-darkCustom">
          {value}
        </Text>
      </div>
    </div>
  );
};

export default TooltipLineProgressBarMonitored;
