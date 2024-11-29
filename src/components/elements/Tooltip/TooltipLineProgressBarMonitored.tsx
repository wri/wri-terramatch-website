import { twMerge } from "tailwind-merge";

import Text from "../Text/Text";

export interface TooltipLineProgressBarMonitoredProps {
  value: string;
  max: number;
  label: string;
  monitored: { count: number; status: string }[];
}

const TooltipLineProgressBarMonitored = ({ value, label }: TooltipLineProgressBarMonitoredProps) => {
  const colorBg: { [key: string]: string } = {
    Draft: "bg-neutral-500",
    Submitted: "bg-primary ",
    "Needs Info": "bg-tertiary-600",
    Approved: "bg-success-600 "
  };

  return (
    <div className="flex gap-1.5 rounded-md bg-white p-2 shadow-monitored">
      <div className={twMerge("h-auto w-[3px] rounded-sm ", colorBg[label])} />
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
