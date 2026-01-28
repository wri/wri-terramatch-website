export interface StepProps {
  index: number;
  status: "completed" | "active" | "available" | "disabled" | "error";
  label: string;
  actions?: React.ReactNode;
}

export interface ProgressStepsProps {
  steps: StepProps[];
}
