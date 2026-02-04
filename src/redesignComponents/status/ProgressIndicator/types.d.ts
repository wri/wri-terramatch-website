import { BadgeStatus } from "@/redesignComponents/navigation/FormNavigation/formNavigation.constants";

export interface StepProps {
  index: number;
  status: BadgeStatus;
  label: string;
  actions?: React.ReactNode;
  onClick?: () => void;
  isFocused?: boolean;
  isHovered?: boolean;
  isPressed?: boolean;
}

export interface ProgressStepsProps {
  steps: StepProps[];
}
