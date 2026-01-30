import { BadgeStatus } from "@/redesignComponents/navigation/FormNavigation/formNavigation.constants";

export interface StepProps {
  index: number;
  status: BadgeStatus;
  label: string;
  actions?: React.ReactNode;
  onClick?: () => void;
}

export interface ProgressStepsProps {
  steps: StepProps[];
}
