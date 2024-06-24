import { Option } from "@/types/common";

export const filterRestorationStrategiesOptions = (restorationOptions: Option[], project: any): string[] => {
  return restorationOptions
    .filter(option => project.restoration_strategy.includes(option?.value!))
    .map(option => option.value.toString());
};
