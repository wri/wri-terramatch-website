import { FC } from "react";
import { twMerge } from "tailwind-merge";

import Text from "@/components/elements/Text/Text";

export enum IntensityEnum {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high"
}

interface IntensityProps {
  className?: string;
  intensity: IntensityEnum;
}

const Intensity: FC<IntensityProps> = (props: IntensityProps) => {
  const { className, intensity } = props;
  const intensityColor = {
    [IntensityEnum.HIGH]: "bg-[#E42222]",
    [IntensityEnum.MEDIUM]: "bg-[#FF8838]",
    [IntensityEnum.LOW]: "bg-[#FFD738]"
  };

  const intensityText = {
    [IntensityEnum.HIGH]: "High",
    [IntensityEnum.MEDIUM]: "Medium",
    [IntensityEnum.LOW]: "Low"
  };

  return (
    <Text variant="text-14-light" className={twMerge("flex items-center gap-2 leading-none", className)}>
      <div className={twMerge("h-2 w-2 shrink-0 rounded-full", intensityColor[intensity])} />
      {intensityText[intensity]}
    </Text>
  );
};

export default Intensity;
