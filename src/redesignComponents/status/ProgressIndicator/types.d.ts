import { BadgeStatus } from "@/redesignComponents/navigation/FormNavigation/formNavigation.constants";

export interface StepProps {
  index: number;
  status: BadgeStatus;
  label: string;
  actions?: any;
  onClick?: () => void;
}

export interface ProgressStepsProps {
  steps: StepProps[];
}
